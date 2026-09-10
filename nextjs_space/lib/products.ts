import { cache } from 'react'
import { getPrisma } from '@/lib/prisma'
import { SERIES_CONFIG, SeriesGroup } from '@/lib/types'

/** One entry of the catalogue, as the series grouping exposes it. */
export type CatalogueEntry = SeriesGroup['products'][number]

/**
 * The catalogue, grouped by series in display order.
 *
 * Shared by /boutique and by the /api/products route so the two cannot drift.
 * The page calls this directly rather than fetching its own API over HTTP: that
 * round-trip cost a second network hop on top of the database query, and it kept
 * the page dynamic. Reading Prisma here lets /boutique prerender.
 *
 * Deliberately lets a database error propagate. During a build that is what we
 * want — `prisma migrate deploy` runs first, so a reachable database is already
 * a precondition. During an ISR revalidation Next keeps serving the last good
 * page when the render throws, whereas swallowing the error would cache an empty
 * shop until the next revalidation.
 */
export const getSeriesGroups = cache(async (): Promise<SeriesGroup[]> => {
  const products = await getPrisma().product.findMany({
    orderBy: { createdAt: 'asc' },
  })

  const groups: SeriesGroup[] = SERIES_CONFIG.map(({ key, label }) => ({
    series: key,
    label,
    products: products.filter((p) => p.series === key),
  })).filter((g) => g.products.length > 0)

  // Anything with an unknown or missing series still has to be reachable.
  const knownKeys = new Set(SERIES_CONFIG.map((s) => s.key))
  const others = products.filter((p) => !p.series || !knownKeys.has(p.series))
  if (others.length > 0) {
    groups.push({ series: 'autres', label: 'Autres ressources', products: others })
  }

  return groups
})

/**
 * The catalogue as one flat list, in the order the shop displays it: series by
 * series, and by date of addition within each.
 *
 * Derived from getSeriesGroups rather than re-querying, so the reading order of
 * the previous/next links is by construction the order a visitor sees on
 * /boutique. Reorder SERIES_CONFIG and both follow together.
 */
export const getOrderedProducts = cache(async (): Promise<CatalogueEntry[]> => {
  const groups = await getSeriesGroups()
  return groups.flatMap((group) => group.products)
})

/**
 * The neighbours of a product in that reading order.
 *
 * No wrap-around: the first book has no previous and the last has no next,
 * which is what tells a reader they have reached an end of the catalogue.
 */
export const getAdjacentProducts = cache(
  async (id: string): Promise<{ prev: CatalogueEntry | null; next: CatalogueEntry | null }> => {
    const ordered = await getOrderedProducts()
    const index = ordered.findIndex((product) => product.id === id)

    // Unknown id: a product that exists but sits outside the grouping cannot
    // happen (unmatched series fall into "Autres ressources"), so this only
    // guards against being called for something that is not in the catalogue.
    if (index === -1) return { prev: null, next: null }

    return {
      prev: ordered[index - 1] ?? null,
      next: ordered[index + 1] ?? null,
    }
  },
)

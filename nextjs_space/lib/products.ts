import { getPrisma } from '@/lib/prisma'
import { SERIES_CONFIG, SeriesGroup } from '@/lib/types'

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
export async function getSeriesGroups(): Promise<SeriesGroup[]> {
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
}

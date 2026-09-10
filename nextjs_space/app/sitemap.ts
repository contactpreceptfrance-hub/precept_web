import type { MetadataRoute } from 'next'
import { getPrisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/site'

// Product pages come from the database, so the sitemap is rebuilt hourly rather
// than frozen at deploy time — adding a book should not need a redeploy to be
// discoverable.
export const revalidate = 3600

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',                  priority: 1.0, changeFrequency: 'monthly' },
  { path: '/boutique',         priority: 0.9, changeFrequency: 'weekly' },
  { path: '/etude',            priority: 0.8, changeFrequency: 'monthly' },
  { path: '/cgv',              priority: 0.3, changeFrequency: 'yearly' },
  { path: '/confidentialite',  priority: 0.3, changeFrequency: 'yearly' },
  { path: '/mentions-legales', priority: 0.3, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  // A database hiccup must not take the whole sitemap down: serving the fixed
  // pages alone beats serving a 500 to a crawler.
  let products: { id: string; updatedAt: Date }[] = []
  try {
    products = await getPrisma().product.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    console.error('sitemap: could not load products', error)
  }

  return [
    ...staticEntries,
    ...products.map((product) => ({
      url: `${SITE_URL}/boutique/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}

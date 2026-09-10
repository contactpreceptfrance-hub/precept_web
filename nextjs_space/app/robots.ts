import type { MetadataRoute } from 'next'
import { SITE_URL, IS_INDEXABLE } from '@/lib/site'

/**
 * Replaces the former public/robots.txt, which allowed everything but pointed at
 * no sitemap. Generated rather than static so the Sitemap line follows the
 * canonical origin, and so preview deployments disallow crawling instead of
 * advertising themselves as a duplicate of the production site.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Nothing useful to a crawler, and the success page carries an order id.
      disallow: ['/api/', '/boutique/succes', '/boutique/annule'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

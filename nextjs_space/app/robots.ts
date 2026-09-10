import type { MetadataRoute } from 'next'
import { SITE_URL, IS_INDEXABLE } from '@/lib/site'

/**
 * Evaluated per request, not baked in at build time.
 *
 * Vercel restores the build cache from a previous deployment, and Next reuses
 * the prerendered output of routes whose sources have not changed — across
 * environments. A preview deployment was observed serving the `Allow` rules
 * built by an earlier *production* deployment, because this file and lib/site.ts
 * were untouched while other routes rebuilt normally.
 *
 * Harmless in that direction, since previews sit behind Vercel SSO. The reverse
 * is not: a production deployment reusing a preview's cached output would serve
 * `Disallow: /` and deindex the whole site. Reading VERCEL_ENV at request time
 * costs one tiny function invocation and cannot go stale.
 */
export const dynamic = 'force-dynamic'

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

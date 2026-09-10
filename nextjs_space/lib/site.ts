/**
 * Canonical origin for everything that must stay correct when the same code is
 * rendered on a preview deployment: metadataBase, Open Graph URLs, the sitemap
 * and robots.txt.
 *
 * Deliberately NOT derived from the Host / X-Forwarded-Host headers. Those are
 * request-controlled, so on a *.vercel.app preview they emit canonical and Open
 * Graph tags pointing at the preview — offering search engines a duplicate of
 * the whole site. app/api/checkout/route.ts already refuses the same headers,
 * for the same reason.
 *
 * Reading it from the environment rather than a request also keeps every page
 * free of dynamic APIs, which is what lets them render statically.
 */
const CANONICAL_ORIGIN = 'https://www.preceptfrance.fr' // the apex 307s to www

export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === 'production' ? CANONICAL_ORIGIN : 'http://localhost:3000')
).replace(/\/+$/, '')

/**
 * Whether this deployment may be indexed.
 *
 * VERCEL_ENV — not NODE_ENV — is the reliable signal: `next build` sets NODE_ENV
 * to "production" on preview deployments too, so it cannot tell the two apart.
 * Off Vercel (local, CI) there is no VERCEL_ENV and nothing to index.
 */
export const IS_INDEXABLE =
  process.env.VERCEL_ENV === 'production' && SITE_URL === CANONICAL_ORIGIN

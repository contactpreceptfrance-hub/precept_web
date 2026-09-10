import { getPrisma } from '@/lib/prisma'

/**
 * Request rate limiting, backed by Postgres.
 *
 * Why not an in-memory Map: on Vercel the counter would live per lambda
 * instance. Several run concurrently, so the effective limit becomes the limit
 * times the number of warm instances — and it grows precisely under the load
 * you wanted to limit. A cold start resets it to zero, so an attacker pacing
 * requests is never limited at all. Postgres is already on the critical path of
 * these routes, and it is shared state, which is the only thing that actually
 * limits anything.
 *
 * The count-then-insert is deliberately not atomic. Two simultaneous requests
 * can both pass the check. For spam and brute-force slowing that is fine, and
 * it avoids a transaction or an advisory lock on every request.
 */

export type RateLimitBucket = 'contact' | 'checkout' | 'admin_login'

/** Rows older than this are useless: the widest window in use is 24 h. */
const RETENTION_MS = 25 * 60 * 60 * 1000

/** Roughly one request in 25 pays for the cleanup. */
const PURGE_PROBABILITY = 0.04

/**
 * The caller's IP, as best Vercel can tell us.
 *
 * `NextRequest.ip` exists in Next 14 and was REMOVED in Next 15 — when this app
 * is upgraded, this function is the one place that needs revisiting.
 */
export function clientIp(req: Request & { ip?: string }): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return req.ip ?? forwarded?.split(',')[0]?.trim() ?? 'unknown'
}

/**
 * Same, for callers that have no Request object.
 *
 * Server Actions are invoked without one, so they read `headers()` from
 * next/headers and hand the result here.
 */
export function clientIpFromHeaders(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

/**
 * A salted, non-reversible fingerprint of an address.
 *
 * The raw IP is never stored. Without the salt a rainbow table over the whole
 * IPv4 space would undo a bare hash in minutes, so `RATE_LIMIT_SALT` is what
 * makes this worth calling a fingerprint rather than a stored address.
 */
async function hashIp(ip: string): Promise<string> {
  const salt = process.env.RATE_LIMIT_SALT ?? ''
  const bytes = new TextEncoder().encode(`${ip}:${salt}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Whether this request is allowed, recording it if so.
 *
 * Fails OPEN: if the database is unreachable the request is allowed through.
 * A spam limiter must never be the reason a customer cannot check out or a
 * legitimate message is lost.
 */
export async function checkRateLimit(
  bucket: RateLimitBucket,
  ip: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: boolean }> {
  if (!process.env.RATE_LIMIT_SALT) {
    console.warn('RATE_LIMIT_SALT is not set — rate limiting is disabled')
    return { ok: true }
  }

  try {
    const prisma = getPrisma()
    const ipHash = await hashIp(ip)
    const since = new Date(Date.now() - windowMs)

    const recent = await prisma.rateLimitHit.count({
      where: { bucket, ipHash, createdAt: { gte: since } },
    })

    if (recent >= limit) return { ok: false }

    await prisma.rateLimitHit.create({ data: { bucket, ipHash } })

    if (Math.random() < PURGE_PROBABILITY) {
      await prisma.rateLimitHit
        .deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RETENTION_MS) } } })
        .catch(() => {})
    }

    return { ok: true }
  } catch (error) {
    console.error(`Rate limit check failed for bucket "${bucket}":`, error)
    return { ok: true }
  }
}

/**
 * The limits in force, in one place so they can be read at a glance.
 *
 * `checkout` is listed here because it is currently unlimited: anyone can make
 * the site create Stripe Checkout Sessions without end.
 */
export const RATE_LIMITS = {
  contactHourly: { limit: 5, windowMs: 60 * 60 * 1000 },
  contactDaily: { limit: 20, windowMs: 24 * 60 * 60 * 1000 },
  checkout: { limit: 20, windowMs: 60 * 60 * 1000 },
  adminLogin: { limit: 10, windowMs: 15 * 60 * 1000 },
} as const

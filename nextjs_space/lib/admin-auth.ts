/**
 * Admin session: one shared password, one signed cookie.
 *
 * There is no user model and no third-party provider. The team is small, there
 * is one administration area, and the whole security model is a single secret
 * held in an environment variable. When customer accounts arrive this module
 * and the login page are what change — everything else goes through
 * `requireAdmin()`, which is the seam.
 *
 * EDGE-SAFE, DELIBERATELY. `middleware.ts` imports this and runs on the Edge
 * runtime, so nothing here may reach for `node:crypto`, Prisma, or any other
 * Node-only API. Web Crypto (`globalThis.crypto.subtle`) exists on both
 * runtimes; `node:crypto` does not. If this file ever grows a Node import, the
 * build fails when it compiles the middleware — which is the check working.
 *
 * `jose` was rejected: it earns its place when you need JWS/JWE interop with a
 * third party, asymmetric keys or key rotation. None applies. This payload has
 * two fields and no external consumer.
 */

export const ADMIN_COOKIE_NAME = 'pf_admin'

/** Absolute lifetime. Short enough that a forgotten open session expires. */
const SESSION_TTL_SECONDS = 8 * 60 * 60

type SessionPayload = {
  /** Format version. Bumping it invalidates every cookie in circulation. */
  v: 1
  iat: number
  exp: number
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  // Off locally so http://localhost works; on everywhere that matters.
  secure: process.env.NODE_ENV === 'production',
  // 'lax', not 'strict': with 'strict', following an /admin link from an e-mail
  // or a chat shows the login page even when the session is valid — a daily
  // annoyance. 'lax' still blocks cross-site POST, and Server Actions are
  // same-site.
  sameSite: 'lax' as const,
  // '/' rather than '/admin' so logout, wherever it is rendered from, clears
  // the same cookie it set.
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
}

const encoder = new TextEncoder()

function base64urlEncode(bytes: Uint8Array): string {
  // Indexed rather than for...of: tsconfig targets es5, where iterating a
  // typed array needs downlevelIteration. Not worth changing the target of the
  // whole app for one loop.
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
  const binary = atob(base64 + padding)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))
}

/** Both secrets, or nothing. A missing environment variable must fail closed. */
function readSecrets(): { password: string; sessionSecret: string } | null {
  const password = process.env.ADMIN_PASSWORD
  const sessionSecret = process.env.ADMIN_SESSION_SECRET
  if (!password || !sessionSecret) {
    console.error(
      'ADMIN_PASSWORD and ADMIN_SESSION_SECRET must both be set — admin access is disabled',
    )
    return null
  }
  return { password, sessionSecret }
}

/**
 * Whether the admin area has been configured at all.
 *
 * Separate from `checkAdminPassword` so the login page can tell "you mistyped"
 * apart from "this deployment has no ADMIN_PASSWORD". Without it, an
 * unconfigured deployment answers every attempt with "wrong password", and the
 * team has no way to tell that the problem is not theirs.
 *
 * Disclosing this costs nothing: an unconfigured deployment refuses everyone
 * regardless, so the answer helps only the operator.
 */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
}

async function hmacKey(sessionSecret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(sessionSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

/**
 * A fresh signed cookie value: `base64url(payload).base64url(signature)`.
 *
 * The signature covers the base64url TEXT of the payload, not the raw JSON, so
 * signing and verifying cannot disagree over key order or whitespace. base64url
 * never contains a `.`, which makes the separator unambiguous.
 */
export async function createSessionCookieValue(): Promise<string | null> {
  const secrets = readSecrets()
  if (!secrets) return null

  const now = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = { v: 1, iat: now, exp: now + SESSION_TTL_SECONDS }
  const payloadText = base64urlEncode(encoder.encode(JSON.stringify(payload)))

  const signature = await crypto.subtle.sign(
    'HMAC',
    await hmacKey(secrets.sessionSecret),
    encoder.encode(payloadText),
  )

  return `${payloadText}.${base64urlEncode(new Uint8Array(signature))}`
}

/**
 * Whether a cookie value is a session we issued and that has not expired.
 *
 * Order matters: parse, then verify the signature, and only THEN read `exp`.
 * Nothing inside the payload is trustworthy until the signature says so —
 * otherwise anyone could push their own expiry into the future.
 *
 * `exp` lives inside the signed payload rather than relying on Max-Age, which
 * is a hint the client is free to ignore.
 */
export async function verifySessionCookieValue(value: string | undefined): Promise<boolean> {
  if (!value) return false

  const secrets = readSecrets()
  if (!secrets) return false

  try {
    const separator = value.indexOf('.')
    if (separator <= 0 || separator === value.length - 1) return false

    const payloadText = value.slice(0, separator)
    const signatureText = value.slice(separator + 1)

    const valid = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(secrets.sessionSecret),
      base64urlDecode(signatureText),
      encoder.encode(payloadText),
    )
    if (!valid) return false

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadText))) as
      | SessionPayload
      | undefined

    if (!payload || payload.v !== 1 || typeof payload.exp !== 'number') return false
    return payload.exp * 1000 > Date.now()
  } catch {
    // Malformed base64, malformed JSON, truncated cookie: all just "not a
    // session". Never a 500.
    return false
  }
}

/**
 * Constant-time password check.
 *
 * `node:crypto.timingSafeEqual` is unavailable on the Edge runtime and also
 * throws on unequal lengths, which leaks the length of the secret. Hashing both
 * sides first gives two 32-byte digests: always the same length, and the
 * comparison below never returns early.
 */
export async function checkAdminPassword(candidate: string): Promise<boolean> {
  const secrets = readSecrets()
  if (!secrets) return false

  const [given, expected] = await Promise.all([sha256(candidate), sha256(secrets.password)])

  let difference = 0
  for (let i = 0; i < expected.length; i++) difference |= given[i] ^ expected[i]
  return difference === 0
}

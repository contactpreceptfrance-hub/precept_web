import crypto from 'node:crypto'

/**
 * Derives a 32-byte encryption key from an environment secret.
 * Falls back to ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) if ENCRYPTION_KEY is not defined.
 */
function getEncryptionKey(): Buffer {
  const secret =
    process.env.ENCRYPTION_KEY ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD

  if (!secret) {
    throw new Error(
      'Cannot encrypt/decrypt secrets: neither ENCRYPTION_KEY, ADMIN_SESSION_SECRET, nor ADMIN_PASSWORD is set.',
    )
  }

  return crypto.createHash('sha256').update(secret).digest()
}

/**
 * Encrypts sensitive string using AES-256-GCM.
 * Output format: `iv:tag:ciphertext` (all in hex).
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return ''

  const key = getEncryptionKey()
  const iv = crypto.randomBytes(12) // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag() // 128-bit authentication tag

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
}

/**
 * Decrypts an AES-256-GCM encrypted payload (`iv:tag:ciphertext` in hex).
 */
export function decryptSecret(cipherPayload: string): string {
  if (!cipherPayload) return ''

  const parts = cipherPayload.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format: expected iv:tag:ciphertext')
  }

  const [ivHex, tagHex, dataHex] = parts
  const key = getEncryptionKey()
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const data = Buffer.from(dataHex, 'hex')

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)

  const decrypted = Buffer.concat([
    decipher.update(data),
    decipher.final(),
  ])

  return decrypted.toString('utf8')
}

/**
 * Masks a secret string for secure display in the UI without exposing full credentials.
 * E.g. `sk_test_51Abc...xyz1` becomes `sk_test_••••••••xyz1`.
 */
export function maskSecret(secret: string): string {
  if (!secret) return ''
  const trimmed = secret.trim()
  if (trimmed.length <= 8) return '••••••••'

  const prefixes = ['sk_test_', 'sk_live_', 'rk_test_', 'rk_live_', 'whsec_']
  for (const prefix of prefixes) {
    if (trimmed.startsWith(prefix)) {
      const suffix = trimmed.slice(-4)
      return `${prefix}••••••••${suffix}`
    }
  }

  const prefix = trimmed.slice(0, 4)
  const suffix = trimmed.slice(-4)
  return `${prefix}••••••••${suffix}`
}

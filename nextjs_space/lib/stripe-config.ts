import { getPrisma } from '@/lib/prisma'
import { decryptSecret, encryptSecret, maskSecret } from '@/lib/crypto'

export const STRIPE_SETTING_KEYS = {
  MODE: 'stripe_mode',
  TEST_SECRET_KEY: 'stripe_test_secret_key',
  TEST_WEBHOOK_SECRET: 'stripe_test_webhook_secret',
  LIVE_SECRET_KEY: 'stripe_live_secret_key',
  LIVE_WEBHOOK_SECRET: 'stripe_live_webhook_secret',
} as const

export type StripeMode = 'test' | 'live'

export type ActiveStripeCredentials = {
  mode: StripeMode
  secretKey: string
  webhookSecret: string
  secretKeySource: 'database' | 'env' | 'missing'
  webhookSecretSource: 'database' | 'env' | 'missing'
}

export type KeyStatus = {
  configured: boolean
  masked: string | null
  source: 'database' | 'env' | 'none'
}

export type StripeAdminSettings = {
  mode: StripeMode
  modeSource: 'database' | 'default'
  testSecretKey: KeyStatus
  testWebhookSecret: KeyStatus
  liveSecretKey: KeyStatus
  liveWebhookSecret: KeyStatus
}

/**
 * Loads all Stripe-related settings from the AppSetting table.
 */
async function loadStripeSettingsMap(): Promise<Map<string, string>> {
  try {
    const prisma = getPrisma()
    const rows = await prisma.appSetting.findMany({
      where: {
        key: {
          in: Object.values(STRIPE_SETTING_KEYS),
        },
      },
    })
    return new Map(rows.map(r => [r.key, r.value]))
  } catch (error) {
    console.warn('Failed to load Stripe settings from database:', error)
    return new Map()
  }
}

/**
 * Retrieves the currently active Stripe credentials based on active mode,
 * with automatic fallback to environment variables.
 */
export async function getActiveStripeCredentials(): Promise<ActiveStripeCredentials> {
  const settings = await loadStripeSettingsMap()

  const rawMode = settings.get(STRIPE_SETTING_KEYS.MODE)
  // Default to 'live' unless explicitly configured as 'test' in DB or env indicates test
  let mode: StripeMode = 'live'
  if (rawMode === 'test') {
    mode = 'test'
  } else if (!rawMode && process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
    mode = 'test'
  }

  let dbSecretKeyCipher: string | undefined
  let dbWebhookCipher: string | undefined

  if (mode === 'test') {
    dbSecretKeyCipher = settings.get(STRIPE_SETTING_KEYS.TEST_SECRET_KEY)
    dbWebhookCipher = settings.get(STRIPE_SETTING_KEYS.TEST_WEBHOOK_SECRET)
  } else {
    dbSecretKeyCipher = settings.get(STRIPE_SETTING_KEYS.LIVE_SECRET_KEY)
    dbWebhookCipher = settings.get(STRIPE_SETTING_KEYS.LIVE_WEBHOOK_SECRET)
  }

  let secretKey = ''
  let secretKeySource: ActiveStripeCredentials['secretKeySource'] = 'missing'

  if (dbSecretKeyCipher) {
    try {
      secretKey = decryptSecret(dbSecretKeyCipher)
      secretKeySource = 'database'
    } catch (e) {
      console.error(`Failed to decrypt database Stripe ${mode} secret key:`, e)
    }
  }

  if (!secretKey && process.env.STRIPE_SECRET_KEY) {
    secretKey = process.env.STRIPE_SECRET_KEY
    secretKeySource = 'env'
  }

  let webhookSecret = ''
  let webhookSecretSource: ActiveStripeCredentials['webhookSecretSource'] = 'missing'

  if (dbWebhookCipher) {
    try {
      webhookSecret = decryptSecret(dbWebhookCipher)
      webhookSecretSource = 'database'
    } catch (e) {
      console.error(`Failed to decrypt database Stripe ${mode} webhook secret:`, e)
    }
  }

  if (!webhookSecret && process.env.STRIPE_WEBHOOK_SECRET) {
    webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    webhookSecretSource = 'env'
  }

  return {
    mode,
    secretKey,
    webhookSecret,
    secretKeySource,
    webhookSecretSource,
  }
}

/**
 * Reads settings formatted for administration UI display (with masked secrets).
 */
export async function getStripeSettingsForAdmin(): Promise<StripeAdminSettings> {
  const settings = await loadStripeSettingsMap()

  const rawMode = settings.get(STRIPE_SETTING_KEYS.MODE)
  const mode: StripeMode = rawMode === 'test' ? 'test' : 'live'
  const modeSource = rawMode ? 'database' : 'default'

  function resolveKeyStatus(
    dbCipherKey: string | undefined,
    envFallbackKey: string | undefined,
  ): KeyStatus {
    if (dbCipherKey) {
      try {
        const decrypted = decryptSecret(dbCipherKey)
        return {
          configured: true,
          masked: maskSecret(decrypted),
          source: 'database',
        }
      } catch {
        return {
          configured: true,
          masked: '•••• [Erreur de déchiffrement]',
          source: 'database',
        }
      }
    }

    if (envFallbackKey) {
      return {
        configured: true,
        masked: maskSecret(envFallbackKey),
        source: 'env',
      }
    }

    return {
      configured: false,
      masked: null,
      source: 'none',
    }
  }

  return {
    mode,
    modeSource,
    testSecretKey: resolveKeyStatus(
      settings.get(STRIPE_SETTING_KEYS.TEST_SECRET_KEY),
      process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || process.env.STRIPE_SECRET_KEY?.startsWith('rk_test_')
        ? process.env.STRIPE_SECRET_KEY
        : undefined,
    ),
    testWebhookSecret: resolveKeyStatus(
      settings.get(STRIPE_SETTING_KEYS.TEST_WEBHOOK_SECRET),
      process.env.STRIPE_WEBHOOK_SECRET,
    ),
    liveSecretKey: resolveKeyStatus(
      settings.get(STRIPE_SETTING_KEYS.LIVE_SECRET_KEY),
      process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') || process.env.STRIPE_SECRET_KEY?.startsWith('rk_live_')
        ? process.env.STRIPE_SECRET_KEY
        : undefined,
    ),
    liveWebhookSecret: resolveKeyStatus(
      settings.get(STRIPE_SETTING_KEYS.LIVE_WEBHOOK_SECRET),
      process.env.STRIPE_WEBHOOK_SECRET,
    ),
  }
}

/**
 * Upserts a setting in the AppSetting table.
 */
export async function setAppSetting(key: string, value: string, isSecret = false): Promise<void> {
  const prisma = getPrisma()
  await prisma.appSetting.upsert({
    where: { key },
    create: { key, value, isSecret },
    update: { value, isSecret },
  })
}

/**
 * Removes a setting from the AppSetting table.
 */
export async function deleteAppSetting(key: string): Promise<void> {
  const prisma = getPrisma()
  await prisma.appSetting.deleteMany({
    where: { key },
  })
}

/**
 * Saves Stripe configuration updates. Encrypts sensitive secrets.
 */
export async function updateStripeConfiguration(data: {
  mode?: StripeMode
  testSecretKey?: string
  testWebhookSecret?: string
  liveSecretKey?: string
  liveWebhookSecret?: string
}): Promise<void> {
  if (data.mode) {
    await setAppSetting(STRIPE_SETTING_KEYS.MODE, data.mode, false)
  }

  if (data.testSecretKey !== undefined) {
    if (data.testSecretKey.trim() === '') {
      await deleteAppSetting(STRIPE_SETTING_KEYS.TEST_SECRET_KEY)
    } else {
      await setAppSetting(
        STRIPE_SETTING_KEYS.TEST_SECRET_KEY,
        encryptSecret(data.testSecretKey.trim()),
        true,
      )
    }
  }

  if (data.testWebhookSecret !== undefined) {
    if (data.testWebhookSecret.trim() === '') {
      await deleteAppSetting(STRIPE_SETTING_KEYS.TEST_WEBHOOK_SECRET)
    } else {
      await setAppSetting(
        STRIPE_SETTING_KEYS.TEST_WEBHOOK_SECRET,
        encryptSecret(data.testWebhookSecret.trim()),
        true,
      )
    }
  }

  if (data.liveSecretKey !== undefined) {
    if (data.liveSecretKey.trim() === '') {
      await deleteAppSetting(STRIPE_SETTING_KEYS.LIVE_SECRET_KEY)
    } else {
      await setAppSetting(
        STRIPE_SETTING_KEYS.LIVE_SECRET_KEY,
        encryptSecret(data.liveSecretKey.trim()),
        true,
      )
    }
  }

  if (data.liveWebhookSecret !== undefined) {
    if (data.liveWebhookSecret.trim() === '') {
      await deleteAppSetting(STRIPE_SETTING_KEYS.LIVE_WEBHOOK_SECRET)
    } else {
      await setAppSetting(
        STRIPE_SETTING_KEYS.LIVE_WEBHOOK_SECRET,
        encryptSecret(data.liveWebhookSecret.trim()),
        true,
      )
    }
  }
}

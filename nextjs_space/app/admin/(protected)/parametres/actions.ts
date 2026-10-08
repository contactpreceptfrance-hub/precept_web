'use server'

import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'
import { requireAdmin } from '@/lib/admin-guard'
import {
  STRIPE_SETTING_KEYS,
  StripeMode,
  getActiveStripeCredentials,
  updateStripeConfiguration,
  deleteAppSetting,
} from '@/lib/stripe-config'
import { invalidateStripeCache } from '@/lib/stripe'

export type ActionResult<T = unknown> =
  | { ok: true; message: string; data?: T }
  | { ok: false; error: string }

/**
 * Tests connectivity to Stripe using either a provided candidate key
 * or the currently configured key for that mode.
 */
export async function testStripeConnectionAction(
  mode: StripeMode,
  candidateKey?: string,
): Promise<ActionResult<{ livemode: boolean }>> {
  await requireAdmin()

  let keyToTest = candidateKey?.trim()

  if (!keyToTest) {
    const creds = await getActiveStripeCredentials()
    if (creds.mode === mode && creds.secretKey) {
      keyToTest = creds.secretKey
    } else {
      return {
        ok: false,
        error: `Aucune clé secrète configurée pour le mode ${mode === 'test' ? 'Test' : 'Production'}. Veuillez en saisir une.`,
      }
    }
  }

  // Sanity check prefix matches mode
  if (mode === 'test' && (keyToTest.startsWith('sk_live_') || keyToTest.startsWith('rk_live_'))) {
    return {
      ok: false,
      error: 'La clé commence par sk_live_ : impossible de la tester en Mode Test.',
    }
  }

  if (mode === 'live' && (keyToTest.startsWith('sk_test_') || keyToTest.startsWith('rk_test_'))) {
    return {
      ok: false,
      error: 'La clé commence par sk_test_ : impossible de la tester en Mode Production.',
    }
  }

  try {
    const testStripe = new Stripe(keyToTest)
    const balance = await testStripe.balance.retrieve()
    return {
      ok: true,
      message: `Connexion Stripe réussie (${balance.livemode ? 'Production / Live' : 'Mode Test'}) !`,
      data: { livemode: balance.livemode },
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue lors du test Stripe'
    return {
      ok: false,
      error: `Échec de connexion Stripe : ${msg}`,
    }
  }
}

/**
 * Saves Stripe configuration updates from the admin form.
 */
export async function saveStripeSettingsAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin()

  const mode = formData.get('mode') as StripeMode | null
  const testSecretKeyRaw = formData.get('testSecretKey') as string | null
  const testWebhookSecretRaw = formData.get('testWebhookSecret') as string | null
  const liveSecretKeyRaw = formData.get('liveSecretKey') as string | null
  const liveWebhookSecretRaw = formData.get('liveWebhookSecret') as string | null

  if (mode && mode !== 'test' && mode !== 'live') {
    return { ok: false, error: 'Mode Stripe invalide.' }
  }

  // Key validation if new values are typed
  const testSecretKey = testSecretKeyRaw?.trim()
  if (testSecretKey) {
    if (!testSecretKey.startsWith('sk_test_') && !testSecretKey.startsWith('rk_test_')) {
      return {
        ok: false,
        error: 'La clé secrète de test doit commencer par sk_test_ ou rk_test_',
      }
    }
  }

  const testWebhookSecret = testWebhookSecretRaw?.trim()
  if (testWebhookSecret) {
    if (!testWebhookSecret.startsWith('whsec_')) {
      return {
        ok: false,
        error: 'Le secret de webhook de test doit commencer par whsec_',
      }
    }
  }

  const liveSecretKey = liveSecretKeyRaw?.trim()
  if (liveSecretKey) {
    if (!liveSecretKey.startsWith('sk_live_') && !liveSecretKey.startsWith('rk_live_')) {
      return {
        ok: false,
        error: 'La clé secrète de production doit commencer par sk_live_ ou rk_live_',
      }
    }
  }

  const liveWebhookSecret = liveWebhookSecretRaw?.trim()
  if (liveWebhookSecret) {
    if (!liveWebhookSecret.startsWith('whsec_')) {
      return {
        ok: false,
        error: 'Le secret de webhook de production doit commencer par whsec_',
      }
    }
  }

  try {
    await updateStripeConfiguration({
      mode: mode || undefined,
      testSecretKey: testSecretKey !== undefined && testSecretKey !== '' ? testSecretKey : undefined,
      testWebhookSecret: testWebhookSecret !== undefined && testWebhookSecret !== '' ? testWebhookSecret : undefined,
      liveSecretKey: liveSecretKey !== undefined && liveSecretKey !== '' ? liveSecretKey : undefined,
      liveWebhookSecret: liveWebhookSecret !== undefined && liveWebhookSecret !== '' ? liveWebhookSecret : undefined,
    })

    invalidateStripeCache()
    revalidatePath('/admin/parametres')

    return {
      ok: true,
      message: 'Paramètres Stripe enregistrés avec succès.',
    }
  } catch (error: unknown) {
    console.error('Erreur lors de la sauvegarde des paramètres Stripe:', error)
    return {
      ok: false,
      error: 'Erreur lors de la sauvegarde des paramètres.',
    }
  }
}

/**
 * Clears an individual Stripe key from the database, reverting to .env fallback.
 */
export async function clearStripeKeyAction(
  keyName: string,
): Promise<ActionResult> {
  await requireAdmin()

  const allowedKeys = Object.values(STRIPE_SETTING_KEYS)
  if (!allowedKeys.includes(keyName as (typeof allowedKeys)[number])) {
    return { ok: false, error: 'Clé non autorisée.' }
  }

  try {
    await deleteAppSetting(keyName)
    invalidateStripeCache()
    revalidatePath('/admin/parametres')

    return {
      ok: true,
      message: 'Clé supprimée de la base de données (retour au fallback .env).',
    }
  } catch (error: unknown) {
    console.error('Erreur suppression clé:', error)
    return { ok: false, error: 'Impossible de supprimer la clé.' }
  }
}

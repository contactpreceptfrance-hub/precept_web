'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-guard'
import { getPrisma } from '@/lib/prisma'
import {
  BANK_SETTING_KEYS,
  isValidBic,
  isValidIban,
  normalizeBic,
  normalizeIban,
} from '@/lib/bank-config'

export type BankResult = { ok: true; message: string } | { ok: false; error: string }

/**
 * Saves the bank details donors see on /don. Leaving the IBAN empty removes the
 * bank-transfer block from the page.
 */
export async function saveBankDetailsAction(formData: FormData): Promise<BankResult> {
  await requireAdmin()

  const titulaire = String(formData.get('titulaire') ?? '').trim()
  const iban = normalizeIban(String(formData.get('iban') ?? ''))
  const bic = normalizeBic(String(formData.get('bic') ?? ''))

  if (titulaire.length > 100) return { ok: false, error: 'Titulaire trop long.' }
  if (iban && !isValidIban(iban)) {
    return { ok: false, error: 'IBAN invalide : vérifiez les caractères (contrôle de clé échoué).' }
  }
  if (bic && !isValidBic(bic)) return { ok: false, error: 'BIC invalide (8 ou 11 caractères).' }
  if (iban && !titulaire) return { ok: false, error: 'Indiquez le titulaire du compte.' }

  try {
    const prisma = getPrisma()
    const entries: [string, string][] = [
      [BANK_SETTING_KEYS.HOLDER, titulaire],
      [BANK_SETTING_KEYS.IBAN, iban],
      [BANK_SETTING_KEYS.BIC, bic],
    ]
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.appSetting.upsert({
          where: { key },
          create: { key, value, isSecret: false },
          update: { value },
        }),
      ),
    )
    revalidatePath('/admin/parametres')
    // /don is cached for an hour; the donor must see the change now.
    revalidatePath('/don')
    return {
      ok: true,
      message: iban ? 'Coordonnées bancaires enregistrées.' : 'IBAN retiré : le bloc virement est masqué.',
    }
  } catch (error) {
    console.error('Erreur sauvegarde coordonnées bancaires:', error)
    return { ok: false, error: 'Erreur lors de la sauvegarde.' }
  }
}

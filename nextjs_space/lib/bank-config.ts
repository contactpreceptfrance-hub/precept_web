import { getPrisma } from '@/lib/prisma'
import { LEGAL } from '@/lib/legal'

export const BANK_SETTING_KEYS = {
  HOLDER: 'bank_holder',
  IBAN: 'bank_iban',
  BIC: 'bank_bic',
} as const

export type BankDetails = { titulaire: string; iban: string; bic: string }

/** Spaces are display-only; stored and checked without them. */
export const normalizeIban = (value: string) => value.replace(/\s+/g, '').toUpperCase()
export const normalizeBic = (value: string) => value.replace(/\s+/g, '').toUpperCase()

/** Groups of four, the way an IBAN is printed on a RIB. */
export const formatIban = (value: string) => normalizeIban(value).replace(/(.{4})/g, '$1 ').trim()

/**
 * ISO 13616 check: country + length shape, then mod-97 over the rearranged
 * digits. Catches a mistyped or truncated IBAN before it is shown to donors.
 */
export function isValidIban(raw: string): boolean {
  const iban = normalizeIban(raw)
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false
  const rearranged = iban.slice(4) + iban.slice(0, 4)
  const digits = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55))
  let remainder = 0
  for (const ch of digits) remainder = (remainder * 10 + Number(ch)) % 97
  return remainder === 1
}

export const isValidBic = (raw: string) => /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(normalizeBic(raw))

/**
 * Bank details shown on /don: the admin-saved values, else the (empty by
 * default) ones in lib/legal.ts. A database failure falls back rather than
 * breaking the donation page.
 */
export async function getBankDetails(): Promise<BankDetails> {
  const fallback = { titulaire: LEGAL.banque.titulaire, iban: LEGAL.banque.iban, bic: LEGAL.banque.bic }
  try {
    const rows = await getPrisma().appSetting.findMany({
      where: { key: { in: Object.values(BANK_SETTING_KEYS) } },
    })
    const map = new Map(rows.map((r) => [r.key, r.value]))
    return {
      titulaire: map.get(BANK_SETTING_KEYS.HOLDER) ?? fallback.titulaire,
      iban: map.get(BANK_SETTING_KEYS.IBAN) ?? fallback.iban,
      bic: map.get(BANK_SETTING_KEYS.BIC) ?? fallback.bic,
    }
  } catch (error) {
    console.warn('Failed to load bank details from database:', error)
    return fallback
  }
}

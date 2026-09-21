import type Stripe from 'stripe'

/**
 * Countries Checkout offers for delivery: France (mainland plus the overseas
 * departments Guadeloupe, Martinique, Guyane, La Réunion and Mayotte), Belgium,
 * Switzerland, Luxembourg and Monaco. Stripe only lets the customer pick from
 * this list, so anything outside it cannot be ordered.
 */
export const SHIPPING_COUNTRIES: NonNullable<
  NonNullable<Parameters<Stripe['checkout']['sessions']['create']>[0]>['shipping_address_collection']
>['allowed_countries'] = ['FR', 'GP', 'MQ', 'GF', 'RE', 'YT', 'BE', 'CH', 'LU', 'MC']

/**
 * Flat delivery fee, in cents, added to every order whatever its size or
 * destination. Charged by Stripe as a shipping option and shown to the customer
 * in the basket and on the payment page, before they pay (CGV article 4).
 */
export const SHIPPING_FEE_CENTS = 490

type StripeAddress = {
  line1?: string | null
  line2?: string | null
  postal_code?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
}

export type StripeShippingDetails = {
  name?: string | null
  address?: StripeAddress | null
}

/**
 * The delivery details on a Checkout Session, wherever this API version puts
 * them: newer versions nest them in `collected_information`, older ones (which a
 * webhook endpoint pinned to an older version still sends) have them at the
 * top level.
 */
export function pickShippingDetails(session: {
  collected_information?: { shipping_details?: StripeShippingDetails | null } | null
  shipping_details?: StripeShippingDetails | null
}): StripeShippingDetails | null {
  return session.collected_information?.shipping_details ?? session.shipping_details ?? null
}

const countryNames = new Intl.DisplayNames(['fr'], { type: 'region' })

/**
 * One address as the plain multi-line text stored in `Order.shippingAddress`
 * (the admin renders it with `whitespace-pre-line`). Null when there is no
 * street line, so an incomplete address is reported as missing rather than
 * saved half-empty.
 */
export function formatShippingAddress(details: StripeShippingDetails | null): string | null {
  const address = details?.address
  if (!address?.line1) return null

  const cityLine = [address.postal_code, address.city].filter(Boolean).join(' ')

  let country: string | null = null
  if (address.country) {
    try {
      country = countryNames.of(address.country) ?? address.country
    } catch {
      country = address.country
    }
  }

  return [details?.name, address.line1, address.line2, cityLine, address.state, country]
    .filter((line): line is string => Boolean(line && line.trim()))
    .join('\n')
}

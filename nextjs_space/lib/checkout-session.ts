import { getStripe } from '@/lib/stripe'

/**
 * What /boutique/succes may tell a visitor about the Stripe Checkout session in
 * its URL.
 *
 * - `paid`: Stripe itself says the payment went through.
 * - `pending`: the session exists but has not been paid.
 * - `unknown`: no usable id, no such session, or Stripe could not be reached.
 *   Deliberately one state: the page must not claim a success it could not
 *   verify, and must not help anyone probe which session ids exist.
 */
export type CheckoutOutcome =
  | { status: 'paid'; totalAmount: number; email: string | null }
  | { status: 'pending' }
  | { status: 'unknown' }

/** The slice of a Stripe Checkout Session this page reads. */
type SessionLike = {
  payment_status: string
  amount_total: number | null
  customer_details?: { email?: string | null } | null
}

// Stripe ids are `cs_test_…` / `cs_live_…` followed by alphanumerics. Checked
// before calling Stripe so a garbage query string costs no API request.
const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/

const retrieveFromStripe = (id: string): Promise<SessionLike> =>
  getStripe().checkout.sessions.retrieve(id)

/**
 * Asks Stripe, not the URL: `?session_id=` is something a visitor can type, so
 * it proves nothing on its own. `retrieve` is a parameter so the mapping below
 * can be tested without a Stripe account.
 */
export async function getCheckoutOutcome(
  sessionId: string | undefined,
  retrieve: (id: string) => Promise<SessionLike> = retrieveFromStripe,
): Promise<CheckoutOutcome> {
  if (!sessionId || !SESSION_ID.test(sessionId)) return { status: 'unknown' }

  try {
    const session = await retrieve(sessionId)
    if (session.payment_status === 'paid') {
      return {
        status: 'paid',
        totalAmount: (session.amount_total ?? 0) / 100,
        email: session.customer_details?.email ?? null,
      }
    }
    return { status: 'pending' }
  } catch (error) {
    console.error('checkout success: could not verify session', error)
    return { status: 'unknown' }
  }
}

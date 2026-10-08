import Stripe from 'stripe'
import { getActiveStripeCredentials } from '@/lib/stripe-config'

const globalForStripe = globalThis as unknown as {
  stripeClient?: Stripe
  stripeKey?: string
}

/**
 * Returns a configured Stripe SDK instance using active credentials
 * (from the database or environment variables fallback).
 */
export async function getStripe(): Promise<Stripe> {
  const { secretKey } = await getActiveStripeCredentials()
  if (!secretKey) {
    throw new Error(
      'Stripe secret key is not configured. Please configure it in the administration panel or via STRIPE_SECRET_KEY.',
    )
  }

  if (!globalForStripe.stripeClient || globalForStripe.stripeKey !== secretKey) {
    // No explicit apiVersion: the SDK pins the API version it was built for,
    // and hard-coding it broke the Vercel build every time stripe was bumped.
    globalForStripe.stripeClient = new Stripe(secretKey)
    globalForStripe.stripeKey = secretKey
  }

  return globalForStripe.stripeClient
}

/**
 * Clears the in-memory Stripe client cache so newly updated keys take effect immediately.
 */
export function invalidateStripeCache(): void {
  globalForStripe.stripeClient = undefined
  globalForStripe.stripeKey = undefined
}

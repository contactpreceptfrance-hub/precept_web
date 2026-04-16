import Stripe from 'stripe'

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined
}

export function getStripe(): Stripe {
  if (!globalForStripe.stripe) {
    globalForStripe.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-01-27.acacia',
    })
  }
  return globalForStripe.stripe
}

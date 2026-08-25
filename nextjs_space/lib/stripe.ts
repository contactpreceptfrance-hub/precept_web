import Stripe from 'stripe'

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined
}

export function getStripe(): Stripe {
  if (!globalForStripe.stripe) {
    // No explicit apiVersion: the SDK pins the API version it was built for,
    // and hard-coding it broke the Vercel build every time stripe was bumped.
    globalForStripe.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return globalForStripe.stripe
}

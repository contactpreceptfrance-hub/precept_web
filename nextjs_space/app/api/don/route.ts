import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { RATE_LIMITS, checkRateLimit, clientIp } from '@/lib/rate-limit'
import { donationSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

/**
 * Base URL for Stripe's redirect targets. Same rule as the shop checkout: never
 * derived from request headers, which an attacker controls.
 */
function resolveBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_BASE_URL
  if (configured) return configured.replace(/\/+$/, '')
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:3000'
  return null
}

export async function POST(req: NextRequest) {
  try {
    const { ok } = await checkRateLimit('don', clientIp(req), RATE_LIMITS.don)
    if (!ok) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
        { status: 429 },
      )
    }

    const parsed = donationSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Montant invalide (entre 1 € et 10 000 €).' },
        { status: 400 },
      )
    }
    const { amount, recurring } = parsed.data

    const baseUrl = resolveBaseUrl()
    if (!baseUrl) {
      console.error(
        'NEXT_PUBLIC_BASE_URL is not set — refusing to build redirect URLs from request headers',
      )
      return NextResponse.json({ error: 'Configuration du serveur incomplète' }, { status: 500 })
    }

    const stripe = await getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: recurring ? 'subscription' : 'payment',
      locale: 'fr',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(amount * 100), // Stripe expects cents
            product_data: { name: recurring ? 'Don mensuel — Precept France' : 'Don — Precept France' },
            ...(recurring ? { recurring: { interval: 'month' as const } } : {}),
          },
          quantity: 1,
        },
      ],
      // The webhook tells gifts from book orders by this marker.
      metadata: { kind: 'don' },
      ...(recurring
        ? { subscription_data: { metadata: { kind: 'don' } } }
        : { submit_type: 'donate' as const }),
      success_url: `${baseUrl}/don/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/don`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Donation checkout error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { CartItem } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'fr',
      currency: 'eur',
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
          product_data: {
            name: item.name,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
        },
        quantity: item.quantity,
      })),
      success_url: `${baseUrl}/boutique/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/boutique/annule`,
      metadata: {
        // Store serialised cart for the webhook to use
        cart: JSON.stringify(items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.price }))),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}

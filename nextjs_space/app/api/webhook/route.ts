import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// IMPORTANT: Next.js App Router does not auto-parse body for this route.
// We read raw bytes so Stripe can verify the webhook signature.
export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer()
  const buf = Buffer.from(rawBody)
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id: string
      customer_details?: { email?: string | null; name?: string | null }
      amount_total?: number | null
      metadata?: { cart?: string }
    }

    try {
      const prisma = getPrisma()

      type CartMeta = { productId: string; quantity: number; unitPrice: number }
      const cartItems: CartMeta[] = JSON.parse(session.metadata?.cart ?? '[]')

      await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          customerEmail: session.customer_details?.email ?? '',
          customerName: session.customer_details?.name ?? '',
          totalAmount: (session.amount_total ?? 0) / 100,
          status: 'PAID',
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      })
    } catch (err) {
      console.error('Failed to create Order in DB:', err)
      // Return 200 so Stripe doesn't retry — log and investigate separately
    }
  }

  return NextResponse.json({ received: true })
}

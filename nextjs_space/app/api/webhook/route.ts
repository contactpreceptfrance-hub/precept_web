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

  const stripe = getStripe()

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { id: string; customer_details?: { email?: string | null; name?: string | null }; amount_total?: number | null }

    try {
      const prisma = getPrisma()

      // Read the basket back from Stripe rather than from session metadata.
      // Metadata is echoed verbatim from whatever the browser posted at
      // checkout, so trusting its prices would let a tampered cart decide what
      // we record. What Stripe reports here is what Stripe actually charged.
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ['data.price.product'],
      })

      const charged = lineItems.data.map(line => {
        const product = line.price?.product
        const productId =
          product && typeof product === 'object' && 'metadata' in product
            ? (product.metadata?.productId ?? null)
            : null
        return {
          productId,
          quantity: line.quantity ?? 0,
          unitPrice: (line.price?.unit_amount ?? 0) / 100,
        }
      })

      // A product deleted between checkout and this callback cannot be linked
      // (the foreign key would reject it). Record the rest rather than lose the
      // whole order — the total below comes from Stripe, so it stays correct.
      const known = await prisma.product.findMany({
        where: { id: { in: charged.map(c => c.productId).filter((id): id is string => !!id) } },
        select: { id: true },
      })
      const knownIds = new Set(known.map(p => p.id))
      const linkable = charged.filter(c => c.productId && knownIds.has(c.productId))

      if (linkable.length !== charged.length) {
        console.error(
          `Webhook ${session.id}: ${charged.length - linkable.length} line item(s) could not be ` +
            `linked to a product and were omitted from the order. Charged: ` +
            JSON.stringify(charged),
        )
      }

      await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          customerEmail: session.customer_details?.email ?? '',
          customerName: session.customer_details?.name ?? '',
          totalAmount: (session.amount_total ?? 0) / 100,
          status: 'PAID',
          items: {
            create: linkable.map(item => ({
              productId: item.productId!,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      })
    } catch (err) {
      // Stripe retries a delivery until it gets a 2xx. Previously this returned
      // 200 on failure, which meant a database error silently lost a paid
      // order. Returning 500 lets Stripe retry; the unique constraint on
      // stripeSessionId makes that safe, and a duplicate is treated as done.
      if (typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2002') {
        console.log(`Webhook ${session.id}: order already recorded, ignoring duplicate delivery`)
        return NextResponse.json({ received: true })
      }

      console.error('Failed to create Order in DB:', err)
      return NextResponse.json({ error: 'Order persistence failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getPrisma } from '@/lib/prisma'
import { escapeHtml, sendEmail } from '@/lib/email'

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
        // Snapshotted alongside the price for the same reason: a later rename
        // (or deletion) of the product must not change what a past order shows.
        const productName =
          product && typeof product === 'object' && 'name' in product ? product.name : line.description
        return {
          productId,
          productName,
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

      const customerEmail = session.customer_details?.email ?? ''
      const customerName = session.customer_details?.name ?? ''

      await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          customerEmail,
          customerName,
          totalAmount: (session.amount_total ?? 0) / 100,
          status: 'PAID',
          items: {
            create: linkable.map(item => ({
              productId: item.productId!,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      })

      // Best-effort: the order is already committed above, so a Brevo outage
      // must not make Stripe re-deliver this webhook (sendEmail never throws).
      if (customerEmail) {
        const itemsHtml = charged
          .map(
            item =>
              `<tr>
                <td style="padding:4px 8px;">${escapeHtml(item.productName ?? 'Article')}</td>
                <td style="padding:4px 8px;text-align:center;">${item.quantity}</td>
                <td style="padding:4px 8px;text-align:right;">${item.unitPrice.toFixed(2)} €</td>
              </tr>`,
          )
          .join('')

        await sendEmail({
          to: [{ email: customerEmail, name: customerName || undefined }],
          subject: 'Confirmation de votre commande — Precept France',
          htmlContent: `
            <p>Bonjour${customerName ? ` ${escapeHtml(customerName)}` : ''},</p>
            <p>Merci pour votre commande sur Precept France. Voici le récapitulatif :</p>
            <table style="border-collapse:collapse;width:100%;">
              <thead>
                <tr>
                  <th style="text-align:left;padding:4px 8px;">Article</th>
                  <th style="padding:4px 8px;">Qté</th>
                  <th style="text-align:right;padding:4px 8px;">Prix</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <p><strong>Total : ${((session.amount_total ?? 0) / 100).toFixed(2)} €</strong></p>
            <p>Vous recevrez un nouvel email dès l'expédition de votre commande.</p>
            <p>L'équipe Precept France</p>
          `,
        })
      }
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

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getPrisma } from '@/lib/prisma'
import { RATE_LIMITS, checkRateLimit, clientIp } from '@/lib/rate-limit'
import { canFulfil } from '@/lib/stock'
import { SHIPPING_COUNTRIES, SHIPPING_FEE_CENTS } from '@/lib/shipping'

export const dynamic = 'force-dynamic'

// A single line may not exceed this quantity. Guards against a client asking
// for a nonsensical amount, and against integer overflow reaching Stripe.
const MAX_QUANTITY_PER_LINE = 20

/**
 * Base URL for Stripe's redirect targets.
 *
 * Deliberately NOT derived from the Host or X-Forwarded-Host headers: those are
 * attacker-controlled, so a crafted request could point success_url at another
 * site and land the buyer on a look-alike page straight after paying.
 */
function resolveBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_BASE_URL
  if (configured) return configured.replace(/\/+$/, '')
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:3000'
  return null
}

export async function POST(req: NextRequest) {
  try {
    // Creating a Checkout Session is free to the caller and costs us a Stripe
    // API call every time. Nothing limited how many an anonymous visitor could
    // trigger.
    const { ok } = await checkRateLimit('checkout', clientIp(req), RATE_LIMITS.checkout)
    if (!ok) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => null)
    const rawItems = body?.items

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Only productId and quantity are read from the request. Any name, price or
    // image the client sends is ignored — prices are read from the database
    // below, so a tampered cart cannot change what Stripe charges.
    const quantityByProductId = new Map<string, number>()
    for (const item of rawItems) {
      const productId = typeof item?.productId === 'string' ? item.productId : null
      const quantity = Number(item?.quantity)

      if (
        !productId ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_QUANTITY_PER_LINE
      ) {
        return NextResponse.json({ error: 'Panier invalide' }, { status: 400 })
      }

      const running = (quantityByProductId.get(productId) ?? 0) + quantity
      if (running > MAX_QUANTITY_PER_LINE) {
        return NextResponse.json({ error: 'Quantité trop élevée' }, { status: 400 })
      }
      quantityByProductId.set(productId, running)
    }

    const baseUrl = resolveBaseUrl()
    if (!baseUrl) {
      console.error(
        'NEXT_PUBLIC_BASE_URL is not set — refusing to build redirect URLs from request headers',
      )
      return NextResponse.json({ error: 'Configuration du serveur incomplète' }, { status: 500 })
    }

    const prisma = getPrisma()
    const products = await prisma.product.findMany({
      where: { id: { in: Array.from(quantityByProductId.keys()) } },
    })

    // Hidden and sold-out titles count as gone, and so does a title with fewer
    // copies left than the cart asks for: a cart filled before someone hid a
    // book, or a stale product page, must not turn into a sale.
    const buyable = products.filter(
      (product) =>
        product.published && canFulfil(product, quantityByProductId.get(product.id) ?? 0),
    )

    if (buyable.length !== quantityByProductId.size) {
      return NextResponse.json(
        { error: "Certains articles ne sont plus disponibles" },
        { status: 400 },
      )
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'fr',
      // Books are posted, so the team needs an address. Collected by Stripe and
      // read back in the webhook; the customer never types it into our site.
      shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
      // Defined inline: nothing to create or keep in sync in the Stripe
      // dashboard, and the amount lives next to the code that displays it.
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: SHIPPING_FEE_CENTS, currency: 'eur' },
            display_name: 'Livraison',
          },
        },
      ],
      line_items: buyable.map(product => ({
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(product.price * 100), // Stripe expects cents
          product_data: {
            name: product.name,
            // Stripe only accepts absolute URLs here. Covers uploaded from
            // the admin are already absolute (Vercel Blob); the original
            // ones are paths under /public.
            images: product.imageUrl
              ? [/^https?:\/\//.test(product.imageUrl) ? product.imageUrl : `${baseUrl}${product.imageUrl}`]
              : [],
            // Lets the webhook map a line item back to our product without
            // trusting anything the browser sent.
            metadata: { productId: product.id },
          },
        },
        quantity: quantityByProductId.get(product.id)!,
      })),
      success_url: `${baseUrl}/boutique/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/boutique/annule`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}

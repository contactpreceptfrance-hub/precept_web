import { getPrisma } from '@/lib/prisma'
import { escapeHtml, getTeamRecipients, sendEmail } from '@/lib/email'
import { SITE_URL } from '@/lib/site'

const euros = (value: number) => `${value.toFixed(2).replace('.', ',')} €`

/** The slice of a Checkout Session the donation webhook reads. */
export type DonationSession = {
  id: string
  mode?: string | null
  amount_total?: number | null
  customer_details?: { email?: string | null; name?: string | null } | null
  subscription?: string | { id: string } | null
  invoice?: string | { id: string } | null
}

/** The slice of an Invoice the renewal webhook reads. */
export type DonationInvoice = {
  id: string
  amount_paid: number
  billing_reason?: string | null
  customer_email?: string | null
  customer_name?: string | null
  // API versions differ: the subscription moved under `parent` in 2025.
  subscription?: string | { id: string } | null
  parent?: { subscription_details?: { subscription?: string | { id: string } | null } | null } | null
}

const idOf = (value: string | { id: string } | null | undefined) =>
  typeof value === 'string' ? value : (value?.id ?? null)

async function notifyAndThank(donation: {
  amount: number
  recurring: boolean
  renewal: boolean
  donorEmail: string | null
  donorName: string | null
}) {
  const kind = donation.recurring
    ? donation.renewal
      ? 'Don mensuel (renouvellement)'
      : 'Nouveau don mensuel'
    : 'Don ponctuel'

  const recipients = getTeamRecipients()
  if (recipients) {
    await sendEmail({
      ...recipients,
      subject: `${kind} — ${euros(donation.amount)}`,
      htmlContent: `
        <p><strong>${kind}</strong> reçu par carte via le site.</p>
        <p><strong>Montant :</strong> ${euros(donation.amount)}</p>
        <p><strong>Donateur :</strong> ${escapeHtml(donation.donorName || '—')}
          (${escapeHtml(donation.donorEmail || 'e-mail non renseigné')})</p>
        <p><a href="${SITE_URL}/admin/dons">Voir les dons dans l’administration</a></p>
      `,
    })
  } else {
    console.error('TEAM_NOTIFICATION_EMAIL not set — donation alert not sent')
  }

  // A renewal is automatic; thanking the donor every month would be noise.
  if (donation.donorEmail && !donation.renewal) {
    await sendEmail({
      to: [{ email: donation.donorEmail, name: donation.donorName || undefined }],
      subject: 'Merci pour votre don — Precept France',
      htmlContent: `
        <p>Bonjour${donation.donorName ? ` ${escapeHtml(donation.donorName)}` : ''},</p>
        <p>Nous avons bien reçu votre don de <strong>${euros(donation.amount)}</strong>${
          donation.recurring ? ' (renouvelé chaque mois)' : ''
        }. Merci de soutenir l’étude de la Parole de Dieu avec Precept France.</p>
        ${
          donation.recurring
            ? '<p>Vous pouvez arrêter votre don mensuel à tout moment en nous écrivant.</p>'
            : ''
        }
        <p>Que Dieu vous bénisse.</p>
        <p>L’équipe Precept France</p>
      `,
    })
  }
}

/**
 * Records the first (or only) payment of a donation Checkout Session.
 *
 * Idempotent: Stripe re-delivers until it gets a 2xx, and for monthly gifts the
 * `invoice.paid` event for the same invoice may land before or after this one.
 * Both write through the invoice id, so the second to arrive finds the row.
 */
export async function recordCheckoutDonation(session: DonationSession): Promise<void> {
  const prisma = getPrisma()
  const invoiceId = idOf(session.invoice)
  const recurring = session.mode === 'subscription'
  const data = {
    stripeSessionId: session.id,
    stripeSubscriptionId: idOf(session.subscription),
    amount: (session.amount_total ?? 0) / 100,
    recurring,
    donorEmail: session.customer_details?.email ?? null,
    donorName: session.customer_details?.name ?? null,
  }

  const already = await prisma.donation.findUnique({ where: { stripeSessionId: session.id } })
  if (already) {
    console.log(`Webhook ${session.id}: donation already recorded, ignoring duplicate delivery`)
    return
  }

  if (invoiceId) {
    await prisma.donation.upsert({
      where: { stripeInvoiceId: invoiceId },
      create: { ...data, stripeInvoiceId: invoiceId },
      update: data,
    })
  } else {
    await prisma.donation.create({ data })
  }

  await notifyAndThank({ ...data, renewal: false })
}

/**
 * Records a paid invoice of a monthly donation. Only renewals matter here: the
 * first invoice (`subscription_create`) is recorded by the Checkout event.
 */
export async function recordInvoiceDonation(invoice: DonationInvoice): Promise<void> {
  if (invoice.billing_reason !== 'subscription_cycle') return

  const prisma = getPrisma()
  const subscriptionId = idOf(invoice.subscription) ?? idOf(invoice.parent?.subscription_details?.subscription)

  // Only subscriptions that started as a donation are ours. Nothing else in
  // this app uses subscriptions today, but this keeps a future one out.
  if (!subscriptionId) return
  const first = await prisma.donation.findFirst({ where: { stripeSubscriptionId: subscriptionId } })
  if (!first) {
    console.error(`Invoice ${invoice.id}: no donation found for subscription ${subscriptionId}`)
    return
  }

  const existing = await prisma.donation.findUnique({ where: { stripeInvoiceId: invoice.id } })
  if (existing) return

  const data = {
    stripeSubscriptionId: subscriptionId,
    stripeInvoiceId: invoice.id,
    amount: invoice.amount_paid / 100,
    recurring: true,
    donorEmail: invoice.customer_email ?? first.donorEmail,
    donorName: invoice.customer_name ?? first.donorName,
  }
  await prisma.donation.create({ data })
  await notifyAndThank({ ...data, renewal: true })
}

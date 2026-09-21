import { escapeHtml, getTeamRecipients, sendEmail } from '@/lib/email'
import { SITE_URL } from '@/lib/site'

export interface OrderAlertItem {
  productName: string | null
  quantity: number
  unitPrice: number
  /** Copies left after this order, or null when the book's stock is not tracked. */
  stockAfter: number | null
  /** True when the order asked for more copies than were in stock. */
  oversold: boolean
}

const euros = (value: number) => `${value.toFixed(2).replace('.', ',')} €`

/**
 * Tells Precept France a sale happened.
 *
 * Without this, the only e-mail a paid order produced went to the customer, so
 * the team learned about orders only by opening /admin. Best-effort like every
 * other e-mail here: the order is already committed, and sendEmail never throws.
 */
export async function notifyTeamOfOrder(order: {
  customerName: string
  customerEmail: string
  /** Multi-line delivery address, or null when Stripe did not return one. */
  shippingAddress: string | null
  totalAmount: number
  items: OrderAlertItem[]
}): Promise<void> {
  const recipients = getTeamRecipients()
  if (!recipients) {
    console.error('TEAM_NOTIFICATION_EMAIL not set — order alert not sent')
    return
  }

  const rows = order.items
    .map((item) => {
      let stock = ''
      if (item.oversold) stock = '⚠ stock insuffisant — à vérifier'
      else if (item.stockAfter !== null) {
        stock = item.stockAfter === 0 ? '⚠ épuisé' : `${item.stockAfter}`
      }
      return `<tr>
        <td style="padding:4px 8px;">${escapeHtml(item.productName ?? 'Article')}</td>
        <td style="padding:4px 8px;text-align:center;">${item.quantity}</td>
        <td style="padding:4px 8px;text-align:right;">${euros(item.unitPrice)}</td>
        <td style="padding:4px 8px;">${stock}</td>
      </tr>`
    })
    .join('')

  const who = order.customerName || order.customerEmail || 'client inconnu'

  await sendEmail({
    ...recipients,
    replyTo: order.customerEmail
      ? { email: order.customerEmail, name: order.customerName || undefined }
      : undefined,
    subject: `Nouvelle commande — ${euros(order.totalAmount)} — ${who}`,
    htmlContent: `
      <p><strong>Une commande vient d’être payée sur le site.</strong></p>
      <p><strong>Client :</strong> ${escapeHtml(order.customerName || '—')}
        (${escapeHtml(order.customerEmail || 'e-mail non renseigné')})</p>
      <p><strong>Livraison :</strong><br>${
        order.shippingAddress
          ? escapeHtml(order.shippingAddress).replace(/\n/g, '<br>')
          : '⚠ aucune adresse reçue — à demander au client'
      }</p>
      <table style="border-collapse:collapse;width:100%;">
        <thead>
          <tr>
            <th style="text-align:left;padding:4px 8px;">Article</th>
            <th style="padding:4px 8px;">Qté</th>
            <th style="text-align:right;padding:4px 8px;">Prix</th>
            <th style="text-align:left;padding:4px 8px;">Stock restant</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>Total : ${euros(order.totalAmount)}</strong></p>
      <p><a href="${SITE_URL}/admin/commandes?filtre=a-expedier">Voir la commande dans l’administration</a></p>
    `,
  })
}

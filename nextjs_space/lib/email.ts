/**
 * Transactional email via Brevo's REST API (https://api.brevo.com/v3/smtp/email).
 *
 * No SDK: Brevo's Node client pulls in a large generated API surface for the
 * one endpoint this project needs. A plain fetch is smaller and has no
 * dependency to keep patched.
 *
 * Every caller treats a send failure as non-fatal — the thing being confirmed
 * (a DB row, a paid order) has already happened, so a broken mail send must
 * never undo it or fail the request back to the user. Callers should wrap
 * calls in try/catch (or rely on this module's own catch — see below) and
 * only log.
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

export interface EmailRecipient {
  email: string
  name?: string
}

interface SendEmailInput {
  to: EmailRecipient[]
  subject: string
  htmlContent: string
  cc?: EmailRecipient[]
  replyTo?: EmailRecipient
}

/**
 * Sends one transactional email. Never throws: a missing API key or a Brevo
 * error is logged and swallowed, because every call site's real work (DB
 * write, order creation) is already committed by the time this runs.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL

  if (!apiKey || !senderEmail) {
    console.error(
      `Email not sent (Brevo not configured — BREVO_API_KEY/BREVO_SENDER_EMAIL missing): "${input.subject}"`,
    )
    return
  }

  const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'Precept France'

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: input.to,
        cc: input.cc?.length ? input.cc : undefined,
        replyTo: input.replyTo,
        subject: input.subject,
        htmlContent: input.htmlContent,
      }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`Brevo send failed (${res.status}) for "${input.subject}":`, body)
    }
  } catch (err) {
    console.error(`Brevo send threw for "${input.subject}":`, err)
  }
}

/** Escapes text dropped into htmlContent — every field below is user-submitted. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

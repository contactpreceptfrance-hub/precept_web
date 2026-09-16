import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { MIN_FILL_MS, contactSchema } from '@/lib/validation'
import { RATE_LIMITS, checkRateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml, sendEmail, type EmailRecipient } from '@/lib/email'

const ORIGIN_LABELS: Record<string, string> = {
  contact: 'Formulaire de contact',
  groupe: "Demande d'étude en groupe",
}

/**
 * Awaited, not fire-and-forget: on Vercel a serverless function can be frozen
 * the instant the response is sent, which would kill an un-awaited fetch to
 * Brevo before it completes. sendEmail() itself never throws (it logs and
 * swallows), so awaiting it here cannot turn a successful submit into a 500 —
 * it can only add latency.
 */
async function notifyTeam(submission: {
  name: string
  email: string
  subject: string
  message: string
  origine?: string
}) {
  const to = process.env.TEAM_NOTIFICATION_EMAIL
  if (!to) {
    console.error('TEAM_NOTIFICATION_EMAIL not set — contact notification not sent')
    return
  }

  const cc: EmailRecipient[] = []
  if (process.env.TEAM_NOTIFICATION_EMAIL_CC) {
    cc.push({ email: process.env.TEAM_NOTIFICATION_EMAIL_CC })
  }

  const originLabel = ORIGIN_LABELS[submission.origine ?? 'contact'] ?? 'Formulaire de contact'

  await sendEmail({
    to: [{ email: to }],
    cc,
    replyTo: { email: submission.email, name: submission.name },
    subject: `[${originLabel}] ${submission.subject}`,
    htmlContent: `
      <p><strong>${originLabel}</strong></p>
      <p><strong>De :</strong> ${escapeHtml(submission.name)} (${escapeHtml(submission.email)})</p>
      <p><strong>Sujet :</strong> ${escapeHtml(submission.subject)}</p>
      <p><strong>Message :</strong></p>
      <p>${escapeHtml(submission.message).replace(/\n/g, '<br>')}</p>
    `,
  })
}

export const dynamic = 'force-dynamic'

/** Refused before parsing. A 4 MB body should never reach JSON.parse. */
const MAX_BODY_BYTES = 100_000

/**
 * What a bot gets: a clean 200 and no row written.
 *
 * A 400 would teach it which field is the trap and how to avoid it next time.
 * A 200 teaches it nothing, and costs a human nothing either.
 */
const silentSuccess = () => NextResponse.json({ success: true })

export async function POST(request: NextRequest) {
  try {
    if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Message trop long' }, { status: 413 })
    }

    // A malformed body used to throw into the catch below and answer 500.
    // Same guard the checkout route already uses.
    const body = await request.json().catch(() => null)
    if (body === null) {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
    }

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      // Never echoed to the caller: this is a public endpoint and the form has
      // a single error state, so the issue paths would only help an attacker
      // map the schema.
      console.warn('Contact validation failed:', parsed.error.issues)
      return NextResponse.json({ error: 'Champs invalides' }, { status: 400 })
    }

    const { name, email, subject, message, origine, website, elapsedMs } = parsed.data

    // Honeypot: a real input, hidden in CSS, that only an automated filler sees.
    if (website) return silentSuccess()

    // Nobody types four fields in two seconds.
    if (typeof elapsedMs === 'number' && elapsedMs < MIN_FILL_MS) return silentSuccess()

    // Both windows in one call so they share a single recorded hit.
    const { ok } = await checkRateLimit('contact', clientIp(request), [
      RATE_LIMITS.contactHourly,
      RATE_LIMITS.contactDaily,
    ])
    if (!ok) {
      return NextResponse.json(
        { error: 'Trop de messages envoyés. Réessayez plus tard.' },
        { status: 429 },
      )
    }

    const submission = await getPrisma().contactSubmission.create({
      data: { name, email, subject, message, source: origine ?? 'contact' },
    })

    await notifyTeam({ name, email, subject, message, origine })

    return NextResponse.json({ success: true, id: submission.id })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: "Erreur lors de l'envoi du message" }, { status: 500 })
  }
}

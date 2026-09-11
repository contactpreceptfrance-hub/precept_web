import { z } from 'zod'

/**
 * Shared request schemas.
 *
 * Kept in one file rather than inline in each route so the contact form, the
 * study-group form and the admin actions cannot drift apart on what they
 * consider a valid name or e-mail.
 *
 * Server-only. Nothing here may be imported from a client component: zod would
 * then land in the browser bundle for no benefit, since the forms rely on the
 * server for their single error state.
 */

/**
 * Where a contact message came from.
 *
 * An enum, never a free string: the value reaches `ContactSubmission.source`,
 * which the admin filters on, so it has to come from a fixed allowlist rather
 * than from whatever the client posts.
 */
export const contactOrigins = ['contact', 'groupe'] as const
export type ContactOrigin = (typeof contactOrigins)[number]

/** Below this, nobody typed it. Bots submit instantly; humans do not. */
export const MIN_FILL_MS = 2000

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(200),
  subject: z.string().trim().min(1).max(150),
  // A floor as well as a ceiling: "test" is not a message worth a notification.
  message: z.string().trim().min(10).max(5000),
  origine: z.enum(contactOrigins).optional(),

  // Honeypot. A real, CSS-hidden input that only a bot fills.
  //
  // It must PASS validation even when filled: rejecting it here would answer
  // 400, which tells the bot precisely which field is the trap. The route
  // inspects the value afterwards and answers a plain 200 while writing
  // nothing. The length cap is only there to bound the payload.
  website: z.string().max(200).optional(),

  // Milliseconds since the form mounted, sent by the client. Advisory only:
  // it is trivially forgeable, so it costs a naive bot and nothing else.
  elapsedMs: z.number().int().nonnegative().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

/** An id coming back from a form field, before it reaches the database. */
export const idSchema = z.string().trim().min(1).max(40)

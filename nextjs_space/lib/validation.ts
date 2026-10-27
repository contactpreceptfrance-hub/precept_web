import { z } from 'zod'
import { SERIES_CONFIG } from '@/lib/types'

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
export const contactOrigins = ['contact', 'groupe', 'atelier'] as const
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

/**
 * A book as the admin form submits it.
 *
 * The price is typed by hand in a text field, so it accepts a French comma and
 * is checked as text before it becomes a number: `z.coerce.number()` would
 * quietly turn "" into 0 and "1,5" into NaN.
 */
const priceSchema = z
  .string()
  .trim()
  .regex(/^\d{1,4}([.,]\d{1,2})?$/)
  .transform((value) => Number(value.replace(',', '.')))
  .refine((value) => value > 0)

/**
 * Copies in hand. Empty means "not tracked" (null), which is different from 0
 * ("none left") — hence text in, not `z.coerce.number()`, which turns "" into 0.
 */
const stockSchema = z
  .string()
  .trim()
  .regex(/^(\d{1,5})?$/)
  .transform((value) => (value === '' ? null : Number(value)))

export const bookSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  price: priceSchema,
  type: z.enum(['LIVRE', 'FORMATION']),
  stock: stockSchema,
  // Empty string means "no series" and is stored as null.
  series: z
    .string()
    .trim()
    .refine((value) => value === '' || SERIES_CONFIG.some((s) => s.key === value))
    .transform((value) => (value === '' ? null : value)),
  // Sample lesson or companion PDF (optional).
  samplePdfUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
})

export type BookInput = z.infer<typeof bookSchema>

/**
 * A product id. Longer than `idSchema` allows: seeded titles use
 * `seed-<cover file name>` ids, which reach 56 characters, whereas orders and
 * messages use 25-character cuids.
 */
export const productIdSchema = z.string().trim().min(1).max(100)

const durationMinSchema = z
  .string()
  .trim()
  .regex(/^(\d{1,3})?$/)
  .transform((value) => (value === '' ? 90 : Number(value)))
  .refine((value) => value >= 15 && value <= 480)

const optionalNextDateSchema = z
  .string()
  .trim()
  .transform((value) => {
    if (!value) return null
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  })
  .refine((value) => value !== undefined)

export const atelierSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  scheduleText: z.string().trim().min(1).max(300),
  nextDate: optionalNextDateSchema,
  durationMin: durationMinSchema,
  leaderName: z
    .string()
    .trim()
    .max(150)
    .optional()
    .transform((value) => (value ? value : null)),
  zoomUrl: z
    .string()
    .trim()
    .url()
    .max(500)
    .refine((url) => /^https?:\/\//i.test(url)),
  zoomInfo: z
    .string()
    .trim()
    .max(250)
    .optional()
    .transform((value) => (value ? value : null)),
  productId: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => (value ? value : null)),
})

export type AtelierInput = z.infer<typeof atelierSchema>


/**
 * A donation as the /don page submits it.
 *
 * The amount is typed by hand, so like `priceSchema` it is text with an
 * optional French comma, checked before it becomes a number. Bounds keep a
 * typo ("2500000") from reaching Stripe.
 */
export const donationSchema = z.object({
  amount: z
    .string()
    .trim()
    .regex(/^\d{1,5}([.,]\d{1,2})?$/)
    .transform((value) => Number(value.replace(',', '.')))
    .refine((value) => value >= 1 && value <= 10000),
  recurring: z.boolean(),
})

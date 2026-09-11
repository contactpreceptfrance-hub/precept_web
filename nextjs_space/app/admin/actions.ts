'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { idSchema } from '@/lib/validation'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
  checkAdminPassword,
  createSessionCookieValue,
  isAdminConfigured,
} from '@/lib/admin-auth'
import { RATE_LIMITS, checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

/**
 * Where to send someone after they log in.
 *
 * Only paths inside the admin area, and never a protocol-relative or
 * backslash-escaped one — otherwise `?from=` turns the login page into an open
 * redirect that sends staff to an attacker's look-alike after they type the
 * password.
 */
function safeRedirectTarget(from: unknown): string {
  if (typeof from !== 'string') return '/admin'
  if (!from.startsWith('/admin')) return '/admin'
  if (from.includes('//') || from.includes('\\')) return '/admin'
  return from
}

export async function login(formData: FormData) {
  const password = formData.get('password')
  const target = safeRedirectTarget(formData.get('from'))

  // Carried back on every failure, so a mistyped password does not also lose
  // the page the user was heading for.
  const retry = (reason: string) =>
    `/admin/login?e=${reason}&from=${encodeURIComponent(target)}`

  // The shared password is the entire security model, so an unlimited number of
  // guesses is the entire attack. Limited per IP before the password is even
  // looked at.
  const ip = clientIpFromHeaders(headers())
  const { ok } = await checkRateLimit(
    'admin_login',
    ip,
    RATE_LIMITS.adminLogin.limit,
    RATE_LIMITS.adminLogin.windowMs,
  )
  if (!ok) redirect(retry('rate'))

  // Before comparing anything: an unconfigured deployment must say so rather
  // than blame the person typing.
  if (!isAdminConfigured()) redirect(retry('config'))

  if (typeof password !== 'string' || !(await checkAdminPassword(password))) {
    redirect(retry('1'))
  }

  const value = await createSessionCookieValue()
  if (!value) redirect(retry('config'))

  cookies().set(ADMIN_COOKIE_NAME, value, ADMIN_COOKIE_OPTIONS)
  redirect(target)
}

export async function logout() {
  cookies().delete(ADMIN_COOKIE_NAME)
  redirect('/admin/login')
}

/**
 * Where an admin action sends the browser back to.
 *
 * The list pages carry filters and a page number in the query string; without
 * this, marking one order shipped would bounce the team back to page 1 of an
 * unfiltered list every time.
 */
function returnPath(formData: FormData, fallback: string): string {
  const value = formData.get('returnTo')
  if (typeof value !== 'string' || !value.startsWith('/admin')) return fallback
  if (value.includes('//') || value.includes('\\')) return fallback
  return value
}

/** Appends a short outcome note the list page renders once. */
function withNote(path: string, note: string): string {
  return `${path}${path.includes('?') ? '&' : '?'}note=${note}`
}

/**
 * Move an order between two statuses.
 *
 * The current status is part of the WHERE, never assumed. That makes the action
 * idempotent — a double click is a no-op rather than a second transition — and
 * it stops a stale page from dragging an order through a state it never had.
 * `count === 0` means the order was not in `from`, which the caller surfaces
 * instead of silently reporting success.
 */
async function moveOrder(
  formData: FormData,
  from: 'PAID' | 'SHIPPED',
  to: 'PAID' | 'SHIPPED',
) {
  await requireAdmin()

  const parsed = idSchema.safeParse(formData.get('orderId'))
  const back = returnPath(formData, '/admin/commandes')
  if (!parsed.success) redirect(withNote(back, 'invalide'))

  const { count } = await getPrisma().order.updateMany({
    where: { id: parsed.data, status: from },
    data: { status: to },
  })

  revalidatePath('/admin/commandes')
  revalidatePath('/admin')
  redirect(withNote(back, count === 0 ? 'inchange' : 'ok'))
}

export async function markShipped(formData: FormData) {
  await moveOrder(formData, 'PAID', 'SHIPPED')
}

export async function markUnshipped(formData: FormData) {
  // Staff will mis-click. Without the inverse, the only way back is Prisma Studio.
  await moveOrder(formData, 'SHIPPED', 'PAID')
}

/** Same conditional shape, on the message triage flag. */
async function setMessageHandled(formData: FormData, handled: boolean) {
  await requireAdmin()

  const parsed = idSchema.safeParse(formData.get('messageId'))
  const back = returnPath(formData, '/admin/messages')
  if (!parsed.success) redirect(withNote(back, 'invalide'))

  const { count } = await getPrisma().contactSubmission.updateMany({
    where: { id: parsed.data, handledAt: handled ? null : { not: null } },
    data: { handledAt: handled ? new Date() : null },
  })

  revalidatePath('/admin/messages')
  revalidatePath('/admin')
  redirect(withNote(back, count === 0 ? 'inchange' : 'ok'))
}

export async function markHandled(formData: FormData) {
  await setMessageHandled(formData, true)
}

export async function markUnhandled(formData: FormData) {
  await setMessageHandled(formData, false)
}

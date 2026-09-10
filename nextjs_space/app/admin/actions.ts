'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
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

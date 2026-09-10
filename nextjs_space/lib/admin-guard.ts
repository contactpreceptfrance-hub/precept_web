import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE_NAME, verifySessionCookieValue } from '@/lib/admin-auth'

/**
 * The actual security boundary for the administration area.
 *
 * Call it as the FIRST statement of every admin page and every Server Action.
 * Not because the middleware might fail, but because the middleware does not
 * cover Server Actions at all: an action is a public HTTP endpoint reachable by
 * anyone who has its id, and no route matcher stands in front of it.
 *
 * Calling `cookies()` also opts the caller out of static rendering, which is
 * what guarantees an admin page is never prerendered into the build output.
 *
 * Keep this the single place anything reads the session cookie. The day
 * customer accounts arrive, this function and lib/admin-auth.ts are all that
 * change.
 */
export async function requireAdmin(): Promise<void> {
  const session = cookies().get(ADMIN_COOKIE_NAME)?.value
  if (!(await verifySessionCookieValue(session))) {
    // redirect() throws; it must not sit inside a try/catch in the caller.
    redirect('/admin/login')
  }
}

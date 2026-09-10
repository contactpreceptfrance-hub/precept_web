import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE_NAME, verifySessionCookieValue } from '@/lib/admin-auth'

/**
 * Front door for /admin.
 *
 * This is a convenience, NOT the security boundary. It turns an unauthenticated
 * request into a redirect before a full server render happens, and it keeps the
 * area out of search results. The real check is `requireAdmin()`, called by every
 * admin page and every Server Action — a Server Action is a public HTTP endpoint
 * that no route matcher protects.
 */
export const config = {
  matcher: ['/admin/:path*'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The login page is inside the matched area and must stay reachable.
  // Done here rather than with a negative lookahead in the matcher: Next
  // supports those, but they are easy to get subtly wrong, and a wrong matcher
  // on an auth gate is the worst kind of bug to have.
  if (pathname === '/admin/login') {
    return withNoIndex(NextResponse.next())
  }

  const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (await verifySessionCookieValue(session)) {
    return withNoIndex(NextResponse.next())
  }

  const login = new URL('/admin/login', request.url)
  login.searchParams.set('from', pathname)
  return withNoIndex(NextResponse.redirect(login))
}

function withNoIndex(response: NextResponse): NextResponse {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

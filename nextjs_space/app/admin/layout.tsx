import type { Metadata } from 'next'

/**
 * Wraps the whole administration area, login page included.
 *
 * No session check here: /admin/login lives inside it, and guarding the layout
 * would redirect the login page to itself.
 *
 * `requireAdmin()` already opts these pages out of static rendering by reading
 * cookies, but the explicit force-dynamic states the intent and would survive a
 * page that somehow stopped calling it.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50 text-darkblue">{children}</div>
}

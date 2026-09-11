import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-guard'
import { logout } from '@/app/admin/actions'

/**
 * Everything behind the password.
 *
 * A route group, so /admin/login can sit outside it while both keep the same
 * URL shape. The guard here covers the pages; each Server Action still calls
 * `requireAdmin()` itself, because an action is reachable without ever
 * rendering a page.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-playfair text-lg font-bold">
              Precept France <span className="text-teal">— Administration</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm font-semibold text-darkblue/60">
              <Link href="/admin/commandes" className="hover:text-darkblue transition-colors">
                Commandes
              </Link>
              <Link href="/admin/messages" className="hover:text-darkblue transition-colors">
                Messages
              </Link>
            </nav>
          </div>

          {/* A form, not a link: a prefetch on a <Link> would log the team out
              just by hovering the button. */}
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:border-gray-300 transition-colors"
            >
              <LogOut size={15} />
              Se déconnecter
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </>
  )
}

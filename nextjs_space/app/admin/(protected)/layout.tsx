import { requireAdmin } from '@/lib/admin-guard'
import { getPrisma } from '@/lib/prisma'
import { AdminSidebar } from './admin-sidebar'

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

  let pendingOrdersCount = 0
  let unhandledMessagesCount = 0

  try {
    const prisma = getPrisma()
    const [unhandled, pending] = await Promise.all([
      prisma.contactSubmission.count({ where: { handledAt: null } }),
      prisma.order.count({ where: { status: 'PAID' } }),
    ])
    unhandledMessagesCount = unhandled
    pendingOrdersCount = pending
  } catch (error) {
    console.error('Failed to load admin sidebar counts:', error)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50/70 text-darkblue">
      <AdminSidebar
        pendingOrdersCount={pendingOrdersCount}
        unhandledMessagesCount={unhandledMessagesCount}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

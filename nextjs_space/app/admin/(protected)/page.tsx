import type { Metadata } from 'next'
import { Package, MessageSquare } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'

export const metadata: Metadata = {
  title: 'Administration — Precept France',
  robots: { index: false, follow: false },
}

/**
 * The landing page of the administration area.
 *
 * Counts only, for now: the orders and messages screens land in the next phase.
 * These two numbers are enough to prove end to end that the session works and
 * that the pages can read the database — and they are the two figures the team
 * will want first thing anyway.
 */
export default async function AdminHomePage() {
  await requireAdmin()

  const prisma = getPrisma()
  const [paidOrders, unhandledMessages] = await Promise.all([
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.contactSubmission.count({ where: { handledAt: null } }),
  ])

  const tiles = [
    {
      icon: Package,
      label: 'Commandes payées à expédier',
      value: paidOrders,
      note: 'La liste et le passage à « expédiée » arrivent à la prochaine étape.',
    },
    {
      icon: MessageSquare,
      label: 'Messages non traités',
      value: unhandledMessages,
      note: 'La lecture et le suivi arrivent à la prochaine étape.',
    },
  ]

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold mb-2">Tableau de bord</h1>
      <p className="text-darkblue/60 mb-8">
        Vous êtes connecté à l’espace d’administration.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {tiles.map(({ icon: Icon, label, value, note }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 text-darkblue/50 mb-4">
              <Icon size={18} />
              <span className="text-sm font-semibold">{label}</span>
            </div>
            <p className="text-4xl font-black text-teal mb-3">{value}</p>
            <p className="text-xs text-darkblue/40 leading-relaxed">{note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

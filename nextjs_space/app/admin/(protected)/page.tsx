import type { Metadata } from 'next'
import Link from 'next/link'
import { Package, MessageSquare, BookOpen, ArrowRight, CreditCard } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { getActiveStripeCredentials } from '@/lib/stripe-config'

export const metadata: Metadata = {
  title: 'Administration — Precept France',
  robots: { index: false, follow: false },
}

/**
 * The landing page of the administration area.
 */
export default async function AdminHomePage() {
  await requireAdmin()

  const prisma = getPrisma()
  const [paidOrders, unhandledMessages, publishedBooks, stripeCreds] = await Promise.all([
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.contactSubmission.count({ where: { handledAt: null } }),
    prisma.product.count({ where: { published: true } }),
    getActiveStripeCredentials(),
  ])

  const tiles = [
    {
      icon: Package,
      label: 'Commandes payées à expédier',
      value: paidOrders,
      href: '/admin/commandes?filtre=a-expedier',
      cta: 'Voir les commandes',
    },
    {
      icon: MessageSquare,
      label: 'Messages non traités',
      value: unhandledMessages,
      href: '/admin/messages?filtre=a-traiter',
      cta: 'Voir les messages',
    },
    {
      icon: BookOpen,
      label: 'Livres en vente',
      value: publishedBooks,
      href: '/admin/livres',
      cta: 'Gérer les livres',
    },
    {
      icon: CreditCard,
      label: 'Paiements Stripe',
      value: stripeCreds.mode === 'live' ? 'Live' : 'Test',
      href: '/admin/parametres',
      cta: 'Configurer Stripe',
    },
  ]

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold mb-2">Tableau de bord</h1>
      <p className="text-darkblue/60 mb-8">
        Vous êtes connecté à l’espace d’administration.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiles.map(({ icon: Icon, label, value, href, cta }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-teal/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-2 text-darkblue/50 mb-4">
              <Icon size={18} />
              <span className="text-sm font-semibold">{label}</span>
            </div>
            <p className="text-4xl font-black text-teal mb-3">{value}</p>
            <p className="text-sm text-teal font-semibold inline-flex items-center gap-1">
              {cta}
              <ArrowRight size={14} />
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

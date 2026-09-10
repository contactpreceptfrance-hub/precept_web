import type { Metadata } from 'next'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { markShipped, markUnshipped } from '@/app/admin/actions'
import {
  ActionNote,
  Pagination,
  Problem,
  StatusBadge,
  Tabs,
  formatDate,
  formatEuros,
} from '@/app/admin/(protected)/ui'

export const metadata: Metadata = {
  title: 'Commandes — Administration',
  robots: { index: false, follow: false },
}

const PAGE_SIZE = 50

const FILTERS = [
  { key: 'a-expedier', label: 'À expédier', status: 'PAID' as const },
  { key: 'expediees', label: 'Expédiées', status: 'SHIPPED' as const },
  { key: 'toutes', label: 'Toutes', status: undefined },
]

type Props = {
  searchParams: { filtre?: string; page?: string; note?: string }
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  await requireAdmin()

  const filter = FILTERS.find((f) => f.key === searchParams.filtre) ?? FILTERS[0]
  const page = Math.max(1, Number(searchParams.page) || 1)
  const where = filter.status ? { status: filter.status } : {}

  const prisma = getPrisma()
  const [orders, total, counts] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      // One extra row is cheaper than a second COUNT just to know if there is a
      // next page.
      take: PAGE_SIZE + 1,
      include: { items: { include: { product: { select: { name: true } } } } },
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
  ])

  const hasMore = orders.length > PAGE_SIZE
  const rows = hasMore ? orders.slice(0, PAGE_SIZE) : orders
  const countFor = (status?: string) =>
    status
      ? (counts.find((c) => c.status === status)?._count ?? 0)
      : counts.reduce((sum, c) => sum + c._count, 0)

  const hrefFor = (nextPage: number) =>
    `/admin/commandes?filtre=${filter.key}${nextPage > 1 ? `&page=${nextPage}` : ''}`
  const currentPath = hrefFor(page)

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold mb-6">Commandes</h1>

      <Tabs
        current={`/admin/commandes?filtre=${filter.key}`}
        items={FILTERS.map((f) => ({
          href: `/admin/commandes?filtre=${f.key}`,
          label: f.label,
          count: countFor(f.status),
        }))}
      />

      <ActionNote note={searchParams.note} />

      {rows.length === 0 ? (
        <p className="text-darkblue/50 bg-white rounded-2xl border border-gray-200 p-8 text-center">
          Aucune commande dans cette vue.
        </p>
      ) : (
        <div className="space-y-4">
          {rows.map((order) => {
            const itemsTotal = order.items.reduce(
              (sum, item) => sum + item.unitPrice * item.quantity,
              0,
            )
            // Half a cent. totalAmount and unitPrice are doubles and prices look
            // like 12.99, so exact equality flags almost every multi-item order.
            const mismatch = Math.abs(order.totalAmount - itemsTotal) > 0.005

            return (
              <article
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-darkblue/40 mb-1">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="font-semibold">
                      {order.customerName || <span className="text-red-600">Nom manquant</span>}
                    </p>
                    {order.customerEmail ? (
                      <a
                        href={`mailto:${order.customerEmail}`}
                        className="text-sm text-teal hover:underline"
                      >
                        {order.customerEmail}
                      </a>
                    ) : (
                      <span className="text-sm text-red-600">Adresse e-mail manquante</span>
                    )}
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} />
                    <p className="text-xl font-black text-teal mt-2">
                      {formatEuros(order.totalAmount)}
                    </p>
                  </div>
                </div>

                {mismatch && (
                  <Problem>
                    Total Stripe {formatEuros(order.totalAmount)} ≠ somme des articles{' '}
                    {formatEuros(itemsTotal)}. Un article n’a pas pu être enregistré —{' '}
                    <a
                      className="underline font-semibold"
                      href={`https://dashboard.stripe.com/search?query=${encodeURIComponent(order.stripeSessionId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      vérifier dans Stripe
                    </a>
                    .
                  </Problem>
                )}

                {/* Stated as a fact and a next step, not as an impossibility:
                    the button below stays available because the team can get the
                    address by e-mail and then ship. Saying "cannot be shipped"
                    while offering to ship it would just be incoherent. */}
                {!order.shippingAddress && (
                  <Problem>
                    Aucune adresse de livraison enregistrée — à récupérer auprès du client
                    avant d’expédier.
                  </Problem>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-darkblue/40 mb-2">
                      Articles
                    </p>
                    <ul className="space-y-1 text-sm">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-4">
                          <span>
                            {/* The snapshot when we have it; today's name only as
                                a fallback for rows predating that column. */}
                            {item.quantity} × {item.productName ?? item.product.name}
                          </span>
                          <span className="text-darkblue/50 whitespace-nowrap">
                            {formatEuros(item.unitPrice * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-darkblue/40 mb-2">
                      Livraison
                    </p>
                    {order.shippingAddress ? (
                      <address className="text-sm not-italic whitespace-pre-line leading-relaxed">
                        {order.shippingAddress}
                      </address>
                    ) : (
                      <p className="text-sm text-darkblue/40">—</p>
                    )}
                  </div>
                </div>

                {(order.status === 'PAID' || order.status === 'SHIPPED') && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <form action={order.status === 'PAID' ? markShipped : markUnshipped}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="hidden" name="returnTo" value={currentPath} />
                      <button
                        type="submit"
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                          order.status === 'PAID'
                            ? 'bg-teal text-white hover:bg-teal-600'
                            : 'border border-gray-200 text-darkblue/60 hover:border-gray-300'
                        }`}
                      >
                        {order.status === 'PAID'
                          ? 'Marquer expédiée'
                          : 'Annuler l’expédition'}
                      </button>
                    </form>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      <Pagination page={page} hasMore={hasMore} hrefFor={hrefFor} />

      {total > 0 && (
        <p className="text-xs text-darkblue/40 mt-4 text-center">
          {total} commande{total > 1 ? 's' : ''} dans cette vue.
        </p>
      )}
    </div>
  )
}

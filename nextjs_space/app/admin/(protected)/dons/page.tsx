import type { Metadata } from 'next'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { Pagination, Tabs, formatDate, formatEuros } from '@/app/admin/(protected)/ui'

export const metadata: Metadata = {
  title: 'Dons — Administration',
  robots: { index: false, follow: false },
}

const PAGE_SIZE = 50

const FILTERS = [
  { key: 'tous', label: 'Tous', recurring: undefined },
  { key: 'ponctuels', label: 'Ponctuels', recurring: false },
  { key: 'mensuels', label: 'Mensuels', recurring: true },
]

type Props = { searchParams: { filtre?: string; page?: string } }

export default async function AdminDonationsPage({ searchParams }: Props) {
  await requireAdmin()

  const filter = FILTERS.find((f) => f.key === searchParams.filtre) ?? FILTERS[0]
  const page = Math.max(1, Number(searchParams.page) || 1)
  const where = filter.recurring === undefined ? {} : { recurring: filter.recurring }

  const prisma = getPrisma()
  const [donations, total, sums, counts] = await Promise.all([
    prisma.donation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE + 1,
    }),
    prisma.donation.count({ where }),
    prisma.donation.aggregate({ where, _sum: { amount: true } }),
    prisma.donation.groupBy({ by: ['recurring'], _count: true }),
  ])

  const hasMore = donations.length > PAGE_SIZE
  const rows = hasMore ? donations.slice(0, PAGE_SIZE) : donations
  const countFor = (recurring?: boolean) =>
    recurring === undefined
      ? counts.reduce((sum, c) => sum + c._count, 0)
      : (counts.find((c) => c.recurring === recurring)?._count ?? 0)

  const hrefFor = (nextPage: number) =>
    `/admin/dons?filtre=${filter.key}${nextPage > 1 ? `&page=${nextPage}` : ''}`

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold mb-6">Dons</h1>

      <Tabs
        current={`/admin/dons?filtre=${filter.key}`}
        items={FILTERS.map((f) => ({
          href: `/admin/dons?filtre=${f.key}`,
          label: f.label,
          count: countFor(f.recurring),
        }))}
      />

      <p className="text-sm text-darkblue/60 mb-4">
        Total de cette vue : <strong>{formatEuros(sums._sum.amount ?? 0)}</strong>. Les virements
        bancaires n’apparaissent pas ici.
      </p>

      {rows.length === 0 ? (
        <p className="text-darkblue/50 bg-white rounded-2xl border border-gray-200 p-8 text-center">
          Aucun don dans cette vue.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((donation) => (
            <article
              key={donation.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="text-xs text-darkblue/40 mb-1">{formatDate(donation.createdAt)}</p>
                <p className="font-semibold">{donation.donorName || '—'}</p>
                {donation.donorEmail && (
                  <a
                    href={`mailto:${donation.donorEmail}`}
                    className="text-sm text-teal hover:underline"
                  >
                    {donation.donorEmail}
                  </a>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-teal/10 text-teal">
                  {donation.recurring ? 'Mensuel' : 'Ponctuel'}
                </span>
                <p className="text-xl font-black text-teal mt-2">{formatEuros(donation.amount)}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination page={page} hasMore={hasMore} hrefFor={hrefFor} />

      {total > 0 && (
        <p className="text-xs text-darkblue/40 mt-4 text-center">
          {total} don{total > 1 ? 's' : ''} dans cette vue.
        </p>
      )}
    </div>
  )
}

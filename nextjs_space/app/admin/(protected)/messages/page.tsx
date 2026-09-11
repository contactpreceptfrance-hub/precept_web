import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { markHandled, markUnhandled } from '@/app/admin/actions'
import {
  ActionNote,
  Pagination,
  Tabs,
  formatDate,
} from '@/app/admin/(protected)/ui'

export const metadata: Metadata = {
  title: 'Messages — Administration',
  robots: { index: false, follow: false },
}

const PAGE_SIZE = 50

const FILTERS = [
  { key: 'a-traiter', label: 'À traiter', where: { handledAt: null } },
  { key: 'groupe', label: 'Demandes de groupe', where: { source: 'groupe' } },
  { key: 'tous', label: 'Tous', where: {} },
]

type Props = {
  searchParams: { filtre?: string; page?: string; note?: string }
}

export default async function AdminMessagesPage({ searchParams }: Props) {
  await requireAdmin()

  const filter = FILTERS.find((f) => f.key === searchParams.filtre) ?? FILTERS[0]
  const page = Math.max(1, Number(searchParams.page) || 1)

  const prisma = getPrisma()
  const [messages, total, unhandled, groupRequests] = await Promise.all([
    prisma.contactSubmission.findMany({
      where: filter.where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE + 1,
    }),
    prisma.contactSubmission.count({ where: filter.where }),
    prisma.contactSubmission.count({ where: { handledAt: null } }),
    prisma.contactSubmission.count({ where: { source: 'groupe' } }),
  ])

  const hasMore = messages.length > PAGE_SIZE
  const rows = hasMore ? messages.slice(0, PAGE_SIZE) : messages

  const hrefFor = (nextPage: number) =>
    `/admin/messages?filtre=${filter.key}${nextPage > 1 ? `&page=${nextPage}` : ''}`
  const currentPath = hrefFor(page)

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold mb-6">Messages</h1>

      <Tabs
        current={`/admin/messages?filtre=${filter.key}`}
        items={[
          { href: '/admin/messages?filtre=a-traiter', label: 'À traiter', count: unhandled },
          {
            href: '/admin/messages?filtre=groupe',
            label: 'Demandes de groupe',
            count: groupRequests,
          },
          { href: '/admin/messages?filtre=tous', label: 'Tous' },
        ]}
      />

      <ActionNote note={searchParams.note} />

      {rows.length === 0 ? (
        <p className="text-darkblue/50 bg-white rounded-2xl border border-gray-200 p-8 text-center">
          Aucun message dans cette vue.
        </p>
      ) : (
        <div className="space-y-4">
          {rows.map((message) => (
            <article
              key={message.id}
              className={`bg-white rounded-2xl border p-6 ${
                message.handledAt ? 'border-gray-200 opacity-70' : 'border-gray-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-darkblue/40 mb-1">
                    {formatDate(message.createdAt)}
                    {message.handledAt && (
                      <> · traité le {formatDate(message.handledAt)}</>
                    )}
                  </p>
                  <p className="font-semibold flex items-center gap-2">
                    {message.name}
                    {message.source === 'groupe' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-teal/10 text-teal uppercase tracking-wide">
                        <Users size={12} />
                        Groupe
                      </span>
                    )}
                  </p>
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                    className="text-sm text-teal hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
              </div>

              <p className="font-semibold text-sm mb-2">{message.subject}</p>
              {/* Shown in full: these are short, and truncating would mean
                  opening a detail page for every one of them. */}
              <p className="text-sm text-darkblue/70 whitespace-pre-line leading-relaxed mb-6">
                {message.message}
              </p>

              <div className="pt-4 border-t border-gray-100">
                <form action={message.handledAt ? markUnhandled : markHandled}>
                  <input type="hidden" name="messageId" value={message.id} />
                  <input type="hidden" name="returnTo" value={currentPath} />
                  <button
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      message.handledAt
                        ? 'border border-gray-200 text-darkblue/60 hover:border-gray-300'
                        : 'bg-teal text-white hover:bg-teal-600'
                    }`}
                  >
                    {message.handledAt ? 'Rouvrir' : 'Marquer traité'}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination page={page} hasMore={hasMore} hrefFor={hrefFor} />

      {total > 0 && (
        <p className="text-xs text-darkblue/40 mt-4 text-center">
          {total} message{total > 1 ? 's' : ''} dans cette vue.
        </p>
      )}
    </div>
  )
}

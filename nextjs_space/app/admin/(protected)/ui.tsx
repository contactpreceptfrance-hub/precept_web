import Link from 'next/link'

/** Outcome of the last action, rendered once above a list. */
export function ActionNote({ note }: { note?: string }) {
  if (!note) return null

  const messages: Record<string, { text: string; tone: 'ok' | 'warn' }> = {
    ok: { text: 'Modification enregistrée.', tone: 'ok' },
    // Not an error: the row was already in the target state, usually because of
    // a double click or a page left open while someone else acted.
    inchange: {
      text: 'Aucun changement : la ligne n’était pas dans l’état attendu. Rafraîchissez la page.',
      tone: 'warn',
    },
    invalide: { text: 'Requête invalide.', tone: 'warn' },
  }

  const entry = messages[note]
  if (!entry) return null

  return (
    <p
      role="status"
      className={`mb-6 text-sm rounded-xl px-4 py-3 ${
        entry.tone === 'ok'
          ? 'bg-green-50 text-green-700'
          : 'bg-amber-50 text-amber-800'
      }`}
    >
      {entry.text}
    </p>
  )
}

/** A problem that makes a row unactionable, stated rather than hidden. */
export function Problem({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm rounded-xl px-4 py-3 bg-red-50 text-red-700 mb-3">{children}</p>
  )
}

export function Tabs({
  items,
  current,
}: {
  items: { href: string; label: string; count?: number }[]
  current: string
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {items.map((item) => {
        const active = item.href === current
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              active
                ? 'bg-teal text-white'
                : 'bg-white border border-gray-200 text-darkblue/70 hover:border-gray-300'
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={active ? 'ml-2 opacity-80' : 'ml-2 text-darkblue/40'}>
                {item.count}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PAID: 'bg-amber-100 text-amber-700',
  SHIPPED: 'bg-green-100 text-green-700',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  PAID: 'Payée',
  SHIPPED: 'Expédiée',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
        STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Europe/Paris',
})

/**
 * Always rendered in Europe/Paris.
 *
 * The server runs in UTC on Vercel; without a fixed zone an order placed at
 * 00:30 in Paris would be listed under the previous day for the team reading it.
 */
export function formatDate(value: Date): string {
  return dateFormatter.format(value)
}

export function formatEuros(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`
}

export function Pagination({
  page,
  hasMore,
  hrefFor,
}: {
  page: number
  hasMore: boolean
  hrefFor: (page: number) => string
}) {
  if (page === 1 && !hasMore) return null

  return (
    <div className="flex items-center justify-between mt-8 text-sm">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="text-teal font-semibold hover:underline">
          ← Précédent
        </Link>
      ) : (
        <span />
      )}
      <span className="text-darkblue/40">Page {page}</span>
      {hasMore ? (
        <Link href={hrefFor(page + 1)} className="text-teal font-semibold hover:underline">
          Suivant →
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}

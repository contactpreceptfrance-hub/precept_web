import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUp, Plus } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { SERIES_CONFIG } from '@/lib/types'
import { ActionNote, Tabs, formatEuros } from '../ui'
import { moveBook, setPublished, setSoldOut } from './actions'

export const metadata: Metadata = {
  title: 'Livres — Administration',
  robots: { index: false, follow: false },
}

const FILTERS = ['tous', 'masques', 'epuises'] as const
type Filter = (typeof FILTERS)[number]

const smallButton =
  'px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-darkblue/70 hover:border-gray-300 hover:text-darkblue transition-colors'

/**
 * One row of the catalogue.
 *
 * Every control is its own tiny form posting to a Server Action, so the whole
 * screen works without client JavaScript.
 */
function BookRow({
  book,
  returnTo,
  canMove,
  isFirst,
  isLast,
}: {
  book: {
    id: string
    name: string
    price: number
    imageUrl: string
    type: string
    published: boolean
    soldOut: boolean
  }
  returnTo: string
  canMove: boolean
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <li className="flex flex-wrap items-center gap-4 px-4 py-3">
      <div className="relative w-10 aspect-[2/3] shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200">
        <Image src={book.imageUrl} alt="" fill className="object-contain" sizes="40px" />
      </div>

      <div className="min-w-0 flex-1 basis-56">
        <Link href={`/admin/livres/${book.id}`} className="font-semibold hover:text-teal">
          {book.name}
        </Link>
        <p className="text-sm text-darkblue/50">
          {formatEuros(book.price)}
          {book.type === 'FORMATION' && ' · Formation'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {!book.published && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide bg-gray-100 text-gray-600">
            Masqué
          </span>
        )}
        {book.soldOut && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide bg-amber-100 text-amber-700">
            Épuisé
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/admin/livres/${book.id}`} className={smallButton}>
          Modifier
        </Link>

        <form action={setPublished}>
          <input type="hidden" name="bookId" value={book.id} />
          <input type="hidden" name="to" value={book.published ? '0' : '1'} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button type="submit" className={smallButton}>
            {book.published ? 'Masquer' : 'Afficher'}
          </button>
        </form>

        <form action={setSoldOut}>
          <input type="hidden" name="bookId" value={book.id} />
          <input type="hidden" name="to" value={book.soldOut ? '0' : '1'} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button type="submit" className={smallButton}>
            {book.soldOut ? 'Remettre en vente' : 'Marquer épuisé'}
          </button>
        </form>

        {canMove && (
          <div className="flex gap-1">
            {(['up', 'down'] as const).map((direction) => {
              const disabled = direction === 'up' ? isFirst : isLast
              const Icon = direction === 'up' ? ArrowUp : ArrowDown
              return (
                <form action={moveBook} key={direction}>
                  <input type="hidden" name="bookId" value={book.id} />
                  <input type="hidden" name="direction" value={direction} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <button
                    type="submit"
                    disabled={disabled}
                    aria-label={direction === 'up' ? 'Monter' : 'Descendre'}
                    className={`${smallButton} px-2 disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <Icon size={14} />
                  </button>
                </form>
              )
            })}
          </div>
        )}
      </div>
    </li>
  )
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { filtre?: string; note?: string }
}) {
  await requireAdmin()

  const filter: Filter = FILTERS.find((f) => f === searchParams.filtre) ?? 'tous'

  const books = await getPrisma().product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      type: true,
      series: true,
      published: true,
      soldOut: true,
    },
  })

  const counts = {
    tous: books.length,
    masques: books.filter((b) => !b.published).length,
    epuises: books.filter((b) => b.soldOut).length,
  }

  const visible = books.filter((b) =>
    filter === 'masques' ? !b.published : filter === 'epuises' ? b.soldOut : true,
  )

  // Same grouping as the shop: known series in their display order, then
  // whatever has no recognised series.
  const known = new Set(SERIES_CONFIG.map((s) => s.key))
  const groups = [
    ...SERIES_CONFIG.map(({ key, label }) => ({
      key,
      label,
      books: visible.filter((b) => b.series === key),
    })),
    {
      key: 'autres',
      label: 'Autres ressources',
      books: visible.filter((b) => !b.series || !known.has(b.series)),
    },
  ].filter((g) => g.books.length > 0)

  const base = '/admin/livres'
  const tabHref = (f: Filter) => (f === 'tous' ? base : `${base}?filtre=${f}`)
  const returnTo = tabHref(filter)

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="font-playfair text-2xl font-bold">Livres</h1>
        <Link
          href="/admin/livres/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-white text-sm font-bold hover:bg-teal-600 transition-colors"
        >
          <Plus size={16} /> Ajouter un livre
        </Link>
      </div>

      <ActionNote note={searchParams.note} />

      <Tabs
        current={tabHref(filter)}
        items={[
          { href: tabHref('tous'), label: 'Tous', count: counts.tous },
          { href: tabHref('masques'), label: 'Masqués', count: counts.masques },
          { href: tabHref('epuises'), label: 'Épuisés', count: counts.epuises },
        ]}
      />

      {groups.length === 0 && (
        <p className="text-darkblue/50 text-center py-16">Aucun livre dans cette liste.</p>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.key}>
            <h2 className="font-playfair text-lg font-bold mb-3">{group.label}</h2>
            <ul className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {group.books.map((book, index) => (
                <BookRow
                  key={book.id}
                  book={book}
                  returnTo={returnTo}
                  // Reordering only makes sense on the full list; in a filtered
                  // view the neighbours shown are not the real neighbours.
                  canMove={filter === 'tous' && group.key !== 'autres'}
                  isFirst={index === 0}
                  isLast={index === group.books.length - 1}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

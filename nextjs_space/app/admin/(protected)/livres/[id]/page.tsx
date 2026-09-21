import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { ActionNote } from '../../ui'
import { BookForm } from '../book-form'
import { deleteBook, updateBook } from '../actions'

export const metadata: Metadata = {
  title: 'Modifier un livre — Administration',
  robots: { index: false, follow: false },
}

export default async function EditBookPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { note?: string }
}) {
  await requireAdmin()

  const prisma = getPrisma()
  const book = await prisma.product.findUnique({
    where: { id: params.id },
    include: { _count: { select: { orderItems: true } } },
  })
  if (!book) notFound()

  const hasOrders = book._count.orderItems > 0

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/livres"
        className="inline-flex items-center gap-2 text-sm text-darkblue/50 hover:text-darkblue mb-6"
      >
        <ArrowLeft size={16} /> Retour aux livres
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="font-playfair text-2xl font-bold">{book.name}</h1>
        {book.published && (
          <Link
            href={`/boutique/${book.id}`}
            target="_blank"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline"
          >
            Voir dans la boutique <ExternalLink size={14} />
          </Link>
        )}
      </div>

      <ActionNote note={searchParams.note} />
      <BookForm action={updateBook} book={book} />

      <section className="mt-10 rounded-2xl border border-red-100 bg-white p-6">
        <h2 className="font-semibold text-red-700 mb-2">Supprimer ce livre</h2>
        {hasOrders ? (
          <p className="text-sm text-darkblue/60">
            Ce livre figure dans {book._count.orderItems} ligne(s) de commande : il ne peut pas être
            supprimé, pour conserver l’historique. Décochez « Visible dans la boutique » ci-dessus
            pour le retirer de la vente.
          </p>
        ) : (
          // A <details>, not window.confirm: a second, deliberate click without
          // any client JavaScript.
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-darkblue/70 hover:text-darkblue">
              Afficher le bouton de suppression
            </summary>
            <form action={deleteBook} className="mt-4">
              <input type="hidden" name="bookId" value={book.id} />
              <p className="text-sm text-darkblue/60 mb-3">
                Suppression définitive, sans retour possible. Pour simplement retirer le livre de la
                vente, décochez plutôt « Visible dans la boutique ».
              </p>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Supprimer définitivement
              </button>
            </form>
          </details>
        )}
      </section>
    </div>
  )
}

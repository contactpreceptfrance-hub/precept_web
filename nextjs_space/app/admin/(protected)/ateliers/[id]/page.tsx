import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { ActionNote } from '../../ui'
import { AtelierForm } from '../atelier-form'
import { deleteAtelier, updateAtelier } from '../actions'

export const metadata: Metadata = {
  title: 'Modifier un atelier — Administration',
  robots: { index: false, follow: false },
}

export default async function EditAtelierPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { note?: string }
}) {
  await requireAdmin()

  const prisma = getPrisma()
  const [atelier, books] = await Promise.all([
    prisma.atelier.findUnique({ where: { id: params.id } }),
    prisma.product.findMany({
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        samplePdfUrl: true,
        published: true,
      },
    }),
  ])

  if (!atelier) notFound()

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/ateliers"
        className="inline-flex items-center gap-2 text-sm text-darkblue/50 hover:text-darkblue mb-6"
      >
        <ArrowLeft size={16} /> Retour aux ateliers
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="font-playfair text-2xl font-bold">{atelier.title}</h1>
        {atelier.published && (
          <Link
            href={`/ateliers#atelier-${atelier.id}`}
            target="_blank"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline"
          >
            Voir sur la page Ateliers <ExternalLink size={14} />
          </Link>
        )}
      </div>

      <ActionNote note={searchParams.note} />
      <AtelierForm action={updateAtelier} atelier={atelier} books={books} />

      <section className="mt-10 rounded-2xl border border-red-100 bg-white p-6">
        <h2 className="font-semibold text-red-700 mb-2">Supprimer cet atelier</h2>
        <details>
          <summary className="cursor-pointer text-sm font-semibold text-darkblue/70 hover:text-darkblue">
            Afficher le bouton de suppression
          </summary>
          <form action={deleteAtelier} className="mt-4">
            <input type="hidden" name="atelierId" value={atelier.id} />
            <p className="text-sm text-darkblue/60 mb-3">
              Suppression définitive de cet atelier. Pour simplement le masquer temporairement,
              décochez plutôt « Visible sur la page Ateliers » ci-dessus.
            </p>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
            >
              Supprimer définitivement
            </button>
          </form>
        </details>
      </section>
    </div>
  )
}

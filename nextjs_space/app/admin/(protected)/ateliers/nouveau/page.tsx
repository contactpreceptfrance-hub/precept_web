import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { ActionNote } from '../../ui'
import { AtelierForm } from '../atelier-form'
import { createAtelier } from '../actions'

export const metadata: Metadata = {
  title: 'Nouvel atelier — Administration',
  robots: { index: false, follow: false },
}

export default async function NewAtelierPage({
  searchParams,
}: {
  searchParams: { note?: string }
}) {
  await requireAdmin()

  const books = await getPrisma().product.findMany({
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      samplePdfUrl: true,
      published: true,
    },
  })

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/ateliers"
        className="inline-flex items-center gap-2 text-sm text-darkblue/50 hover:text-darkblue mb-6"
      >
        <ArrowLeft size={16} /> Retour aux ateliers
      </Link>
      <h1 className="font-playfair text-2xl font-bold mb-6">Nouvel atelier Zoom</h1>
      <ActionNote note={searchParams.note} />
      <AtelierForm action={createAtelier} books={books} />
    </div>
  )
}

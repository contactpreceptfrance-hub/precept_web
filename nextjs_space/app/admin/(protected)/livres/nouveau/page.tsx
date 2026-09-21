import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-guard'
import { ActionNote } from '../../ui'
import { BookForm } from '../book-form'
import { createBook } from '../actions'

export const metadata: Metadata = {
  title: 'Nouveau livre — Administration',
  robots: { index: false, follow: false },
}

export default async function NewBookPage({
  searchParams,
}: {
  searchParams: { note?: string }
}) {
  await requireAdmin()

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/livres"
        className="inline-flex items-center gap-2 text-sm text-darkblue/50 hover:text-darkblue mb-6"
      >
        <ArrowLeft size={16} /> Retour aux livres
      </Link>
      <h1 className="font-playfair text-2xl font-bold mb-6">Nouveau livre</h1>
      <ActionNote note={searchParams.note} />
      <BookForm action={createBook} />
    </div>
  )
}

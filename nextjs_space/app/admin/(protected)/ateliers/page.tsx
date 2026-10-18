import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUp, BookOpen, ExternalLink, FileText, Plus, Star, Video } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-guard'
import { getSamplePdfUrl } from '@/lib/sample-pdfs'
import { ActionNote, Tabs, formatDate } from '../ui'
import { moveAtelier, setAtelierFeatured, setAtelierPublished } from './actions'

export const metadata: Metadata = {
  title: 'Ateliers — Administration',
  robots: { index: false, follow: false },
}

const FILTERS = ['tous', 'une', 'masques'] as const
type Filter = (typeof FILTERS)[number]

const smallButton =
  'px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-darkblue/70 hover:border-gray-300 hover:text-darkblue transition-colors'

export default async function AdminAteliersPage({
  searchParams,
}: {
  searchParams: { filtre?: string; note?: string }
}) {
  await requireAdmin()

  const filter: Filter = FILTERS.find((f) => f === searchParams.filtre) ?? 'tous'

  const ateliers = await getPrisma().atelier.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    include: {
      product: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          samplePdfUrl: true,
        },
      },
    },
  })

  const counts = {
    tous: ateliers.length,
    une: ateliers.filter((a) => a.featured).length,
    masques: ateliers.filter((a) => !a.published).length,
  }

  const visible = ateliers.filter((a) =>
    filter === 'masques' ? !a.published : filter === 'une' ? a.featured : true,
  )

  const base = '/admin/ateliers'
  const tabHref = (f: Filter) => (f === 'tous' ? base : `${base}?filtre=${f}`)
  const returnTo = tabHref(filter)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold">Ateliers Zoom</h1>
          <p className="text-sm text-darkblue/60 mt-1">
            Gérez vos rencontres hebdomadaires sur Zoom, les livres associés et les extraits PDF.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/ateliers"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-darkblue/80 text-xs font-semibold hover:border-gray-300 transition-colors"
          >
            Voir la page publique <ExternalLink size={14} />
          </Link>
          <Link
            href="/admin/ateliers/nouveau"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-white text-sm font-bold hover:bg-teal-600 transition-colors"
          >
            <Plus size={16} /> Ajouter un atelier
          </Link>
        </div>
      </div>

      <ActionNote note={searchParams.note} />

      <Tabs
        current={tabHref(filter)}
        items={[
          { href: tabHref('tous'), label: 'Tous', count: counts.tous },
          { href: tabHref('une'), label: 'À la une', count: counts.une },
          { href: tabHref('masques'), label: 'Masqués', count: counts.masques },
        ]}
      />

      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Video size={32} className="text-teal mx-auto mb-3 opacity-80" />
          <p className="text-darkblue font-semibold mb-1">Aucun atelier dans cette vue</p>
          <p className="text-sm text-darkblue/50 mb-5">
            Ajoutez votre premier atelier hebdomadaire sur Zoom pour l’afficher sur la page /ateliers.
          </p>
          <Link
            href="/admin/ateliers/nouveau"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-white text-sm font-bold hover:bg-teal-600 transition-colors"
          >
            <Plus size={16} /> Créer un atelier
          </Link>
        </div>
      ) : (
        <ul className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {visible.map((atelier, index) => {
            const coverUrl = atelier.customImageUrl || atelier.product?.imageUrl || null
            const hasPdf = Boolean(
              atelier.customPdfUrl ||
                atelier.product?.samplePdfUrl ||
                (atelier.product ? getSamplePdfUrl(atelier.product.name) : null) ||
                getSamplePdfUrl(atelier.title),
            )
            const canMove = filter === 'tous'
            const isFirst = index === 0
            const isLast = index === visible.length - 1

            return (
              <li key={atelier.id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <div className="relative w-11 aspect-[2/3] shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                  {coverUrl ? (
                    <Image src={coverUrl} alt="" fill className="object-contain" sizes="44px" />
                  ) : (
                    <Video size={18} className="text-teal/60" />
                  )}
                </div>

                <div className="min-w-0 flex-1 basis-64">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/ateliers/${atelier.id}`}
                      className="font-semibold hover:text-teal text-darkblue"
                    >
                      {atelier.title}
                    </Link>
                    {atelier.featured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        <Star size={11} className="fill-current" /> À la une
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-darkblue/60 mt-0.5">
                    {atelier.scheduleText}
                    {atelier.nextDate && ` · Prochaine : ${formatDate(atelier.nextDate)}`}
                    {atelier.leaderName && ` · ${atelier.leaderName}`}
                  </p>
                  {atelier.product && (
                    <p className="text-xs text-teal font-medium mt-0.5 flex items-center gap-1">
                      <BookOpen size={12} /> Livre lié : {atelier.product.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {hasPdf && (
                    <span
                      title="Extrait PDF gratuit disponible"
                      className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal/10 text-teal flex items-center gap-1"
                    >
                      <FileText size={12} /> PDF
                    </span>
                  )}
                  {!atelier.published && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide bg-gray-100 text-gray-600">
                      Masqué
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/ateliers/${atelier.id}`} className={smallButton}>
                    Modifier
                  </Link>

                  <form action={setAtelierFeatured}>
                    <input type="hidden" name="atelierId" value={atelier.id} />
                    <input type="hidden" name="to" value={atelier.featured ? '0' : '1'} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button type="submit" className={smallButton}>
                      {atelier.featured ? 'Retirer la une' : 'Mettre à la une'}
                    </button>
                  </form>

                  <form action={setAtelierPublished}>
                    <input type="hidden" name="atelierId" value={atelier.id} />
                    <input type="hidden" name="to" value={atelier.published ? '0' : '1'} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button type="submit" className={smallButton}>
                      {atelier.published ? 'Masquer' : 'Afficher'}
                    </button>
                  </form>

                  {canMove && (
                    <div className="flex gap-1">
                      {(['up', 'down'] as const).map((direction) => {
                        const disabled = direction === 'up' ? isFirst : isLast
                        const Icon = direction === 'up' ? ArrowUp : ArrowDown
                        return (
                          <form action={moveAtelier} key={direction}>
                            <input type="hidden" name="atelierId" value={atelier.id} />
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
          })}
        </ul>
      )}
    </div>
  )
}

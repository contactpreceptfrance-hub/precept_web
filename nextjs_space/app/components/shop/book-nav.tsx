import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { CatalogueEntry } from '@/lib/products'

type BookNavProps = {
  prev: CatalogueEntry | null
  next: CatalogueEntry | null
}

type SideProps = {
  product: CatalogueEntry
  direction: 'prev' | 'next'
}

function NavLink({ product, direction }: SideProps) {
  const isPrev = direction === 'prev'

  return (
    <Link
      href={`/boutique/${product.id}`}
      // Row order flips for "next" so the cover always sits on the outer edge
      // and the two arrows point away from each other.
      className={`group flex items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:border-teal/50 hover:shadow-lg transition-all ${
        isPrev ? '' : 'flex-row-reverse text-right'
      }`}
    >
      {/* Same 2/3 box and object-contain as the catalogue cards: the covers are
          not a uniform shape, so letterbox rather than crop the artwork. */}
      <div className="relative w-14 aspect-[2/3] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            className="object-contain"
            sizes="56px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d3560] to-[#125f67]" />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-darkblue/40 text-xs uppercase tracking-widest mb-1">
          {isPrev ? 'Précédent' : 'Suivant'}
        </p>
        <p
          className={`text-darkblue font-semibold leading-snug group-hover:text-teal transition-colors flex items-center gap-2 ${
            isPrev ? '' : 'flex-row-reverse'
          }`}
        >
          {isPrev ? (
            <ArrowLeft size={16} className="flex-shrink-0" />
          ) : (
            <ArrowRight size={16} className="flex-shrink-0" />
          )}
          <span className="line-clamp-2">{product.name}</span>
        </p>
      </div>
    </Link>
  )
}

/**
 * Previous / next navigation through the catalogue, in the order /boutique
 * displays it — so a reader keeps walking their series and then flows into the
 * next one.
 *
 * There is no wrap-around. At either end of the catalogue the missing side
 * renders as an empty cell rather than disappearing, so the remaining link
 * stays on its own side of the row instead of sliding across.
 */
export function BookNav({ prev, next }: BookNavProps) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Navigation entre les livres"
      className="mt-16 pt-8 border-t border-gray-200 grid sm:grid-cols-2 gap-4"
    >
      {prev ? <NavLink product={prev} direction="prev" /> : <div className="hidden sm:block" />}
      {next ? <NavLink product={next} direction="next" /> : <div className="hidden sm:block" />}
    </nav>
  )
}

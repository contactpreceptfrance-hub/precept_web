import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { getSeriesGroups } from '@/lib/products'
import { BookCard } from '@/app/components/shop/book-card'

/**
 * The catalogue, glimpsed from the home page.
 *
 * One title per series rather than the first N books overall: the series ARE
 * the offer — a ladder from the lightest commitment to the most intensive — and
 * six covers side by side say that faster than any paragraph. Taking the first
 * eight books would have shown "40 Minutes" five times over.
 *
 * A server component: it reads the catalogue through the same `getSeriesGroups`
 * the shop uses, at render time. The previous attempt at this section fetched
 * `/api/products` from the browser, which cost a dynamic function call on every
 * home-page visit and flashed a spinner. `BookCard` is a client component, but
 * it is rendered from here with plain serializable props, so this adds no new
 * client code at all.
 */
export default async function HomeShopPreview() {
  const groups = await getSeriesGroups()

  // One representative title per series, in the shop's own display order.
  const featured = groups
    .map((group) => ({ label: group.label, product: group.products[0] }))
    .filter((entry): entry is { label: string; product: NonNullable<typeof entry.product> } =>
      Boolean(entry.product),
    )

  if (featured.length === 0) return null

  return (
    <section id="boutique" className="scroll-mt-20 py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal rounded-full mb-6">
            <BookOpen size={20} />
            <span className="font-medium">Notre Boutique</span>
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-darkblue mb-4">
            Un parcours pour <span className="text-teal">chaque étape</span>
          </h2>
          <p className="text-darkblue/70 max-w-2xl mx-auto">
            De la série 40 Minutes, sans devoirs, jusqu&apos;à l&apos;étude verset par verset de
            Précepte sur Précepte : nos collections vous accompagnent où que vous en soyez.
          </p>
        </div>

        {/* A grid, not flex-wrap: six 176px cards plus their gaps overflow the
            1168px content box by a handful of pixels, which left the sixth
            stranded alone on a second row.
            Six columns only from `xl`, not `lg`: BookCard is a fixed 176px, and
            at 1024px six columns are 152px each — the cards overlapped their
            neighbours by 24px. Six abreast needs 1136px of content box, so the
            row only forms once the viewport can actually hold it. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-10 justify-items-center mb-14">
          {featured.map(({ label, product }) => (
            <div key={product.id} className="w-44">
              {/* Fixed height so a label that wraps to two lines does not push
                  its cover below the others. */}
              <p className="text-darkblue/40 text-[11px] uppercase tracking-widest mb-2 h-8 leading-tight">
                {label}
              </p>
              <BookCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                type={product.type}
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal text-white font-bold hover:bg-teal-600 transition-colors"
          >
            Voir toute la boutique
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

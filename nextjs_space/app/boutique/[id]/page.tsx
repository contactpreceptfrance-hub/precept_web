import type { Metadata } from 'next'
import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Facebook, Mail } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import { getAdjacentProducts } from '@/lib/products'
import { SITE_URL } from '@/lib/site'
import { AddToCartButton } from '@/app/components/shop/add-to-cart-button'
import { CoverViewer } from '@/app/components/shop/cover-viewer'
import { BookNav } from '@/app/components/shop/book-nav'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'

type Props = { params: { id: string } }

// Prerender the whole catalogue at build time and refresh it hourly, matching
// /boutique. `dynamicParams` stays at its default: a title added between two
// revalidations is still rendered on demand rather than 404ing.
export const revalidate = 3600

export async function generateStaticParams() {
  const products = await getPrisma().product.findMany({ select: { id: true } })
  return products.map(({ id }) => ({ id }))
}

// cache() dedupes the lookup within a single render: generateMetadata and the
// page component both need the product, and without this every page would cost
// two round trips to the database instead of one.
const getProduct = cache(async (id: string) => {
  const prisma = getPrisma()
  return prisma.product.findUnique({ where: { id } })
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id)
  if (!product) return {}
  return {
    title: `${product.name} — Precept France`,
    description: product.description,
    alternates: { canonical: `/boutique/${product.id}` },
    openGraph: {
      title: `${product.name} — Precept France`,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : ['/og-image.png'],
      type: 'website',
    },
  }
}

export default async function BookDetailPage({ params }: Props) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  const { prev, next } = await getAdjacentProducts(product.id)

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-16">
        <Link href="/boutique" className="inline-flex items-center gap-2 text-darkblue/50 hover:text-darkblue transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Retour à la boutique
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Cover — recto, with a toggle to the back when one exists */}
          <CoverViewer
            name={product.name}
            imageUrl={product.imageUrl}
            backImageUrl={product.backImageUrl}
            type={product.type}
            series={product.series}
          />

          {/* Info */}
          <div>
            <h1 className="font-playfair text-3xl font-bold text-darkblue mb-3">{product.name}</h1>
            <p className="text-teal text-3xl font-black mb-6">{product.price.toFixed(2)} €</p>
            <p className="text-darkblue/70 leading-relaxed mb-8">{product.description}</p>

            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
            />

            {/* Share row */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-darkblue/40 text-xs uppercase tracking-widest mb-3">Partager</p>
              <div className="flex gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/boutique/${product.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877f2] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Facebook size={15} /> Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${product.name} — ${product.description.slice(0, 80)}…`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25d366] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  WA
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(product.description)}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4b5563] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Mail size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <BookNav prev={prev} next={next} />
      </div>
      <Footer />
    </main>
  )
}

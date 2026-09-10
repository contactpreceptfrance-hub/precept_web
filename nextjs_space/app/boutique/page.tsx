import type { Metadata } from 'next'
import { ShopHero } from '@/app/components/shop/shop-hero'
import { SeriesRows } from '@/app/components/shop/series-rows'
import { getSeriesGroups } from '@/lib/products'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'

export const metadata: Metadata = {
  alternates: { canonical: '/boutique' },
  title: 'Boutique — Precept France',
  description: 'Livres et formations pour approfondir votre connaissance de la Parole de Dieu.',
}

// Prerendered and refreshed hourly rather than rendered on every visit. The
// catalogue changes when a book is added, not between two page views, so an
// hour-old page is indistinguishable from a fresh one — and it is served from
// the edge cache instead of costing a round trip to eu-central-1.
export const revalidate = 3600

export default async function BoutiquePage() {
  const groups = await getSeriesGroups()

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[72px]"> {/* offset for fixed header */}
        <ShopHero />
        <SeriesRows groups={groups} />
      </div>
      <Footer />
    </main>
  )
}

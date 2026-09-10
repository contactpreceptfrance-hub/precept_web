import type { Metadata } from 'next'
import { ShopHero } from '@/app/components/shop/shop-hero'
import { SeriesRows } from '@/app/components/shop/series-rows'
import { SeriesGroup } from '@/lib/types'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'

export const metadata: Metadata = {
  alternates: { canonical: '/boutique' },
  title: 'Boutique — Precept France',
  description: 'Livres et formations pour approfondir votre connaissance de la Parole de Dieu.',
}

async function getGroups(): Promise<SeriesGroup[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function BoutiquePage() {
  const groups = await getGroups()

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

import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { SERIES_CONFIG, SeriesGroup } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const prisma = getPrisma()
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
    })

    // Group by series in display order
    const groups: SeriesGroup[] = SERIES_CONFIG
      .map(({ key, label }) => ({
        series: key,
        label,
        products: products.filter(p => p.series === key),
      }))
      .filter(g => g.products.length > 0)

    // Any products with unknown/null series go into an "Autres" group
    const knownKeys = new Set(SERIES_CONFIG.map(s => s.key))
    const others = products.filter(p => !p.series || !knownKeys.has(p.series))
    if (others.length > 0) {
      groups.push({ series: 'autres', label: 'Autres ressources', products: others })
    }

    return NextResponse.json(groups)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

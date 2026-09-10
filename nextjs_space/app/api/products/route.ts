import { NextResponse } from 'next/server'
import { getSeriesGroups } from '@/lib/products'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(await getSeriesGroups())
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

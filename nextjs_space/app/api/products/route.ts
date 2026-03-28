import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const prisma = getPrisma()
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products ?? [])
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

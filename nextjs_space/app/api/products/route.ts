export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products ?? [])
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

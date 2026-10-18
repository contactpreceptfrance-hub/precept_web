import { cache } from 'react'
import { getPrisma } from '@/lib/prisma'
import { getSamplePdfUrl } from '@/lib/sample-pdfs'
import { isSoldOut } from '@/lib/stock'

export type PublicAtelier = {
  id: string
  title: string
  description: string
  scheduleText: string
  nextDate: string | null // ISO string for safe serialization to Client Components
  durationMin: number
  leaderName: string | null
  zoomUrl: string
  zoomInfo: string | null
  featured: boolean
  imageUrl: string | null
  pdfUrl: string | null
  book: {
    id: string
    name: string
    price: number
    soldOut: boolean
    imageUrl: string
  } | null
}

/**
 * Loads all published Ateliers in display order (featured first, then sortOrder),
 * resolving inherited book cover images and sample PDFs automatically.
 */
export const getPublishedAteliers = cache(async (): Promise<PublicAtelier[]> => {
  try {
    const rows = await getPrisma().atelier.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        product: true,
      },
    })

    return rows.map((row) => {
      const linkedBook = row.product && row.product.published ? row.product : null
      const imageUrl = row.customImageUrl || linkedBook?.imageUrl || null
      const pdfUrl =
        row.customPdfUrl ||
        linkedBook?.samplePdfUrl ||
        (linkedBook ? getSamplePdfUrl(linkedBook.name) : null) ||
        getSamplePdfUrl(row.title)

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        scheduleText: row.scheduleText,
        nextDate: row.nextDate ? row.nextDate.toISOString() : null,
        durationMin: row.durationMin,
        leaderName: row.leaderName,
        zoomUrl: row.zoomUrl,
        zoomInfo: row.zoomInfo,
        featured: row.featured,
        imageUrl,
        pdfUrl,
        book: linkedBook
          ? {
              id: linkedBook.id,
              name: linkedBook.name,
              price: linkedBook.price,
              soldOut: isSoldOut(linkedBook),
              imageUrl: linkedBook.imageUrl,
            }
          : null,
      }
    })
  } catch (error) {
    console.error('getPublishedAteliers: could not load ateliers', error)
    return []
  }
})

export const getAtelierById = cache(async (id: string): Promise<PublicAtelier | null> => {
  const ateliers = await getPublishedAteliers()
  return ateliers.find((a) => a.id === id) ?? null
})


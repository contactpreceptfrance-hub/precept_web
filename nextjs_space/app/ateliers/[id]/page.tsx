import type { Metadata } from 'next'
import { getAtelierById, getPublishedAteliers } from '@/lib/ateliers'
import { SITE_URL } from '@/lib/site'
import { AteliersView } from '@/app/components/ateliers-view'

type Props = { params: { id: string } }

export const revalidate = 3600

export async function generateStaticParams() {
  const ateliers = await getPublishedAteliers()
  return ateliers.map(({ id }) => ({ id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const atelier = await getAtelierById(params.id)
  if (!atelier) {
    return {
      title: 'Ateliers en ligne & Nos études — Precept France',
    }
  }

  const title = `Atelier Precept : ${atelier.title} — Precept France`
  const description = `${atelier.scheduleText}. ${atelier.description}`
  const imageUrl = atelier.imageUrl || atelier.book?.imageUrl || '/og-image.png'

  return {
    title,
    description,
    alternates: { canonical: `/ateliers/${atelier.id}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/ateliers/${atelier.id}`,
      images: [imageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function AtelierDetailPage({ params }: Props) {
  return <AteliersView highlightId={params.id} />
}

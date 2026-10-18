import type { Metadata } from 'next'
import { getPublishedAteliers } from '@/lib/ateliers'
import { AteliersView } from '@/app/components/ateliers-view'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const ateliers = await getPublishedAteliers()
  const primary = ateliers.find((a) => a.featured) ?? ateliers[0] ?? null
  const ogImage = primary?.imageUrl || primary?.book?.imageUrl || '/og-image.png'
  const title = 'Ateliers en ligne & Nos études — Precept France'
  const description =
    'Rejoignez gratuitement nos ateliers hebdomadaires d’étude biblique inductive en ligne, découvrez la méthode Précepte et trouvez la collection adaptée à votre rythme.'

  return {
    alternates: { canonical: '/ateliers' },
    title,
    description,
    openGraph: {
      title,
      description,
      url: '/ateliers',
      images: [ogImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function AteliersPage() {
  return <AteliersView />
}

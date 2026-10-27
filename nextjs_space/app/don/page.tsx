import type { Metadata } from 'next'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'
import { DonView } from './don-view'
import { LEGAL } from '@/lib/legal'

export const revalidate = 3600

export const metadata: Metadata = {
  alternates: { canonical: '/don' },
  title: 'Faire un don — Precept France',
  description:
    'Soutenez Precept France par un don ponctuel ou mensuel, par carte bancaire ou par virement.',
  openGraph: {
    title: 'Faire un don — Precept France',
    description:
      'Soutenez Precept France par un don ponctuel ou mensuel, par carte bancaire ou par virement.',
    url: '/don',
    type: 'website',
  },
}

export default function DonPage() {
  const { titulaire, iban, bic } = LEGAL.banque
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <DonView bank={iban ? { titulaire, iban, bic } : null} />
      <Footer />
    </main>
  )
}

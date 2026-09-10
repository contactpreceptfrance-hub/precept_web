import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'

export const metadata: Metadata = {
  alternates: { canonical: '/etude' },
  title: 'Trouvez une étude — Precept France',
  description:
    'Réunissons-nous en communauté autour de la Parole de Dieu pour le connaître profondément et vivre ensemble différemment.',
}

const GUIDE_PDF = '/images/Choisir-letude-ideale-7-26.pdf'

export default function EtudePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="max-w-5xl mx-auto px-6 pt-32 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-darkblue mb-6">
            Trouvez une étude
          </h1>
          <p className="text-lg text-darkblue/70 leading-relaxed">
            Réunissons-nous en communauté autour de la Parole de Dieu pour le connaître
            profondément et vivre ensemble différemment.
          </p>

          <a
            href={GUIDE_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-4 bg-teal text-white rounded-lg font-semibold hover:bg-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FileText size={20} />
            Choisir l&apos;étude idéale (PDF)
          </a>
        </div>

        {/* Inline preview of the guide; the button above covers browsers that cannot embed PDFs */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50">
          <iframe
            src={`${GUIDE_PDF}#view=FitH`}
            title="Choisir l'étude idéale"
            className="w-full h-[70vh] min-h-[480px]"
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}

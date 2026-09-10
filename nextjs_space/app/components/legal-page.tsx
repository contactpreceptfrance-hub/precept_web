import Header from '@/app/components/header'
import Footer from '@/app/components/footer'
import { LEGAL } from '@/lib/legal'

/**
 * Rend une valeur du fichier lib/legal.ts, ou un repère rouge bien visible
 * tant qu'elle n'a pas été renseignée. Mieux vaut voir le trou que le manquer.
 */
export function Champ({ valeur, label }: { valeur: string; label: string }) {
  if (valeur) return <>{valeur}</>
  return (
    <mark className="bg-red-100 text-red-700 font-semibold px-1.5 py-0.5 rounded">
      [À COMPLÉTER — {label}]
    </mark>
  )
}

export function Article({
  titre,
  children,
}: {
  titre: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10">
      <h2 className="font-playfair text-xl md:text-2xl font-bold text-darkblue mb-3">
        {titre}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export default function LegalPage({
  titre,
  intro,
  children,
}: {
  titre: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <article className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-darkblue">
          {titre}
        </h1>
        {intro && (
          <p className="mt-4 text-darkblue/70 leading-relaxed">{intro}</p>
        )}

        <div className="mt-8 text-darkblue/80 leading-relaxed [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-teal [&_a]:underline [&_a:hover]:text-teal-600 [&_strong]:text-darkblue [&_strong]:font-semibold">
          {children}
        </div>

        <p className="mt-14 pt-6 border-t border-gray-200 text-sm text-darkblue/50">
          Dernière mise à jour : {LEGAL.derniereMiseAJour}.
        </p>
      </article>

      <Footer />
    </main>
  )
}

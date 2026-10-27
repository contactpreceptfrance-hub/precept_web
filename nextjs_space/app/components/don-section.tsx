import Link from 'next/link'
import { Heart } from 'lucide-react'

/**
 * Call to action for donations, between the shop and the contact form.
 * A server component: static copy and a link, nothing to hydrate.
 */
export default function DonSection() {
  return (
    <section id="don" className="py-20 px-4 bg-[#0c1f3f] text-white">
      <div className="max-w-[800px] mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Heart size={44} className="text-[#14b8a6]" />
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
          Soutenez la mission de Precept France
        </h2>
        <p className="text-slate-300 leading-relaxed mb-8">
          Vos dons nous permettent d’offrir des ateliers gratuits et de mettre l’étude biblique
          inductive à la portée de tous. Ponctuel ou mensuel, chaque geste compte.
        </p>
        <Link
          href="/don"
          className="inline-flex items-center gap-2 bg-[#14b8a6] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0d9488] shadow-lg transition-colors"
        >
          <Heart size={20} />
          Faire un don
        </Link>
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Search, BookOpen, Heart, Users, ArrowRight, Download } from 'lucide-react'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'
import ContactForm from '@/app/components/contact-form'
import { STUDY_LADDER } from '@/lib/study-guide'

export const metadata: Metadata = {
  alternates: { canonical: '/etude' },
  title: 'Trouvez une étude — Precept France',
  description:
    'La méthode inductive, nos six collections de la plus légère à la plus approfondie, et comment rejoindre ou démarrer un groupe d’étude.',
}

const GUIDE_PDF = '/pdfs/brochures_outils/Choisir-letude-ideale-7-26.pdf'

const METHOD = [
  {
    icon: Search,
    title: 'Observation',
    body: 'Qui ? Quoi ? Quand ? Où ? Pourquoi ? Comment ? On commence par regarder ce que le texte dit réellement, avant de décider ce qu’il signifie.',
  },
  {
    icon: BookOpen,
    title: 'Interprétation',
    body: 'On cherche le sens du passage dans son contexte, en laissant l’Écriture s’interpréter elle-même plutôt qu’en lui apportant nos conclusions.',
  },
  {
    icon: Heart,
    title: 'Application',
    body: 'Reste la question qui change une vie : comment mettre en pratique ce que l’on vient de comprendre ?',
  },
]

export default function EtudePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-darkblue mb-6">
          Trouvez une étude
        </h1>
        <p className="text-lg text-darkblue/70 leading-relaxed max-w-3xl mx-auto">
          Réunissons-nous en communauté autour de la Parole de Dieu pour le connaître
          profondément et vivre ensemble différemment.
        </p>
      </section>

      {/* The method */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-playfair text-3xl font-bold text-darkblue mb-4 text-center">
            La méthode <span className="text-teal">inductive</span>
          </h2>
          <p className="text-darkblue/70 text-center max-w-2xl mx-auto mb-12">
            Toutes nos études reposent sur la même démarche en trois temps. Elle ne vous
            demande pas de croire quelqu’un sur parole : elle vous apprend à lire par
            vous-même.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {METHOD.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-teal/10 text-teal mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-playfair text-xl font-bold text-darkblue mb-2">{title}</h3>
                <p className="text-sm text-darkblue/70 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free method tools download cards */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-darkblue mb-3">
              Vos outils d’étude <span className="text-teal">gratuits à télécharger</span>
            </h3>
            <p className="text-sm text-darkblue/70">
              Imprimez ces guides et signets pour équiper votre temps personnel ou votre groupe d’étude.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/pdfs/brochures_outils/MPEB-La-methode-Precepte-detude-biblique-9-23.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-gray-200 hover:border-teal/50 hover:shadow-lg transition-all bg-gray-50/50 hover:bg-white flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal bg-teal/10 px-2 py-0.5 rounded-md mb-2 inline-block">
                  Brochure (230 Ko)
                </span>
                <h4 className="font-playfair font-bold text-darkblue group-hover:text-teal transition-colors text-base mb-1">
                  La méthode Précepte
                </h4>
                <p className="text-xs text-darkblue/60 leading-relaxed">
                  Le livret officiel pas-à-pas pour observer, interpréter et appliquer.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-1.5 text-xs font-bold text-teal">
                <Download size={14} />
                <span>Télécharger PDF</span>
              </div>
            </a>

            <a
              href="/pdfs/brochures_outils/Signet-mots-cles-11-23.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-gray-200 hover:border-teal/50 hover:shadow-lg transition-all bg-gray-50/50 hover:bg-white flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal bg-teal/10 px-2 py-0.5 rounded-md mb-2 inline-block">
                  Signet (778 Ko)
                </span>
                <h4 className="font-playfair font-bold text-darkblue group-hover:text-teal transition-colors text-base mb-1">
                  Symboles & Mots-clés
                </h4>
                <p className="text-xs text-darkblue/60 leading-relaxed">
                  Les codes couleurs et marquages pour annoter votre Bible d’étude.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-1.5 text-xs font-bold text-teal">
                <Download size={14} />
                <span>Télécharger PDF</span>
              </div>
            </a>

            <a
              href="/pdfs/brochures_outils/2023-Bookmark-OIA.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-gray-200 hover:border-teal/50 hover:shadow-lg transition-all bg-gray-50/50 hover:bg-white flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal bg-teal/10 px-2 py-0.5 rounded-md mb-2 inline-block">
                  Marque-page (68 Ko)
                </span>
                <h4 className="font-playfair font-bold text-darkblue group-hover:text-teal transition-colors text-base mb-1">
                  Signet O-I-A
                </h4>
                <p className="text-xs text-darkblue/60 leading-relaxed">
                  Toutes les questions clés d’observation et d’interprétation.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-1.5 text-xs font-bold text-teal">
                <Download size={14} />
                <span>Télécharger PDF</span>
              </div>
            </a>

            <a
              href="/pdfs/brochures_outils/Choisir-letude-ideale-9-24.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-gray-200 hover:border-teal/50 hover:shadow-lg transition-all bg-gray-50/50 hover:bg-white flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal bg-teal/10 px-2 py-0.5 rounded-md mb-2 inline-block">
                  Guide (36 Ko)
                </span>
                <h4 className="font-playfair font-bold text-darkblue group-hover:text-teal transition-colors text-base mb-1">
                  Choisir l’étude idéale
                </h4>
                <p className="text-xs text-darkblue/60 leading-relaxed">
                  L’échelle comparative pour choisir selon votre rythme.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-1.5 text-xs font-bold text-teal">
                <Download size={14} />
                <span>Télécharger PDF</span>
              </div>
            </a>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/ressources"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-700 transition-colors"
            >
              <span>Voir toutes nos études gratuites et dépliants à télécharger</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Which study suits you */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-playfair text-3xl font-bold text-darkblue mb-4 text-center">
            Quelle étude vous <span className="text-teal">convient</span> ?
          </h2>
          <p className="text-darkblue/70 text-center max-w-2xl mx-auto mb-12">
            Nos collections vont de la plus légère à la plus exigeante. Rien n’oblige à
            commencer par la plus dense — beaucoup démarrent par la série 40 Minutes et
            montent ensuite.
          </p>

          <ol className="space-y-4">
            {STUDY_LADDER.map(({ key, label, blurb, engagement }, index) => (
              <li
                key={key}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-5"
              >
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-teal/10 text-teal font-bold flex items-center justify-center"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-darkblue mb-1">
                    {label}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-darkblue/40 mb-3">
                    {engagement}
                  </p>
                  <p className="text-sm text-darkblue/70 leading-relaxed">{blurb}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="text-center mt-12 flex flex-wrap gap-4 justify-center">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal text-white font-bold hover:bg-teal-600 transition-colors"
            >
              Voir les études disponibles
              <ArrowRight size={18} />
            </Link>
            {/* Download, not an embed. The previous <iframe> rendered as an empty
                grey box in iOS Safari, and its contents were invisible to search
                engines and screen readers alike. The weight is stated so nobody
                on mobile data taps it blind. */}
            <a
              href={GUIDE_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-gray-200 text-darkblue font-bold hover:border-gray-300 transition-colors"
            >
              <FileText size={18} />
              Le guide complet (PDF, 52 Ko)
            </a>
          </div>
        </div>
      </section>

      {/* Studying together */}
      <section id="groupe" className="scroll-mt-20 bg-gradient-to-br from-teal/5 to-darkblue/5 py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal rounded-full mb-6">
              <Users size={20} />
              <span className="font-medium">Étudier en groupe</span>
            </div>
            <h2 className="font-playfair text-3xl font-bold text-darkblue mb-4">
              Vous n’êtes pas censé le faire <span className="text-teal">seul</span>
            </h2>
            <p className="text-darkblue/70 leading-relaxed">
              Nos études sont conçues pour être suivies ensemble : on observe le même texte,
              on confronte ce qu’on y a vu, on s’encourage à l’appliquer. Precept réunit plus
              de 50 000 groupes d’étude dans le monde.
            </p>
            <p className="text-darkblue/70 leading-relaxed mt-4">
              Dites-nous où vous habitez et ce qui vous intéresse : nous transmettrons votre
              demande au responsable du groupe le plus proche, ou nous vous aiderons à en
              démarrer un.
            </p>
          </div>

          <ContactForm
            defaultSubject="Rejoindre un groupe d’étude"
            origine="groupe"
            submitLabel="Envoyer ma demande"
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}

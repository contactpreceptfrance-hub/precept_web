import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Download, BookOpen, Bookmark, Sparkles, ArrowRight, CheckCircle2, Compass } from 'lucide-react'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'

export const metadata: Metadata = {
  alternates: { canonical: '/ressources' },
  title: 'Ressources gratuites — Études bibliques et outils — Precept France',
  description:
    'Téléchargez gratuitement nos études bibliques éclairs, nos dépliants méthodologiques, ainsi que nos signets de symboles et mots-clés.',
}

type ResourceItem = {
  title: string
  reference?: string
  description: string
  fileUrl: string
  size: string
  badge: string
}

const ETUDES_GRATUITES: ResourceItem[] = [
  {
    title: 'Un meilleur sacrifice',
    reference: 'Hébreux 10.5-10',
    description: 'Une étude exploratoire pour comprendre la perfection et la suffisance du sacrifice de Jésus-Christ par rapport aux sacrifices de l’Ancienne Alliance.',
    fileUrl: '/pdfs/etudes_eclair_exploratoires/Un-meilleur-sacrifice-Etude-exploratoire-PR-3-25.pdf',
    size: '810 Ko',
    badge: 'Étude exploratoire',
  },
  {
    title: 'Crier à Dieu dans la détresse',
    reference: 'Psaume 102.2-6 et 19-23',
    description: 'Face à la souffrance et au découragement, comment crier au Seigneur et trouver refuge dans sa souveraineté éternelle.',
    fileUrl: '/pdfs/etudes_eclair_exploratoires/Crier-a-Dieu-Etude-exploratoire-PR-4-25.pdf',
    size: '876 Ko',
    badge: 'Étude exploratoire',
  },
  {
    title: 'Comment savoir la vérité sur Dieu ?',
    reference: 'Jean 1.1-18',
    description: 'Plongez dans le prologue de l’Évangile selon Jean pour découvrir l’identité de la Parole faite chair et la grâce révélée en Jésus-Christ.',
    fileUrl: '/pdfs/etudes_eclair_exploratoires/Verite-sur-Dieu-Jean1v1-18.pdf',
    size: '176 Ko',
    badge: 'Étude Éclair',
  },
  {
    title: 'Dieu parle !',
    reference: 'Psaume 19',
    description: 'Découvrez la double révélation de Dieu dans la nature et dans sa Loi parfaite qui restaure l’âme et réjouit le cœur.',
    fileUrl: '/pdfs/etudes_eclair_exploratoires/Psalm-19-LS.pdf',
    size: '232 Ko',
    badge: 'Étude Éclair',
  },
  {
    title: 'Enflammez votre foi',
    reference: 'Psaume 23',
    description: 'L’Éternel est mon berger, je ne manquerai de rien. Une étude inductive pour renouveler votre paix et votre confiance quotidienne.',
    fileUrl: '/pdfs/etudes_eclair_exploratoires/Enflammez-Psaume-23.pdf',
    size: '1,19 Mo',
    badge: 'Étude Éclair',
  },
  {
    title: 'La paix de Dieu',
    reference: 'Philippiens 4.4-9',
    description: 'Ne vous inquiétez de rien, mais priez avec reconnaissance. Les clés bibliques pour vivre libéré de l’anxiété.',
    fileUrl: '/pdfs/etudes_eclair_exploratoires/Philippiens-4v4-9.pdf',
    size: '384 Ko',
    badge: 'Étude Éclair',
  },
  {
    title: 'Courir pour remporter le prix',
    reference: 'La course de la foi',
    description: 'Une étude dynamique pour persévérer dans la marche chrétienne en gardant les yeux fixés sur Jésus.',
    fileUrl: '/pdfs/etudes_eclair_exploratoires/Etude-Eclair-Remporter-le-prix.pdf',
    size: '462 Ko',
    badge: 'Étude Éclair',
  },
]

const OUTILS_METHODE: ResourceItem[] = [
  {
    title: 'La méthode Précepte d’étude biblique',
    description: 'La brochure officielle de référence pour maîtriser les 3 piliers indispensables : Observer le texte, Interpréter dans son contexte, et Appliquer dans sa vie.',
    fileUrl: '/pdfs/brochures_outils/MPEB-La-methode-Precepte-detude-biblique-9-23.pdf',
    size: '230 Ko',
    badge: 'Brochure officielle',
  },
  {
    title: 'Signet de symboles et mots-clés',
    description: 'Le guide visuel des marquages, symboles et codes couleurs pour annoter avec clarté votre Bible lors de vos temps d’étude inductive.',
    fileUrl: '/pdfs/brochures_outils/Signet-mots-cles-11-23.pdf',
    size: '778 Ko',
    badge: 'Outil pratique',
  },
  {
    title: 'Signet O-I-A',
    description: 'Le marque-page mémo récapitulant les questions clés à se poser : Observation (Qui, Quoi, Quand), Interprétation et Application.',
    fileUrl: '/pdfs/brochures_outils/2023-Bookmark-OIA.pdf',
    size: '68 Ko',
    badge: 'Signet mémo',
  },
  {
    title: 'Choisir l’étude idéale',
    description: 'Le guide comparatif pour trouver la collection la mieux adaptée à votre rythme (40 Minutes, Seigneur, Précepte sur Précepte, Enfants).',
    fileUrl: '/pdfs/brochures_outils/Choisir-letude-ideale-9-24.pdf',
    size: '36 Ko',
    badge: 'Guide d’orientation',
  },
  {
    title: 'Feuille synthétique de la méthode',
    description: 'Une fiche de synthèse recto-verso à glisser dans votre Bible ou carnet de notes pour vos études en groupe.',
    fileUrl: '/pdfs/brochures_outils/Methode-Precepte-2-25.pdf',
    size: '2,12 Mo',
    badge: 'Fiche mémo',
  },
  {
    title: 'Dépliant de présentation Précepte',
    description: 'Présentation complète du ministère Precept France, de notre mission et du fonctionnement des groupes locaux.',
    fileUrl: '/pdfs/brochures_outils/Depliant-PR-2-25.pdf',
    size: '1,79 Mo',
    badge: 'Dépliant officiel',
  },
]

export default function RessourcesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-teal/10 via-darkblue/5 to-white pt-36 pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal rounded-full text-sm font-semibold mb-6">
            <Sparkles size={18} />
            <span>Ressources 100 % gratuites</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-darkblue mb-6">
            Approfondissez la Parole, <span className="text-teal">gratuitement</span>
          </h1>
          <p className="text-lg text-darkblue/75 leading-relaxed max-w-3xl mx-auto mb-10">
            Téléchargez nos études bibliques courtes au format PDF ainsi que tous les outils et signets
            de la méthode inductive pour commencer dès aujourd’hui, seul ou en groupe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-darkblue/70">
            <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <CheckCircle2 size={16} className="text-teal" /> Accès libre et immédiat
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <CheckCircle2 size={16} className="text-teal" /> Format PDF imprimable
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <CheckCircle2 size={16} className="text-teal" /> Idéal pour groupes & églises
            </span>
          </div>
        </div>
      </section>

      {/* Section 1: Études Bibliques Gratuites */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-teal font-bold text-xs uppercase tracking-widest mb-2">
                <BookOpen size={16} />
                <span>Études Éclair & Exploratoires</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-darkblue">
                Études bibliques gratuites à télécharger
              </h2>
            </div>
            <p className="text-darkblue/60 text-sm max-w-md mt-3 md:mt-0">
              Des études concises conçues pour être complétées en une ou deux séances, parfaites pour découvrir l’étude inductive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ETUDES_GRATUITES.map((item) => (
              <div
                key={item.title}
                className="flex flex-col justify-between p-6 rounded-2xl border border-gray-200/80 bg-white hover:border-teal/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-teal/10 text-teal">
                      {item.badge}
                    </span>
                    <span className="text-xs text-darkblue/40 font-mono">{item.size}</span>
                  </div>

                  <h3 className="font-playfair text-xl font-bold text-darkblue mb-1 group-hover:text-teal transition-colors">
                    {item.title}
                  </h3>
                  {item.reference && (
                    <p className="text-xs font-semibold text-teal-700 mb-3">{item.reference}</p>
                  )}
                  <p className="text-sm text-darkblue/70 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-teal/30 bg-teal/5 hover:bg-teal hover:text-white text-darkblue font-semibold text-sm transition-all"
                >
                  <Download size={16} className="text-teal group-hover:text-white transition-colors" />
                  <span>Télécharger le PDF</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Outils Méthodologiques */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-teal font-bold text-xs uppercase tracking-widest mb-2">
                <Bookmark size={16} />
                <span>Boîte à outils de l’étudiant</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-darkblue">
                Outils & Signets de la Méthode Inductive
              </h2>
            </div>
            <p className="text-darkblue/60 text-sm max-w-md mt-3 md:mt-0">
              Des aides mémoires, fiches de symboles et livrets méthodologiques indispensables pour annoter vos textes bibliques.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OUTILS_METHODE.map((item) => (
              <div
                key={item.title}
                className="flex flex-col justify-between p-6 rounded-2xl border border-gray-200 bg-white hover:border-teal/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-darkblue/5 text-darkblue">
                      {item.badge}
                    </span>
                    <span className="text-xs text-darkblue/40 font-mono">{item.size}</span>
                  </div>

                  <h3 className="font-playfair text-xl font-bold text-darkblue mb-3 group-hover:text-teal transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-darkblue/70 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-darkblue/5 hover:bg-darkblue hover:text-white text-darkblue font-semibold text-sm transition-all"
                >
                  <FileText size={16} className="text-darkblue/70 group-hover:text-white transition-colors" />
                  <span>Télécharger ({item.size})</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 bg-darkblue text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Envie d’aller plus loin dans votre étude ?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8 leading-relaxed">
            Découvrez nos 42 ouvrages d’étude inductive approfondie dans notre boutique,
            ou apprenez à démarrer un groupe d’étude dans votre région.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal text-white font-bold hover:bg-teal-600 transition-colors shadow-lg"
            >
              <span>Explorer la boutique de livres</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ateliers#methode"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors"
            >
              <Compass size={18} />
              <span>Découvrir nos ateliers & la méthode</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

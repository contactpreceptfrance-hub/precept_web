import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Video,
  BookOpen,
  FileText,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Search,
  Heart,
  Download,
} from 'lucide-react'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'
import ContactForm from '@/app/components/contact-form'
import { AtelierCard } from '@/app/components/atelier-card'
import { getPublishedAteliers } from '@/lib/ateliers'
import { STUDY_LADDER } from '@/lib/study-guide'

export const metadata: Metadata = {
  alternates: { canonical: '/ateliers' },
  title: 'Ateliers en ligne & Nos études — Precept France',
  description:
    'Rejoignez gratuitement nos ateliers hebdomadaires d’étude biblique inductive en ligne, découvrez la méthode Précepte et trouvez la collection adaptée à votre rythme.',
}

export const revalidate = 3600

const GUIDE_PDF = '/pdfs/brochures_outils/Choisir-letude-ideale-7-26.pdf'

const STEPS = [
  {
    icon: FileText,
    title: '1. Préparez ou découvrez le sujet',
    body: 'Le thème varie selon le livre étudié. Vous pouvez commander le manuel dans la boutique (facultatif) ou télécharger gratuitement l’extrait PDF lorsqu’il est disponible.',
  },
  {
    icon: Video,
    title: '2. Connectez-vous en ligne',
    body: 'Chaque semaine à l’heure indiquée, cliquez simplement sur le bouton « Rejoindre la rencontre » de l’atelier. L’accès est libre, gratuit et ouvert à tous.',
  },
  {
    icon: MessageCircle,
    title: '3. Partagez & invitez vos proches',
    body: 'Les boutons WhatsApp et « Copier l’invitation » sur chaque atelier vous permettent d’envoyer le lien de connexion et l’extrait PDF à votre groupe en un clic.',
  },
]

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

export default async function AteliersPage() {
  const ateliers = await getPublishedAteliers()
  const featured = ateliers.find((a) => a.featured) ?? null
  const others = featured ? ateliers.filter((a) => a.id !== featured.id) : ateliers

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal/10 via-darkblue/5 to-white pt-36 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal rounded-full text-sm font-semibold mb-6">
            <Video size={18} />
            <span>Rencontres virtuelles hebdomadaires & Études inductives</span>
          </div>

          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-darkblue mb-6">
            Nos <span className="text-teal">Ateliers</span> & Études bibliques
          </h1>

          <p className="text-lg text-darkblue/75 leading-relaxed max-w-3xl mx-auto mb-10">
            Réunissons-nous en communauté autour de la Parole de Dieu pour le connaître
            profondément et vivre ensemble différemment. Chaque semaine, retrouvez-nous en ligne
            pour étudier selon la méthode inductive — la participation est{' '}
            <strong>100 % gratuite</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-darkblue/75">
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <CheckCircle2 size={16} className="text-teal" /> Accès direct & gratuit
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <CheckCircle2 size={16} className="text-teal" /> Achat du livre facultatif
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <CheckCircle2 size={16} className="text-teal" /> Extraits PDF gratuits disponibles
            </span>
          </div>
        </div>
      </section>

      {/* Featured / Spotlight Atelier */}
      {featured && (
        <section className="py-8 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <AtelierCard atelier={featured} spotlight />
          </div>
        </section>
      )}

      {/* List of Weekly Ateliers */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-teal font-bold text-xs uppercase tracking-widest mb-2">
                <Sparkles size={15} />
                <span>Programme hebdomadaire</span>
              </div>
              <h2 className="font-playfair text-3xl font-bold text-darkblue">
                {featured ? 'Tous nos ateliers en ligne' : 'Rejoindre un atelier en ligne'}
              </h2>
            </div>
            <p className="text-darkblue/60 text-sm max-w-md mt-2 md:mt-0">
              Cliquez sur « Rejoindre la rencontre » à l’heure indiquée, ou partagez l’invitation
              sur WhatsApp avec vos amis.
            </p>
          </div>

          {ateliers.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-gray-50/70 p-10 text-center max-w-2xl mx-auto">
              <Video size={36} className="text-teal mx-auto mb-4" />
              <h3 className="font-playfair text-2xl font-bold text-darkblue mb-2">
                Programme des prochains ateliers en cours de mise à jour
              </h3>
              <p className="text-darkblue/70 text-sm leading-relaxed mb-6">
                Nos rencontres hebdomadaires reprennent très bientôt. Écrivez-nous via le
                formulaire en bas de page pour recevoir directement le lien de connexion !
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="#groupe"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal text-white font-bold text-sm hover:bg-teal-600 transition-colors"
                >
                  Recevoir le lien de l’atelier
                </a>
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-darkblue font-bold text-sm hover:border-gray-300 transition-colors"
                >
                  <BookOpen size={16} /> Voir les livres d’étude
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {(others.length > 0 ? others : featured ? [] : ateliers).map((atelier) => (
                <AtelierCard key={atelier.id} atelier={atelier} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to participate in an Atelier */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-playfair text-3xl font-bold text-darkblue mb-3">
              Comment participer à un <span className="text-teal">atelier</span> ?
            </h2>
            <p className="text-darkblue/70 text-sm sm:text-base">
              Que vous ayez le livre ou non, vous êtes les bienvenus pour suivre les rencontres et
              découvrir la méthode d’étude biblique inductive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
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

      {/* The Inductive Method (merged from /etude) */}
      <section id="methode" className="scroll-mt-20 bg-white py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-playfair text-3xl font-bold text-darkblue mb-4 text-center">
            La méthode <span className="text-teal">inductive</span>
          </h2>
          <p className="text-darkblue/70 text-center max-w-2xl mx-auto mb-12">
            Toutes nos études et tous nos ateliers reposent sur la même démarche en trois temps.
            Elle ne vous demande pas de croire quelqu’un sur parole : elle vous apprend à lire par
            vous-même.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {METHOD.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-gray-50/70 rounded-2xl border border-gray-200 p-6">
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

      {/* Free method tools download cards (merged from /etude) */}
      <section className="bg-gray-50 py-16 border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-darkblue mb-3">
              Vos outils d’étude <span className="text-teal">gratuits à télécharger</span>
            </h3>
            <p className="text-sm text-darkblue/70">
              Imprimez ces guides et signets pour équiper votre temps personnel ou votre atelier.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/pdfs/brochures_outils/MPEB-La-methode-Precepte-detude-biblique-9-23.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-gray-200 hover:border-teal/50 hover:shadow-lg transition-all bg-white flex flex-col justify-between group"
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
              className="p-5 rounded-2xl border border-gray-200 hover:border-teal/50 hover:shadow-lg transition-all bg-white flex flex-col justify-between group"
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
              className="p-5 rounded-2xl border border-gray-200 hover:border-teal/50 hover:shadow-lg transition-all bg-white flex flex-col justify-between group"
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
              className="p-5 rounded-2xl border border-gray-200 hover:border-teal/50 hover:shadow-lg transition-all bg-white flex flex-col justify-between group"
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

      {/* Which study suits you (merged from /etude) */}
      <section className="py-20 bg-white">
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

      {/* Studying together / Joining an Atelier or Group */}
      <section
        id="groupe"
        className="scroll-mt-20 bg-gradient-to-br from-teal/5 to-darkblue/5 py-20"
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal rounded-full mb-6">
              <Users size={20} />
              <span className="font-medium">Étudier en groupe ou en atelier</span>
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
              Vous souhaitez rejoindre un atelier en ligne, être ajouté au groupe WhatsApp, ou
              démarrer un groupe près de chez vous ? Écrivez-nous ci-dessous :
            </p>
          </div>

          <ContactForm
            defaultSubject="Rejoindre un atelier ou un groupe d’étude"
            origine="atelier"
            submitLabel="Envoyer ma demande"
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}

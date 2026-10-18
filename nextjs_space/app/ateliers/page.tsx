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
} from 'lucide-react'
import Header from '@/app/components/header'
import Footer from '@/app/components/footer'
import ContactForm from '@/app/components/contact-form'
import { AtelierCard } from '@/app/components/atelier-card'
import { getPublishedAteliers } from '@/lib/ateliers'

export const metadata: Metadata = {
  alternates: { canonical: '/ateliers' },
  title: 'Ateliers en ligne sur Zoom — Études bibliques hebdomadaires — Precept France',
  description:
    'Rejoignez gratuitement nos rencontres hebdomadaires d’étude biblique inductive sur Zoom. Téléchargez l’extrait PDF gratuit ou procurez-vous le livre pour approfondir.',
}

export const revalidate = 3600

const STEPS = [
  {
    icon: FileText,
    title: '1. Préparez ou découvrez le sujet',
    body: 'Le thème varie selon le livre étudié. Vous pouvez commander le manuel dans la boutique (facultatif) ou télécharger gratuitement l’extrait PDF lorsqu’il est disponible.',
  },
  {
    icon: Video,
    title: '2. Connectez-vous sur Zoom',
    body: 'Chaque semaine à l’heure indiquée, cliquez simplement sur le bouton « Rejoindre sur Zoom » de l’atelier. L’accès est libre, gratuit et ouvert à tous.',
  },
  {
    icon: MessageCircle,
    title: '3. Partagez & invitez vos proches',
    body: 'Un bouton de partage WhatsApp et réseaux sociaux sur chaque atelier vous permet d’envoyer le lien Zoom et l’extrait PDF à votre groupe en un clic.',
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
            <span>Rencontres virtuelles hebdomadaires sur Zoom</span>
          </div>

          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-darkblue mb-6">
            Nos <span className="text-teal">Ateliers</span> d’étude biblique
          </h1>

          <p className="text-lg text-darkblue/75 leading-relaxed max-w-3xl mx-auto mb-10">
            Chaque semaine, retrouvez-nous en direct sur Zoom pour étudier la Parole de Dieu
            ensemble selon la méthode inductive. Le thème varie selon le livre étudié — et la
            participation aux rencontres est <strong>100 % gratuite</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-darkblue/75">
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <CheckCircle2 size={16} className="text-teal" /> Accès Zoom direct & gratuit
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
                {featured ? 'Tous nos ateliers sur Zoom' : 'Rejoindre un atelier sur Zoom'}
              </h2>
            </div>
            <p className="text-darkblue/60 text-sm max-w-md mt-2 md:mt-0">
              Cliquez sur « Rejoindre sur Zoom » à l’heure de la rencontre, ou partagez l’invitation
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
                Nos rencontres hebdomadaires sur Zoom reprennent très bientôt. Écrivez-nous via le
                formulaire ci-dessous pour recevoir directement le lien Zoom sur WhatsApp ou par
                e-mail !
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="#question-atelier"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal text-white font-bold text-sm hover:bg-teal-600 transition-colors"
                >
                  Recevoir le lien Zoom
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

      {/* How it works / Reassurance section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
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

          <div className="mt-10 text-center flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/ressources"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-700 transition-colors"
            >
              <span>Découvrir aussi toutes nos études gratuites à télécharger</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact / Question about Ateliers */}
      <section
        id="question-atelier"
        className="scroll-mt-20 bg-gradient-to-br from-teal/5 to-darkblue/5 py-20"
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal rounded-full mb-6">
              <Users size={20} />
              <span className="font-medium">Une question sur nos ateliers ?</span>
            </div>
            <h2 className="font-playfair text-3xl font-bold text-darkblue mb-4">
              Besoin d’aide pour nous <span className="text-teal">rejoindre sur Zoom</span> ?
            </h2>
            <p className="text-darkblue/70 leading-relaxed">
              Vous souhaitez être ajouté au groupe WhatsApp des ateliers, connaître le prochain livre
              étudié ou poser une question à l’équipe ? Laissez-nous un message ci-dessous.
            </p>
          </div>

          <ContactForm
            defaultSubject="Ateliers hebdomadaires sur Zoom"
            origine="atelier"
            submitLabel="Envoyer ma demande"
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}

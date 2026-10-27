import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock, HelpCircle } from 'lucide-react'
import { getCheckoutOutcome } from '@/lib/checkout-session'

export const metadata: Metadata = {
  title: 'Merci — Precept France',
  robots: { index: false, follow: false },
}

// Reads Stripe on every visit: the answer depends on the session in the URL.
export const dynamic = 'force-dynamic'

const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export default async function MerciPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const outcome = await getCheckoutOutcome(searchParams.session_id)

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          {outcome.status === 'paid' && <CheckCircle size={64} className="text-teal" />}
          {outcome.status === 'pending' && <Clock size={64} className="text-gray-300" />}
          {outcome.status === 'unknown' && <HelpCircle size={64} className="text-gray-300" />}
        </div>

        {outcome.status === 'paid' && (
          <>
            <h1 className="font-playfair text-3xl font-bold text-darkblue mb-4">
              Merci pour votre don !
            </h1>
            <p className="text-darkblue/70 mb-8 leading-relaxed">
              Votre don de <strong>{euros.format(outcome.totalAmount)}</strong> a été confirmé.{' '}
              {outcome.email && (
                <>
                  Un e-mail de remerciement vous est envoyé à <strong>{outcome.email}</strong>.
                </>
              )}{' '}
              Que Dieu vous bénisse.
            </p>
          </>
        )}
        {outcome.status === 'pending' && (
          <>
            <h1 className="font-playfair text-3xl font-bold text-darkblue mb-4">
              Paiement en attente
            </h1>
            <p className="text-darkblue/70 mb-8 leading-relaxed">
              Votre don n’est pas encore confirmé. Si vous avez bien été débité, vous recevrez
              un e-mail dès qu’il sera validé.
            </p>
          </>
        )}
        {outcome.status === 'unknown' && (
          <>
            <h1 className="font-playfair text-3xl font-bold text-darkblue mb-4">
              Don introuvable
            </h1>
            <p className="text-darkblue/70 mb-8 leading-relaxed">
              Nous n’avons pas pu vérifier ce paiement. En cas de doute,{' '}
              <Link href="/#contact" className="text-teal font-semibold hover:underline">
                contactez-nous
              </Link>
              .
            </p>
          </>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-teal text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-600 shadow-lg transition-colors"
        >
          Retour à l’accueil
        </Link>
      </div>
    </main>
  )
}

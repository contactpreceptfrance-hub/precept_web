import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock, HelpCircle } from 'lucide-react'
import { getCheckoutOutcome } from '@/lib/checkout-session'
import { ClearCart } from './clear-cart'

export const metadata: Metadata = {
  title: 'Commande — Precept France',
  robots: { index: false, follow: false },
}

// Reads Stripe on every visit: the answer depends on the session in the URL.
export const dynamic = 'force-dynamic'

const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

const shopLink = (
  <Link
    href="/boutique"
    className="inline-flex items-center gap-2 bg-teal text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-600 shadow-lg transition-colors"
  >
    Continuer mes achats
  </Link>
)

export default async function SuccesPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const outcome = await getCheckoutOutcome(searchParams.session_id)

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {outcome.status === 'paid' && (
          <>
            <ClearCart />
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-teal" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-darkblue mb-4">
              Merci pour votre commande !
            </h1>
            <p className="text-darkblue/70 mb-4 leading-relaxed">
              Votre paiement de <strong>{euros.format(outcome.totalAmount)}</strong> a été
              confirmé.{' '}
              {outcome.email ? (
                <>
                  Un e-mail de confirmation vous est envoyé à <strong>{outcome.email}</strong>.
                </>
              ) : (
                'Vous recevrez un e-mail de confirmation sous peu.'
              )}
            </p>
            <p className="text-darkblue/70 mb-8 leading-relaxed">
              Que Dieu bénisse votre étude de Sa Parole.
            </p>
            {shopLink}
          </>
        )}

        {outcome.status === 'pending' && (
          <>
            <div className="flex justify-center mb-6">
              <Clock size={64} className="text-gray-300" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-darkblue mb-4">
              Paiement en attente
            </h1>
            <p className="text-darkblue/70 mb-8 leading-relaxed">
              Votre paiement n’est pas encore confirmé. Si vous avez bien été débité, vous
              recevrez un e-mail de confirmation dès qu’il sera validé. Votre panier est
              conservé.
            </p>
            {shopLink}
          </>
        )}

        {outcome.status === 'unknown' && (
          <>
            <div className="flex justify-center mb-6">
              <HelpCircle size={64} className="text-gray-300" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-darkblue mb-4">
              Commande introuvable
            </h1>
            <p className="text-darkblue/70 mb-8 leading-relaxed">
              Nous n’avons pas pu vérifier cette commande. Si vous venez de payer, vous
              recevrez un e-mail de confirmation ; en cas de doute,{' '}
              <Link href="/#contact" className="text-teal font-semibold hover:underline">
                contactez-nous
              </Link>
              .
            </p>
            {shopLink}
          </>
        )}
      </div>
    </main>
  )
}

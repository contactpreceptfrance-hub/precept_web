import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function AnnulePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <XCircle size={64} className="text-gray-300" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-darkblue mb-4">
          Paiement annulé
        </h1>
        <p className="text-darkblue/70 mb-8 leading-relaxed">
          Votre paiement a été annulé. Aucun montant n&apos;a été débité.
          Votre panier est toujours disponible.
        </p>
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 bg-teal text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-600 shadow-lg transition-colors"
        >
          Retour à la boutique
        </Link>
      </div>
    </main>
  )
}

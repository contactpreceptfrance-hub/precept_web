import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function AnnulePage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <XCircle size={64} className="text-white/30" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-white mb-4">
          Paiement annulé
        </h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          Votre paiement a été annulé. Aucun montant n&apos;a été débité.
          Votre panier est toujours disponible.
        </p>
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 bg-[#46c4c0] text-[#0c1f3f] font-bold px-6 py-3 rounded-xl hover:bg-[#38b0ac] transition-colors"
        >
          Retour à la boutique
        </Link>
      </div>
    </main>
  )
}

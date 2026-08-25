import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccesPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-teal" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-darkblue mb-4">
          Merci pour votre commande !
        </h1>
        <p className="text-darkblue/70 mb-8 leading-relaxed">
          Votre paiement a été confirmé. Vous recevrez un email de confirmation sous peu.
          Que Dieu bénisse votre étude de Sa Parole.
        </p>
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 bg-teal text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-600 shadow-lg transition-colors"
        >
          Continuer mes achats
        </Link>
      </div>
    </main>
  )
}

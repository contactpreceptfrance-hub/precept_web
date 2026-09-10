import type { Metadata } from 'next'
import { Lock } from 'lucide-react'
import { login } from '@/app/admin/actions'

export const metadata: Metadata = {
  title: 'Connexion — Administration',
  robots: { index: false, follow: false },
}

const ERRORS: Record<string, string> = {
  '1': 'Mot de passe incorrect.',
  rate: 'Trop de tentatives. Réessayez dans un quart d’heure.',
  config: 'Configuration du serveur incomplète. Contactez l’administrateur.',
}

/**
 * A server component with a plain form and no client JavaScript.
 *
 * The error comes back through the query string rather than `useFormState`,
 * which would pull in a client component and awkward typings on React 18.2 for
 * the sake of one string. This works with JavaScript disabled.
 *
 * The message never distinguishes "no such password" from anything else: there
 * is one secret, and nothing here should hint at its shape.
 */
export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { e?: string; from?: string }
}) {
  const error = searchParams.e ? (ERRORS[searchParams.e] ?? ERRORS['1']) : null

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8 text-darkblue">
          <Lock size={18} />
          <span className="font-playfair text-xl font-bold">Administration</span>
        </div>

        <form
          action={login}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4"
        >
          <input type="hidden" name="from" value={searchParams.from ?? '/admin'} />

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal text-white font-bold hover:bg-teal-600 transition-colors"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-xs text-darkblue/40 mt-6">
          Espace réservé à l’équipe Precept France.
        </p>
      </div>
    </main>
  )
}

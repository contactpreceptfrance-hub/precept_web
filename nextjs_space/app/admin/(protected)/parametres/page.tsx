import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin-guard'
import { getStripeSettingsForAdmin } from '@/lib/stripe-config'
import { StripeSettingsForm } from './stripe-settings-form'

export const metadata: Metadata = {
  title: 'Paramètres Stripe — Administration',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/+$/, '')
  }
  return 'https://www.preceptfrance.fr'
}

export default async function AdminParametresPage() {
  await requireAdmin()

  const settings = await getStripeSettingsForAdmin()
  const baseUrl = resolveBaseUrl()
  const webhookUrl = `${baseUrl}/api/webhook`

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-playfair text-2xl font-bold text-darkblue mb-1">
          Paramètres de paiement Stripe
        </h1>
        <p className="text-sm text-darkblue/60">
          Gérez vos clés d’API Stripe et basculez en toute sécurité entre le mode de test et le mode de production sans redémarrer le serveur.
        </p>
      </div>

      <StripeSettingsForm initialSettings={settings} webhookUrl={webhookUrl} />
    </div>
  )
}

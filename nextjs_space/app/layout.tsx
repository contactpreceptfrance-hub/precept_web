import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'

export const dynamic = "force-dynamic"

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  return {
    metadataBase: new URL(baseUrl),
    title: 'Precept France - Connaître Dieu profondément. Vivre autrement.',
    description: 'Vous donner les moyens de découvrir par vous-même la vérité de Dieu, mais pas seul. Études bibliques inductives.',
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
    },
    openGraph: {
      title: 'Precept France - Connaître Dieu profondément. Vivre autrement.',
      description: 'Vous donner les moyens de découvrir par vous-même la vérité de Dieu, mais pas seul.',
      images: ['/og-image.png'],
      type: 'website',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={`${playfair.variable} ${montserrat.variable} font-montserrat bg-white text-darkblue antialiased`}>
        {children}
      </body>
    </html>
  )
}

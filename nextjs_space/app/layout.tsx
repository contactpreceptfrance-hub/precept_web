import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Precept France - Connaître Dieu profondément. Vivre autrement.',
  description: 'Vous donner les moyens de découvrir par vous-même la vérité de Dieu, mais pas seul. Études bibliques inductives.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Precept France - Connaître Dieu profondément. Vivre autrement.',
    description: 'Vous donner les moyens de découvrir par vous-même la vérité de Dieu, mais pas seul.',
    url: SITE_URL,
    siteName: 'Precept France',
    locale: 'fr_FR',
    images: ['/og-image.png'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${playfair.variable} ${montserrat.variable} font-montserrat bg-white text-darkblue antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}

import Header from './components/header'
import Hero from './components/hero'
import MissionSection from './components/mission-section'
import YoutubeSection from './components/youtube-section'
import HomeShopPreview from './components/home-shop-preview'
import ContactSection from './components/contact-section'
import Footer from './components/footer'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// The shop preview reads the catalogue, so the page can no longer be frozen at
// build time — adding a book would otherwise need a redeploy to show up here.
// Hourly revalidation, matching /boutique: still served from the edge cache,
// never rendered per visit.
export const revalidate = 3600

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <MissionSection />
      <YoutubeSection />
      <HomeShopPreview />
      <ContactSection />
      <Footer />
    </main>
  )
}

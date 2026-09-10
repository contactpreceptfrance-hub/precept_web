import Header from './components/header'
import Hero from './components/hero'
import MissionSection from './components/mission-section'
import YoutubeSection from './components/youtube-section'
// import ShopSection from './components/shop-section'
import ContactSection from './components/contact-section'
import Footer from './components/footer'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <MissionSection />
      <YoutubeSection />
      {/* <ShopSection /> */}
      <ContactSection />
      <Footer />
    </main>
  )
}

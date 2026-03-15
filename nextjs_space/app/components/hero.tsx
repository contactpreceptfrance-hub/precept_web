'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown, BookOpen } from 'lucide-react'

export default function Hero() {
  const scrollToMission = () => {
    const element = document?.getElementById?.('mission')
    element?.scrollIntoView?.({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-darkblue via-darkblue-600 to-teal overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Logo */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 bg-white rounded-full p-4 shadow-2xl mx-auto flex items-center justify-center">
            <Image
              src="/images/logo-centered.png"
              alt="Precept France Logo"
              fill
              className="object-contain p-2 m-auto"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Connaître <span className="text-teal-200">Dieu</span> profondément.
            <br />
            <span className="text-teal-300">Vivre</span> autrement.
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed">
            Vous donner les moyens de découvrir par vous-même la vérité de Dieu, mais pas seul.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToMission}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-teal text-white rounded-lg font-semibold hover:bg-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <BookOpen size={20} />
              Découvrir notre mission
            </button>
            <a
              href="#videos"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Voir nos vidéos
            </a>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="cursor-pointer"
            onClick={scrollToMission}
          >
            <ChevronDown size={32} className="text-white/70" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

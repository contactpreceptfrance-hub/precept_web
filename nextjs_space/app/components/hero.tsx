'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown, BookOpen, PlayCircle } from 'lucide-react'

export default function Hero() {
  const scrollToMission = () => {
    const element = document?.getElementById?.('mission')
    element?.scrollIntoView?.({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0c1f3f]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_section_precept.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#071d45]/20" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex-grow flex items-center pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-[0_3px_14px_rgba(4,18,38,0.55)]">
              Découvrez la Bible <br />
              <span className="text-[#46c4c0]">par vous-même.</span>
            </h1>

            <p className="text-lg text-[#edf4ff]/95 max-w-xl mb-12 leading-relaxed font-light drop-shadow-[0_2px_10px_rgba(2,15,34,0.45)]">
              Une méthode inductive pour approfondir votre foi et transformer votre vie.
              Apprenez à étudier les Écritures avec clarté et conviction.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-5">
              <button
                onClick={scrollToMission}
                className="px-8 py-4 bg-gradient-to-r from-[#125f67] to-[#093a5d] hover:from-[#1a7078] hover:to-[#0d4b72] text-[#edf3fa] rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-[#021126]/55 active:scale-95 flex items-center gap-3 border border-[#8fc8c3]/14"
              >
                <BookOpen size={20} />
                Commencer mon étude
              </button>
              <a
                href="#videos"
                className="px-8 py-4 bg-[#072a4a]/44 backdrop-blur-sm text-[#d2f4f2] border border-[#73cfc9]/55 rounded-lg font-semibold hover:bg-[#0b3760]/52 hover:text-[#e8fbfa] transition-all duration-300 flex items-center gap-3 shadow-md shadow-[#021126]/30"
              >
                <PlayCircle size={20} />
                Voir la méthode
              </a>
            </div>
          </motion.div>

          {/* Right Content — hero image in a rounded frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative h-[420px] lg:h-[500px]"
          >
            <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-[#031532]/50">
              <Image
                src="/images/pic_header.png"
                alt="Étude de la Bible"
                fill
                className="object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]"
                priority
              />
              {/* Color grading and cinematic glow for a polished frame effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#10345e]/45 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1830]/55 via-transparent to-[#ffd289]/18" />
              <div className="absolute -left-10 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-[#38bdf8]/20 blur-3xl" />
              <div className="absolute left-1/2 top-[58%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff3bf]/35 blur-2xl" />
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent blur-md"
                animate={{ x: ['-20%', '360%'] }}
                transition={{ duration: 8.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.8 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Mission / Vision / But cards */}
      <div className="relative z-10 w-full pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'Notre Mission',
                text: 'Etablir chacun dans la Parole de la Bible.',
              },
              {
                title: 'Notre Vision',
                text: 'Des personnes suivant Christ avec clarté et passion, portant un regard biblique sur le monde.',
              },
              {
                title: 'Notre But',
                text: "Aider à rétablir l'autorité de la Parole de Dieu en servant fidèlement dans l'Esprit.",
              },
            ]?.map((card, i) => (
              <motion.div
                key={card?.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                className="bg-gradient-to-br from-[#1f5f8e]/80 to-[#133356]/70 backdrop-blur-md p-7 rounded-xl text-white shadow-xl hover:-translate-y-1 transition-transform border border-white/10"
              >
                <h3 className="font-playfair text-lg font-bold mb-2">{card?.title}</h3>
                <p className="text-white/80 text-sm font-light leading-relaxed">{card?.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="cursor-pointer text-white/40 hover:text-white transition-colors"
          onClick={scrollToMission}
        >
          <ChevronDown size={28} />
        </motion.div>
      </motion.div>
    </section>
  )
}

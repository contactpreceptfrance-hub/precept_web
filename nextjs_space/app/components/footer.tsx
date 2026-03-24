'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Youtube, Facebook, Instagram, Mail, Heart, ArrowRight } from 'lucide-react'

const socialLinks = [
  { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@preceptfrance', color: 'hover:text-red-600' },
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/PreceptMinistries', color: 'hover:text-blue-600' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/preceptministries/', color: 'hover:text-pink-600' },
  { name: 'Email', icon: Mail, href: 'mailto:contactpreceptfrance@gmail.com', color: 'hover:text-teal' },
]

export default function Footer() {
  return (
    <footer className="bg-[#020617] text-white pt-24 pb-12 relative overflow-hidden">
      {/* Subtle geometric pattern in footer too */}
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <svg width="100%" height="100%" className="w-full h-full">
          <pattern id="footer-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-14 h-14 bg-white rounded-2xl p-2 flex items-center justify-center shadow-2xl">
                <Image
                  src="/images/logo-centered.png"
                  alt="Precept France Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="font-playfair text-2xl font-black tracking-tight text-white">Precept France</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-lg font-light max-w-md">
              Connaître Dieu profondément. Vivre autrement. Nous vous donnons les moyens de découvrir par vous-même la vérité de Dieu à travers une méthode d'étude biblique inductive rigoureuse et accessible.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-8 text-[#14b8a6]">Navigation</h3>
            <ul className="space-y-4">
              {[
                { name: 'Notre Mission', href: '#mission' },
                { name: 'Ressources Vidéo', href: '#videos' },
                { name: 'Contactez-nous', href: '#contact' },
              ]?.map((link) => (
                <li key={link?.name ?? ''}>
                  <Link
                    href={link?.href ?? '#'}
                    className="text-slate-400 hover:text-white transition-all duration-300 font-light flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-4 h-[1px] bg-[#14b8a6] transition-all duration-300" />
                    {link?.name ?? ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-8 text-[#14b8a6]">Suivez-nous</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks?.map((social) => {
                const SocialIcon = social?.icon
                return (
                  <a
                    key={social?.name ?? ''}
                    href={social?.href ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-[#14b8a6] hover:border-[#14b8a6] hover:scale-110 group"
                    aria-label={social?.name ?? 'Social'}
                  >
                    {SocialIcon && <SocialIcon size={22} className="group-hover:text-white" />}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <p className="text-slate-500 text-sm font-light">
              © {new Date().getFullYear()} Precept France. Conçu avec excellence pour la gloire de Dieu.
            </p>
            <div className="flex items-center gap-8">
              <p className="text-slate-400 text-sm font-light flex items-center gap-2">
                Réalisé avec
                <Heart size={14} className="text-[#f87171] fill-current" aria-hidden="true" />
                par{' '}
                <a
                  href="https://engadi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#14b8a6] hover:text-white transition-colors font-medium border-b border-transparent hover:border-white"
                >
                  engadi.com
                </a>
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-slate-500 hover:text-white transition-colors"
                aria-label="Back to top"
              >
                <ArrowRight size={20} className="-rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

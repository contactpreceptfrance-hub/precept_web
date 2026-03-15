'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Youtube, Facebook, Instagram, Mail, Heart } from 'lucide-react'

const socialLinks = [
  { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@preceptfrance', color: 'hover:text-red-600' },
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/PreceptMinistries', color: 'hover:text-blue-600' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/preceptministries/', color: 'hover:text-pink-600' },
  { name: 'Email', icon: Mail, href: 'mailto:contactpreceptfrance@gmail.com', color: 'hover:text-teal' },
]

export default function Footer() {
  return (
    <footer className="bg-darkblue text-white">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="relative w-12 h-12 bg-white rounded-full p-1 flex items-center justify-center">
                <Image
                  src="/images/logo-centered.png"
                  alt="Precept France Logo"
                  fill
                  className="object-contain p-1 m-auto"
                />
              </div>
              <span className="font-playfair text-xl font-bold">Precept France</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Connaître Dieu profondément. Vivre autrement. Nous vous donnons les moyens de découvrir par vous-même la vérité de Dieu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-lg font-bold mb-6">Liens Rapides</h3>
            <ul className="space-y-3">
              {[
                { name: 'Mission', href: '#mission' },
                { name: 'Vidéos', href: '#videos' },
                { name: 'Contact', href: '#contact' },
              ]?.map((link) => (
                <li key={link?.name ?? ''}>
                  <Link
                    href={link?.href ?? '#'}
                    className="text-white/70 hover:text-teal-300 transition-colors duration-300"
                  >
                    {link?.name ?? ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-playfair text-lg font-bold mb-6">Suivez-nous</h3>
            <div className="flex gap-4">
              {socialLinks?.map((social) => {
                const SocialIcon = social?.icon
                return (
                  <a
                    key={social?.name ?? ''}
                    href={social?.href ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/20 ${social?.color ?? ''}`}
                    aria-label={social?.name ?? 'Social'}
                  >
                    {SocialIcon && <SocialIcon size={20} />}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Precept France. Tous droits réservés.
            </p>
            <p className="text-white/60 text-sm flex items-center gap-2">
              Fait avec <Heart size={16} className="text-red-500 fill-red-500" /> 🇫🇷 par{' '}
              <a
                href="https://engadi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-300 hover:text-teal-200 transition-colors"
              >
                engadi.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

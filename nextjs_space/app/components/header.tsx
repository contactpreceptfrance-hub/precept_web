'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, BookOpen, Video, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Mission', href: '#mission', icon: BookOpen },
    { name: 'Vidéos', href: '#videos', icon: Video },
    { name: 'Contact', href: '#contact', icon: Mail },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-[1200px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/images/logo-icon.webp"
                alt="Precept France Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="hidden font-playfair text-xl font-bold text-[#374151] sm:block">Precept France</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems?.map((item) => {
              const IconComponent = item?.icon
              return (
                <Link
                  key={item?.name ?? ''}
                  href={item?.href ?? '#'}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#444444] hover:bg-[#14b8a6]/10 hover:text-[#14b8a6] transition-all duration-300 font-medium"
                >
                  {IconComponent && <IconComponent size={18} />}
                  {item?.name ?? ''}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-teal/10 transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-200"
            >
              <div className="flex flex-col gap-2 pt-4">
                {navItems?.map((item) => {
                  const IconComponent = item?.icon
                  return (
                    <Link
                      key={item?.name ?? ''}
                      href={item?.href ?? '#'}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-darkblue hover:bg-teal/10 hover:text-teal transition-all duration-300"
                    >
                      {IconComponent && <IconComponent size={20} />}
                      {item?.name ?? ''}
                    </Link>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

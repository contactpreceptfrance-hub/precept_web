'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, BookOpen, Video, Mail, ShoppingBag, Compass } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from '@/app/components/shop/cart-drawer'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, openCart } = useCart()

  const navItems = [
    // Absolute paths so the anchors also work from /boutique pages.
    { name: 'Mission',    href: '/#mission', icon: BookOpen },
    { name: 'Vidéos',     href: '/#videos',  icon: Video },
    { name: 'Nos études', href: '/etude',    icon: Compass },
    { name: 'Boutique',   href: '/boutique', icon: ShoppingBag },
    { name: 'Contact',    href: '/#contact', icon: Mail },
  ]


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo.png"
                  alt="Precept France Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                  priority
                />
              </div>
              <span className="hidden font-playfair text-xl font-bold text-[#374151] sm:block">
                Precept France
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#444444] hover:bg-[#14b8a6]/10 hover:text-[#14b8a6] transition-all duration-300 font-medium"
                  >
                    <IconComponent size={18} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              {/* Cart button */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14b8a6] text-white font-semibold hover:bg-[#0d9488] transition-all duration-300"
                aria-label="Ouvrir le panier"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline text-sm">Panier</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#0c1f3f] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-teal/10 transition-colors text-darkblue"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 pb-4 border-t border-gray-200"
              >
                <div className="flex flex-col gap-2 pt-4">
                  {navItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-darkblue hover:bg-teal/10 hover:text-teal transition-all duration-300"
                      >
                        <IconComponent size={20} />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Cart drawer rendered at root level so it appears above everything */}
      <CartDrawer />
    </>
  )
}

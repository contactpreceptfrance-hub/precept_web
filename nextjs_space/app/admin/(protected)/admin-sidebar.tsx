'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Package,
  MessageSquare,
  Settings,
  Mail,
  ExternalLink,
  Globe,
  LogOut,
  Menu,
  X,
  ChevronRight,
  LucideIcon,
} from 'lucide-react'
import { logout } from '@/app/admin/actions'

interface AdminSidebarProps {
  pendingOrdersCount?: number
  unhandledMessagesCount?: number
}

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  exact?: boolean
  badge?: number
  badgeTone?: 'amber' | 'teal'
  external?: boolean
}

export function AdminSidebar({
  pendingOrdersCount = 0,
  unhandledMessagesCount = 0,
}: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const mainNavItems: NavItem[] = [
    {
      name: 'Tableau de bord',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Livres',
      href: '/admin/livres',
      icon: BookOpen,
    },
    {
      name: 'Ateliers',
      href: '/admin/ateliers',
      icon: Video,
    },
    {
      name: 'Commandes',
      href: '/admin/commandes',
      icon: Package,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeTone: 'amber',
    },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
      badge: unhandledMessagesCount > 0 ? unhandledMessagesCount : undefined,
      badgeTone: 'teal',
    },
    {
      name: 'Paramètres',
      href: '/admin/parametres',
      icon: Settings,
    },
  ]

  const externalNavItems: NavItem[] = [
    {
      name: 'Webmail',
      href: 'https://webmail.migadu.com',
      icon: Mail,
      external: true,
    },
  ]

  const isItemActive = (item: NavItem) => {
    if (item.external) return false
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(`${item.href}/`)
  }

  const renderNavLinks = () => (
    <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
      <div>
        <p className="px-3 mb-2 text-[11px] font-bold tracking-wider uppercase text-darkblue/40">
          Navigation
        </p>
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const active = isItemActive(item)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-teal text-white shadow-sm shadow-teal/20 font-semibold'
                    : 'text-darkblue/70 hover:text-darkblue hover:bg-gray-100/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      active ? 'text-white' : 'text-darkblue/50 group-hover:text-darkblue'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                      active
                        ? 'bg-white/20 text-white'
                        : item.badgeTone === 'amber'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div>
        <p className="px-3 mb-2 text-[11px] font-bold tracking-wider uppercase text-darkblue/40">
          Services
        </p>
        <nav className="space-y-1">
          {externalNavItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-darkblue/70 hover:text-darkblue hover:bg-gray-100/80 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={18}
                    className="shrink-0 text-darkblue/50 group-hover:text-darkblue transition-colors"
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <ExternalLink
                  size={13}
                  className="text-darkblue/40 group-hover:text-darkblue/70 transition-colors"
                />
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )

  const renderFooter = () => (
    <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
      {/* Return to public site */}
      <Link
        href="/"
        className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-darkblue/70 hover:text-darkblue hover:bg-gray-100 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <Globe size={15} className="text-darkblue/50 group-hover:text-teal transition-colors" />
          <span>Retour au site public</span>
        </div>
        <ChevronRight size={13} className="text-darkblue/30 group-hover:text-darkblue/60" />
      </Link>

      {/* Admin status pill */}
      <div className="px-3.5 py-2 rounded-xl bg-white border border-gray-200/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-darkblue/80">Connecté</span>
        </div>
        <span className="text-[11px] text-darkblue/50">Admin</span>
      </div>

      {/* Logout button */}
      <form action={logout}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-darkblue/80 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
        >
          <LogOut size={14} />
          Se déconnecter
        </button>
      </form>
    </div>
  )

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="p-2 -ml-2 rounded-xl text-darkblue/70 hover:text-darkblue hover:bg-gray-100 transition-colors"
          >
            <Menu size={22} />
          </button>

          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white border border-gray-100 shadow-xs flex items-center justify-center p-0.5">
              <Image
                src="/images/logo.png"
                alt="Precept France"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-playfair font-bold text-base text-darkblue leading-none block">
                Precept France
              </span>
              <span className="text-[10px] font-bold text-teal tracking-wider uppercase block">
                Admin
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="Retour au site"
            className="p-2 rounded-xl text-darkblue/60 hover:text-darkblue hover:bg-gray-100 transition-colors"
          >
            <Globe size={18} />
          </Link>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="p-2 rounded-xl text-darkblue/60 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-darkblue/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col lg:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-xs flex items-center justify-center p-1">
              <Image
                src="/images/logo.png"
                alt="Precept France"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-playfair text-base font-bold text-darkblue block leading-tight">
                Precept France
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal">
                Administration
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
            className="p-1.5 rounded-lg text-darkblue/50 hover:text-darkblue hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {renderNavLinks()}
        {renderFooter()}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 xl:w-72 bg-white border-r border-gray-200/80 sticky top-0 h-screen shrink-0 z-20 select-none">
        {/* Brand header */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3.5">
          <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center p-1">
            <Image
              src="/images/logo.png"
              alt="Precept France"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <Link href="/admin" className="block group">
              <span className="font-playfair text-base font-bold text-darkblue block leading-tight truncate group-hover:text-teal transition-colors">
                Precept France
              </span>
              <span className="inline-flex items-center gap-1.5 mt-0.5 text-[10px] font-bold tracking-wider uppercase text-teal">
                <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                Administration
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation list */}
        {renderNavLinks()}

        {/* Footer actions */}
        {renderFooter()}
      </aside>
    </>
  )
}

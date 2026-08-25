'use client'

import { useEffect, useRef, useState } from 'react'
import { Facebook, Mail, Users, X } from 'lucide-react'

type SharePopoverProps = {
  bookId: string
  bookTitle: string
  bookDescription: string
  onClose: () => void
}

export function SharePopover({ bookId, bookTitle, bookDescription, onClose }: SharePopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const bookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/boutique/${bookId}`
    : `/boutique/${bookId}`

  const inviteMessage = `Je participe à un groupe d'étude biblique Precept et je t'invite à nous rejoindre ! Découvre les ressources sur ${bookUrl} 📖`

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handleGroupInvite() {
    if (navigator.share) {
      try {
        await navigator.share({ text: inviteMessage, url: bookUrl })
      } catch {
        copyToClipboard(inviteMessage)
      }
    } else {
      copyToClipboard(inviteMessage)
    }
  }

  const platforms = [
    {
      name: 'Facebook',
      icon: <Facebook size={14} />,
      bg: 'bg-[#1877f2]',
      action: () => window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(bookUrl)}`,
        '_blank', 'width=600,height=400'
      ),
    },
    {
      name: 'WhatsApp',
      icon: <span className="text-xs font-bold">WA</span>,
      bg: 'bg-[#25d366]',
      action: () => window.open(
        `https://wa.me/?text=${encodeURIComponent(`${bookTitle} — ${bookUrl}`)}`,
        '_blank'
      ),
    },
    {
      name: copied ? 'Lien copié ✓' : 'Instagram',
      icon: <span className="text-xs font-bold">IG</span>,
      bg: 'bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]',
      action: () => copyToClipboard(bookUrl),
    },
    {
      name: 'Email',
      icon: <Mail size={14} />,
      bg: 'bg-[#4b5563]',
      action: () => {
        const subject = encodeURIComponent(`Livre Precept : ${bookTitle}`)
        const body = encodeURIComponent(`${bookDescription}\n\nDécouvrez ce livre : ${bookUrl}`)
        window.open(`mailto:?subject=${subject}&body=${body}`)
      },
    },
  ]

  return (
    <div
      ref={ref}
      className="absolute bottom-14 right-0 z-50 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-darkblue/40 text-xs uppercase tracking-widest">Partager</span>
        <button onClick={onClose} className="text-gray-400 hover:text-darkblue">
          <X size={14} />
        </button>
      </div>

      {platforms.map((p) => (
        <button
          key={p.name}
          onClick={p.action}
          className="flex items-center gap-2.5 w-full px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <span className={`w-7 h-7 rounded-lg ${p.bg} flex items-center justify-center text-white flex-shrink-0`}>
            {p.icon}
          </span>
          <span className="text-darkblue text-sm font-medium">{p.name}</span>
        </button>
      ))}

      <div className="my-2 border-t border-gray-100" />

      <button
        onClick={handleGroupInvite}
        className="flex items-center gap-2.5 w-full px-2 py-2 rounded-xl hover:bg-teal/10 transition-colors text-left"
      >
        <span className="w-7 h-7 rounded-lg bg-teal/10 border border-teal/30 flex items-center justify-center text-teal flex-shrink-0">
          <Users size={14} />
        </span>
        <span className="text-teal text-sm font-medium">Inviter mon groupe</span>
      </button>
    </div>
  )
}

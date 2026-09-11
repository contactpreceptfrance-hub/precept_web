'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Send, Mail, User, MessageSquare, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

type ContactFormProps = {
  /** Pre-fills the subject, for a form that already knows what it is about. */
  defaultSubject?: string
  /** Recorded as ContactSubmission.source so the admin can filter on it. */
  origine?: 'contact' | 'groupe'
  submitLabel?: string
}

/**
 * The contact form, extracted from contact-section so /etude can render it for
 * study-group requests without duplicating the markup or inventing a second
 * endpoint.
 *
 * The section around it keeps the heading, the badge and the animation; this
 * component is only the form.
 */
export default function ContactForm({
  defaultSubject = '',
  origine = 'contact',
  submitLabel = 'Envoyer le message',
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: defaultSubject,
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // When the form appeared on screen. Sent so the server can reject a
  // submission that arrived faster than anyone could type. Advisory only — it
  // is forgeable, and only costs an unsophisticated bot.
  const mountedAt = useRef(Date.now())

  // Honeypot value. Stays empty for every human; anything in it is a bot.
  const [website, setWebsite] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          origine,
          website,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })

      if (response?.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: defaultSubject, message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e?.target ?? {}
    setFormData((prev) => ({ ...(prev ?? {}), [name ?? '']: value ?? '' }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
      {/* Honeypot. A real input rather than type="hidden": naive bots skip
          hidden fields and fill the ones they can see in the DOM. Kept off the
          tab order and out of the accessibility tree so no human meets it. */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Name */}
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          name="name"
          value={formData?.name ?? ''}
          onChange={handleChange}
          placeholder="Votre nom"
          required
          className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all duration-300"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="email"
          name="email"
          value={formData?.email ?? ''}
          onChange={handleChange}
          placeholder="Votre email"
          required
          className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all duration-300"
        />
      </div>

      {/* Subject */}
      <div className="relative">
        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          name="subject"
          value={formData?.subject ?? ''}
          onChange={handleChange}
          placeholder="Sujet"
          required
          className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all duration-300"
        />
      </div>

      {/* Message */}
      <div className="relative">
        <MessageSquare className="absolute left-4 top-4 text-gray-400" size={20} />
        <textarea
          name="message"
          value={formData?.message ?? ''}
          onChange={handleChange}
          placeholder="Votre message"
          required
          rows={5}
          className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all duration-300 resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-teal text-white rounded-lg font-semibold hover:bg-teal-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send size={20} />
            {submitLabel}
          </>
        )}
      </button>

      {/* Status Messages */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg"
        >
          <CheckCircle size={20} />
          <span>Message envoyé avec succès ! Nous vous répondrons bientôt.</span>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg"
        >
          <AlertCircle size={20} />
          <span>Erreur lors de l&apos;envoi. Veuillez réessayer.</span>
        </motion.div>
      )}

      {/* Mention d'information RGPD : finalité, durée, droits. */}
      <p className="text-center text-xs text-darkblue/50 leading-relaxed">
        Votre nom et votre adresse électronique servent uniquement à vous répondre et
        sont conservés trois ans. Vous pouvez y accéder, les corriger ou les faire
        supprimer à tout moment — voir notre{' '}
        <Link
          href="/confidentialite"
          className="text-teal underline hover:text-teal-600"
        >
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  )
}

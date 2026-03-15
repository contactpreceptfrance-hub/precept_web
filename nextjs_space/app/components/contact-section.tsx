'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Send, Mail, User, MessageSquare, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response?.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
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
    <section id="contact" className="py-20 bg-gradient-to-br from-teal/5 to-darkblue/5">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal rounded-full mb-6">
            <Mail size={20} />
            <span className="font-medium">Contactez-nous</span>
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-darkblue mb-4">
            Une question ? <span className="text-teal">Écrivez-nous</span>
          </h2>
          <p className="text-darkblue/70 max-w-2xl mx-auto">
            Nous sommes à votre écoute pour répondre à toutes vos questions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
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
                  Envoyer le message
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
                <span>Erreur lors de l'envoi. Veuillez réessayer.</span>
              </motion.div>
            )}

            <p className="text-center text-sm text-darkblue/50">
              Vos données sont traitées de manière confidentielle.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

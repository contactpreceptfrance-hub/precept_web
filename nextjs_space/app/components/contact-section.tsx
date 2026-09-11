'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail } from 'lucide-react'
import ContactForm from '@/app/components/contact-form'

/**
 * The contact block on the home page: heading, badge, animation.
 *
 * The form itself moved to contact-form.tsx so /etude can render it for
 * study-group requests. This section must stay visually identical to what it
 * was before that split.
 */
export default function ContactSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="contact" className="scroll-mt-20 py-20 bg-gradient-to-br from-teal/5 to-darkblue/5">
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
          <ContactForm />
        </motion.div>
      </div>
    </section>
  )
}

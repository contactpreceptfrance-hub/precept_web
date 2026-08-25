'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Eye, Target, Heart, BookOpen, Users, Globe } from 'lucide-react'

const sections = [
  {
    id: 'vision',
    title: 'Notre Vision',
    icon: Eye,
    content: 'Que chaque croyant en Christ vive la Parole de Dieu au quotidien.',
    bgColor: 'bg-white',
  },
  {
    id: 'mission',
    title: 'Notre Mission',
    icon: Target,
    content: 'Amener les gens à une relation étroite avec Dieu par le biais d\'études bibliques approfondies.',
    bgColor: 'bg-teal/5',
  },
  {
    id: 'but',
    title: 'Notre But',
    icon: Heart,
    content: 'Fournir les outils nécessaires pour étudier les Écritures de manière autonome et nouer une relation personnelle avec Dieu.',
    bgColor: 'bg-white',
  },
]

const methodSteps = [
  {
    title: 'Observation',
    icon: BookOpen,
    description: 'Posez-vous les questions « Qui ? Quoi ? Quand ? Où ? Pourquoi ? Comment ? » pour comprendre le sens réel du texte.',
  },
  {
    title: 'Interprétation',
    icon: Users,
    description: 'Découvrez le sens du passage en examinant le contexte et en laissant l\'Écriture s\'interpréter elle-même.',
  },
  {
    title: 'Application',
    icon: Globe,
    description: 'Répondre à la vérité en se demandant : « Comment puis-je appliquer ce que j\'ai appris à ma vie ? »',
  },
]

export default function MissionSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="mission" className="py-20">
      {/* Mission/Vision/But */}
      {sections?.map((section, index) => {
        const IconComponent = section?.icon
        return (
          <div key={section?.id ?? index} className={section?.bgColor ?? 'bg-white'}>
            <div className="max-w-[1200px] mx-auto px-4 py-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center">
                  {IconComponent && <IconComponent size={40} className="text-teal" />}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="font-playfair text-3xl md:text-4xl font-bold text-darkblue mb-4">
                    {section?.title ?? ''}
                  </h2>
                  <p className="text-lg text-darkblue/80 max-w-2xl leading-relaxed">
                    {section?.content ?? ''}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )
      })}

      {/* Inductive Method */}
      <div ref={ref} className="bg-gradient-to-br from-darkblue to-darkblue-600 py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
              La Méthode d\'Étude Biblique <span className="text-teal-300">Inductive</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Un cadre pédagogique conçu pour vous aider à manier la parole de vérité avec exactitude.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {methodSteps?.map((step, index) => {
              const StepIcon = step?.icon
              return (
                <motion.div
                  key={step?.title ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white/10 backdrop-blur rounded-xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-full bg-teal/30 flex items-center justify-center mb-6">
                    {StepIcon && <StepIcon size={28} className="text-teal-200" />}
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-white mb-4">
                    {index + 1}. {step?.title ?? ''}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {step?.description ?? ''}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

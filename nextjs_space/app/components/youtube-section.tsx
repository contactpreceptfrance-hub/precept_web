'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Youtube, Play } from 'lucide-react'

const videos = [
  {
    id: '8LjOwLriMSg',
    title: 'Introduction à l\'Étude Biblique Inductive',
    description: 'Découvrez les fondements de notre méthode d\'étude.',
  },
  {
    id: 'kirQW-wiIrg',
    title: 'Témoignages de Transformation',
    description: 'Des vies changées par la Parole de Dieu.',
  },
  {
    id: 'w_gP0X85_aQ',
    title: 'Comment Rejoindre un Groupe d\'Étude',
    description: 'Participez à notre communauté d\'apprentissage.',
  },
]

export default function YoutubeSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="videos" className="py-20 bg-gray-50">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full mb-6">
            <Youtube size={20} />
            <span className="font-medium">Nos Vidéos</span>
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-darkblue mb-4">
            Découvrez nos <span className="text-teal">Ressources Vidéo</span>
          </h2>
          <p className="text-darkblue/70 max-w-2xl mx-auto">
            Apprenez et grandissez spirituellement grâce à notre contenu vidéo enrichissant.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {videos?.map((video, index) => (
            <motion.div
              key={video?.id ?? index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-video bg-gray-200">
                <iframe
                  src={`https://www.youtube.com/embed/${video?.id ?? ''}`}
                  title={video?.title ?? 'Vidéo YouTube'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-xl font-bold text-darkblue mb-2">
                  {video?.title ?? ''}
                </h3>
                <p className="text-darkblue/70 text-sm">
                  {video?.description ?? ''}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="https://www.youtube.com/@preceptfrance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Play size={20} />
            Voir toutes nos vidéos
          </a>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ShoppingBag, BookOpen, GraduationCap, ArrowRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  type: 'LIVRE' | 'FORMATION'
}

export default function ShopSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'LIVRE' | 'FORMATION'>('all')
  const [loading, setLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data ?? [])
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = activeFilter === 'all'
    ? products
    : (products ?? [])?.filter?.((p) => p?.type === activeFilter) ?? []

  return (
    <section id="boutique" className="py-20 bg-white">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal rounded-full mb-6">
            <ShoppingBag size={20} />
            <span className="font-medium">Notre Boutique</span>
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-darkblue mb-4">
            Livres et <span className="text-teal">Formations</span>
          </h2>
          <p className="text-darkblue/70 max-w-2xl mx-auto">
            Des ressources pour approfondir votre connaissance de la Parole de Dieu.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-4 mb-12"
        >
          {[
            { key: 'all', label: 'Tout', icon: ShoppingBag },
            { key: 'LIVRE', label: 'Livres', icon: BookOpen },
            { key: 'FORMATION', label: 'Formations', icon: GraduationCap },
          ]?.map((filter) => {
            const FilterIcon = filter?.icon
            return (
              <button
                key={filter?.key ?? ''}
                onClick={() => setActiveFilter(filter?.key as 'all' | 'LIVRE' | 'FORMATION')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === filter?.key
                    ? 'bg-teal text-white shadow-lg'
                    : 'bg-gray-100 text-darkblue hover:bg-gray-200'
                }`}
              >
                {FilterIcon && <FilterIcon size={18} />}
                {filter?.label ?? ''}
              </button>
            )
          })}
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal border-t-transparent" />
          </div>
        ) : (filteredProducts?.length ?? 0) === 0 ? (
          <div className="text-center py-12 text-darkblue/60">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts?.map((product, index) => (
              <motion.div
                key={product?.id ?? index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={product?.imageUrl ?? '/images/logo.png'}
                    alt={product?.name ?? 'Produit'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product?.type === 'LIVRE'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {product?.type === 'LIVRE' ? 'Livre' : 'Formation'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-bold text-darkblue mb-2 line-clamp-2">
                    {product?.name ?? ''}
                  </h3>
                  <p className="text-darkblue/70 text-sm mb-4 line-clamp-2">
                    {product?.description ?? ''}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-teal">
                      {(product?.price ?? 0)?.toFixed?.(2) ?? '0.00'} €
                    </span>
                    <button
                      onClick={() => alert('Paiement bientôt disponible!')}
                      className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg font-medium hover:bg-teal-600 transition-all duration-300"
                    >
                      Voir <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

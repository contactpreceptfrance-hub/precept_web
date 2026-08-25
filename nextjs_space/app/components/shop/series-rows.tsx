'use client'

import { useState, useMemo } from 'react'
import { BookCard } from '@/app/components/shop/book-card'
import { SeriesGroup } from '@/lib/types'

type SeriesRowsProps = {
  groups: SeriesGroup[]
}

export function SeriesRows({ groups }: SeriesRowsProps) {
  const [query, setQuery] = useState('')

  // Filter groups/cards by search query
  const filtered = useMemo(() => {
    if (!query.trim()) return groups
    const q = query.toLowerCase()
    return groups
      .map(g => ({
        ...g,
        products: g.products.filter(
          p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        ),
      }))
      .filter(g => g.products.length > 0)
  }, [groups, query])

  return (
    <div className="bg-white">
      {/* Search bar */}
      <div className="max-w-md px-6 sm:px-10 pt-10 pb-2">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20 transition-all">
          <span className="text-gray-400 text-base">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un livre, une série…"
            className="bg-transparent outline-none text-darkblue placeholder-gray-400 text-sm w-full"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-darkblue text-sm">✕</button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-darkblue/50 text-center py-20">Aucun résultat pour « {query} »</p>
      )}

      {filtered.map((group, index) => (
        <section
          key={group.series}
          className={`px-6 sm:px-10 py-10 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="font-playfair text-darkblue text-2xl font-bold">{group.label}</h2>
            <span className="text-darkblue/50 text-sm">{group.products.length} {group.products.length > 1 ? 'titres' : 'titre'}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
          </div>

          <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-teal/40">
            {group.products.map(product => (
              <BookCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                type={product.type}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

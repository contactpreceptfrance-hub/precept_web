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
    <div className="py-10 px-6 sm:px-10 bg-[#0a0e1a]">
      {/* Search bar */}
      <div className="max-w-md mb-10">
        <div className="flex items-center gap-3 bg-[#0d1a30] border border-white/12 rounded-xl px-4 py-3">
          <span className="text-white/40 text-base">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un livre, une série…"
            className="bg-transparent outline-none text-white placeholder-white/30 text-sm w-full"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/30 hover:text-white/70 text-sm">✕</button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-white/40 text-center py-20">Aucun résultat pour « {query} »</p>
      )}

      {filtered.map(group => (
        <div key={group.series} className="mb-14">
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="text-white text-xl font-bold">{group.label}</h2>
            <span className="text-white/35 text-sm">{group.products.length} {group.products.length > 1 ? 'titres' : 'titre'}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#46c4c0]/30">
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
        </div>
      ))}
    </div>
  )
}

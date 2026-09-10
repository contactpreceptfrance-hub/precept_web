'use client'

import { useState } from 'react'
import Image from 'next/image'
import { backCoverLabel } from '@/lib/types'

type CoverViewerProps = {
  name: string
  imageUrl: string
  backImageUrl: string | null
  type: 'LIVRE' | 'FORMATION'
  series: string | null
}

export function CoverViewer({ name, imageUrl, backImageUrl, type, series }: CoverViewerProps) {
  const [showBack, setShowBack] = useState(false)

  const backLabel = backCoverLabel(series)
  const current = showBack && backImageUrl ? backImageUrl : imageUrl
  const alt = showBack ? `${name} — ${backLabel.toLowerCase()}` : name

  return (
    <div>
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
        {current ? (
          <Image
            src={current}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            // The recto sits above the fold and is the largest thing on the
            // page — it is what LCP measures here. Only the initially shown
            // face gets the preload: the back cover is only ever reached by
            // clicking, so preloading it would compete for the same bandwidth.
            priority={!showBack}
          />
        ) : (
          <div className="w-full h-full flex items-end p-6 bg-gradient-to-br from-[#0d3560] to-[#125f67]">
            <span className="text-white font-bold text-lg">{name}</span>
          </div>
        )}

        {/* The badge describes the product, so it stays put on the recto only */}
        {!showBack && (
          <span
            className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wide ${
              type === 'LIVRE' ? 'bg-teal text-white' : 'bg-purple-500 text-white'
            }`}
          >
            {type === 'LIVRE' ? 'Livre' : 'Formation'}
          </span>
        )}
      </div>

      {backImageUrl && (
        <div
          role="tablist"
          aria-label="Faces de la couverture"
          className="flex gap-2 mt-3"
        >
          {[
            { label: 'Recto', active: !showBack, go: () => setShowBack(false) },
            { label: backLabel, active: showBack, go: () => setShowBack(true) },
          ].map(tab => (
            <button
              key={tab.label}
              role="tab"
              aria-selected={tab.active}
              onClick={tab.go}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                tab.active
                  ? 'bg-teal text-white'
                  : 'border border-gray-200 bg-white text-darkblue/60 hover:text-darkblue hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

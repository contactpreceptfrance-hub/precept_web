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
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#1a3a6a] border border-white/10">
        {current ? (
          <Image
            src={current}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
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
              type === 'LIVRE' ? 'bg-[#46c4c0]/85 text-[#0c1f3f]' : 'bg-purple-500/85 text-white'
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
                  ? 'bg-[#46c4c0] text-[#0c1f3f]'
                  : 'border border-white/15 bg-white/5 text-white/60 hover:text-white hover:border-white/30'
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

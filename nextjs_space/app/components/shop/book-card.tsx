'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Share2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { SharePopover } from '@/app/components/shop/share-popover'

type BookCardProps = {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  type: 'LIVRE' | 'FORMATION'
}

export function BookCard({ id, name, description, price, imageUrl, type }: BookCardProps) {
  const { addItem, openCart } = useCart()
  const [showShare, setShowShare] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)

  function handleAddToCart() {
    addItem({ productId: id, name, price, imageUrl, quantity: 1 })
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 1500)
    openCart()
  }

  return (
    <div className="relative flex-shrink-0 w-44 group">
      {/* Cover */}
      <Link href={`/boutique/${id}`} className="block">
        {/* Covers are not a uniform shape — they range from 0.64 to 0.82 (w/h).
            The box is 2/3, which most of them sit close to, and object-contain
            letterboxes the rest rather than cropping the artwork. */}
        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gray-100 mb-3 border border-gray-200 shadow-sm group-hover:border-teal/50 group-hover:shadow-lg transition-all">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              sizes="176px"
            />
          ) : (
            <div className="w-full h-full flex items-end p-3 bg-gradient-to-br from-[#0d3560] to-[#125f67]">
              <span className="text-white/80 text-xs font-semibold leading-snug">{name}</span>
            </div>
          )}
          <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
            type === 'LIVRE'
              ? 'bg-teal text-white'
              : 'bg-purple-500 text-white'
          }`}>
            {type === 'LIVRE' ? 'Livre' : 'Formation'}
          </span>
        </div>
      </Link>

      {/* Info */}
      <p className="text-darkblue text-sm font-semibold truncate mb-1">{name}</p>
      <p className="text-teal text-sm font-bold mb-3">{price.toFixed(2)} €</p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
            addedFeedback
              ? 'bg-green-500 text-white'
              : 'bg-teal text-white hover:bg-teal-600'
          }`}
        >
          <ShoppingBag size={13} />
          {addedFeedback ? 'Ajouté ✓' : '+ Panier'}
        </button>
        <button
          onClick={() => setShowShare(!showShare)}
          className="w-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-darkblue hover:border-gray-300 transition-colors"
          aria-label="Partager"
        >
          <Share2 size={15} />
        </button>
      </div>

      {/* Share popover */}
      {showShare && (
        <SharePopover
          bookId={id}
          bookTitle={name}
          bookDescription={description}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}

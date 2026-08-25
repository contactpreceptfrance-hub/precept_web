'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

type Props = {
  productId: string
  name: string
  price: number
  imageUrl: string
}

export function AddToCartButton({ productId, name, price, imageUrl }: Props) {
  const { addItem, openCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem({ productId, name, price, imageUrl, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
        added
          ? 'bg-green-500 text-white'
          : 'bg-teal text-white hover:bg-teal-600 shadow-lg hover:shadow-xl'
      }`}
    >
      <ShoppingBag size={20} />
      {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
    </button>
  )
}

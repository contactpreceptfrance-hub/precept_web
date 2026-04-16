'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, Trash2, ShoppingBag, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  async function handleCheckout() {
    if (items.length === 0) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur lors de la création de la session de paiement.')
      }
    } catch {
      alert('Erreur réseau. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#111c30] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <ShoppingBag size={20} className="text-[#46c4c0]" />
                Mon Panier
              </div>
              <button onClick={closeCart} className="text-white/40 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-white/40">
                  <ShoppingBag size={48} />
                  <p className="text-sm">Votre panier est vide</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3 bg-white/5 rounded-xl p-3">
                      <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a3a6a]">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-[#46c4c0] text-sm font-bold mt-1">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.productId, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-white text-sm w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.productId, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-white/30 hover:text-red-400 transition-colors self-start mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10">
                <div className="flex justify-between text-white font-bold text-lg mb-4">
                  <span>Total</span>
                  <span className="text-[#46c4c0]">{totalPrice.toFixed(2)} €</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#46c4c0] to-[#14b8a6] text-[#0c1f3f] font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-[#0c1f3f] border-t-transparent" />
                  ) : (
                    <>Payer avec Stripe →</>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-white/30 text-xs">
                  <Lock size={11} />
                  Paiement sécurisé par Stripe
                </div>
                <button
                  onClick={clearCart}
                  className="w-full mt-2 text-white/30 text-xs hover:text-white/60 transition-colors py-2"
                >
                  Vider le panier
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

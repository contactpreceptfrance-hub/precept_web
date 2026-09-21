'use client'

import { useEffect } from 'react'
import { STORAGE_KEY, useCart } from '@/lib/cart-context'

/**
 * Empties the basket once a payment is confirmed. Renders nothing.
 *
 * The saved copy is removed first, then the in-memory one cleared. The order
 * matters: the provider restores the saved basket in an effect of its own, and
 * a child's effects run before its parent's, so clearing only the state would
 * be undone a moment later by that restore.
 */
export function ClearCart() {
  const { clearCart } = useCart()

  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Storage blocked: the in-memory clear below still applies.
    }
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItem } from '@/lib/types'

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; payload: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload }
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productId === action.payload.productId)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.productId !== action.payload.productId) }
    case 'UPDATE_QTY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.productId !== action.payload.productId) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN':
      return { ...state, isOpen: true }
    case 'CLOSE':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'precept-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Persist to localStorage on every items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      totalPrice,
      addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
      removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', payload: { productId } }),
      updateQty: (productId, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { productId, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      openCart: () => dispatch({ type: 'OPEN' }),
      closeCart: () => dispatch({ type: 'CLOSE' }),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

'use client'
import { useState, useCallback } from 'react'
import type { ProductPublic, CartItem } from '@/lib/api'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = useCallback((product: ProductPublic) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
    setIsOpen(true)
  }, [])

  const updateQty = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) setCart(prev => prev.filter(i => i.product.id !== productId))
    else setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i))
  }, [])

  const removeItem = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return { cart, isOpen, setIsOpen, addToCart, updateQty, removeItem, clearCart, totalItems, totalPrice }
}

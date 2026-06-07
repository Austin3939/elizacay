import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  isConfigured,
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  getCart,
} from '../lib/shopify'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart]     = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  /* Restore cart from previous session */
  useEffect(() => {
    if (!isConfigured) return
    const savedId = localStorage.getItem('ec-cart-id')
    if (!savedId) return
    getCart(savedId)
      .then(c => { if (c) setCart(c) })
      .catch(() => localStorage.removeItem('ec-cart-id'))
  }, [])

  const save = (c) => {
    setCart(c)
    if (c?.id) localStorage.setItem('ec-cart-id', c.id)
  }

  const addToCart = useCallback(async (variantId, quantity = 1) => {
    if (!isConfigured) return
    setLoading(true)
    setError(null)
    try {
      let updated
      if (!cart?.id) {
        updated = await cartCreate(variantId, quantity)
      } else {
        /* If this variant is already in the cart, increment quantity */
        const existing = cart.lines.edges.find(
          e => e.node.merchandise.id === variantId
        )
        if (existing) {
          updated = await cartLinesUpdate(
            cart.id,
            existing.node.id,
            existing.node.quantity + quantity
          )
        } else {
          updated = await cartLinesAdd(cart.id, variantId, quantity)
        }
      }
      save(updated)
      setIsOpen(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [cart])

  const removeFromCart = useCallback(async (lineId) => {
    if (!cart?.id) return
    setLoading(true)
    try {
      save(await cartLinesRemove(cart.id, [lineId]))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [cart])

  const updateQuantity = useCallback(async (lineId, quantity) => {
    if (!cart?.id) return
    if (quantity <= 0) return removeFromCart(lineId)
    setLoading(true)
    try {
      save(await cartLinesUpdate(cart.id, lineId, quantity))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [cart, removeFromCart])

  const lines        = cart?.lines?.edges?.map(e => e.node) ?? []
  const totalQty     = cart?.totalQuantity ?? 0
  const totalAmount  = cart?.cost?.totalAmount?.amount ?? '0'
  const currency     = cart?.cost?.totalAmount?.currencyCode ?? 'USD'
  const checkoutUrl  = cart?.checkoutUrl ?? '#'

  return (
    <CartContext.Provider value={{
      lines, totalQty, totalAmount, currency, checkoutUrl,
      loading, error,
      isOpen,
      openCart:  () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart, removeFromCart, updateQuantity,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside <CartProvider>')
  return ctx
}

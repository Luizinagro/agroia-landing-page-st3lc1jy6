import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  image_url: string | null
  stock: number
}

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('agroia_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sync cart from Supabase when user logs in
  useEffect(() => {
    if (!user) return

    const fetchCart = async () => {
      try {
        const { data, error } = await supabase
          .from('carrinho')
          .select('id, quantidade, produto_id, products(*)')
          .eq('user_id', user.id)

        if (error) throw error

        if (data && data.length > 0) {
          const formattedItems = data
            .map((row: any) => {
              if (!row.products) return null
              return {
                ...row.products,
                quantity: row.quantidade,
              }
            })
            .filter(Boolean)

          setItems(formattedItems as CartItem[])
        } else {
          // If Supabase is empty, user might have local items to upload, but we'll stick to a simple strategy:
          // Local storage is a backup.
        }
      } catch (err) {
        console.error('Error fetching cart:', err)
      }
    }

    fetchCart()
  }, [user])

  useEffect(() => {
    localStorage.setItem('agroia_cart', JSON.stringify(items))
  }, [items])

  const addItem = async (product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return current
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      if (product.stock < 1) return current
      return [...current, { ...product, quantity: 1 }]
    })

    if (user) {
      try {
        const { data: existingRow } = await supabase
          .from('carrinho')
          .select('id, quantidade')
          .eq('user_id', user.id)
          .eq('produto_id', product.id)
          .maybeSingle()

        if (existingRow) {
          await supabase
            .from('carrinho')
            .update({ quantidade: existingRow.quantidade + 1 })
            .eq('id', existingRow.id)
        } else {
          await supabase
            .from('carrinho')
            .insert({ user_id: user.id, produto_id: product.id, quantidade: 1 })
        }
      } catch (error) {
        console.error('Error syncing cart to supabase', error)
      }
    }
  }

  const removeItem = async (productId: string) => {
    setItems((current) => current.filter((item) => item.id !== productId))
    if (user) {
      try {
        await supabase.from('carrinho').delete().eq('user_id', user.id).eq('produto_id', productId)
      } catch (error) {
        console.error('Error removing from cart in supabase', error)
      }
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(productId)
      return
    }

    let actualQuantity = quantity
    setItems((current) =>
      current.map((item) => {
        if (item.id === productId) {
          actualQuantity = Math.min(quantity, item.stock)
          return { ...item, quantity: actualQuantity }
        }
        return item
      }),
    )

    if (user) {
      try {
        await supabase
          .from('carrinho')
          .update({ quantidade: actualQuantity })
          .eq('user_id', user.id)
          .eq('produto_id', productId)
      } catch (error) {
        console.error('Error updating cart in supabase', error)
      }
    }
  }

  const clearCart = async () => {
    setItems([])
    if (user) {
      try {
        await supabase.from('carrinho').delete().eq('user_id', user.id)
      } catch (error) {
        console.error('Error clearing cart in supabase', error)
      }
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

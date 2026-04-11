import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Variants } from '@/types/strapiApiResponses'

export interface CartItem {
  id: string
  slug: string
  title: string
  price: number
  quantity: number
  variant: Variants
  image: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const sizeStr = item.variant.size ? `-${item.variant.size}` : ''
        const itemId = `${item.slug}-${item.variant.color}${sizeStr}`
        const existingItem = get().items.find(i => i.id === itemId)

        if (existingItem) {
          set(state => ({
            items: state.items.map(i =>
              i.id === itemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }))
        } else {
          set(state => ({
            items: [...state.items, { ...item, id: itemId, quantity: 1 }]
          }))
        }
      },

      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(i => i.id !== id)
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set(state => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity } : i
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

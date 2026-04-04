'use client'
import { ProductsData } from '@/types/strapiApiResponses'
import React, { createContext, useContext } from 'react'

type ProductContextType = {
  product: ProductsData[] | null
}

export const ProductContext = createContext<ProductContextType | null>(null)

export function ProductProvider ({
  children,
  products
}: {
  children: React.ReactNode
  products: ProductsData[] | null
}) {
  return (
    <ProductContext.Provider value={{ product: products }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct () {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}

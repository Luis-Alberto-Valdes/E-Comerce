'use client'
import { ProductsData } from '@/types/strapiApiResponses'
import React, { createContext, useContext, useState, useEffect } from 'react'

type ProductContextType = {
  product: ProductsData[] | null
  setProduct: (product: ProductsData[]) => void
}

export const ProductContext = createContext<ProductContextType | null>(null)

export function ProductProvider ({
  children,
  products
}: {
  children: React.ReactNode
  products: ProductsData[] | null
}) {
  const [product, setProduct] = useState<ProductsData[] | null>(products)

  useEffect(() => {
    setProduct(products)
  }, [products])

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
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

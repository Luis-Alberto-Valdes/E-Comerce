'use client'
import { getProductData } from '@/services/getComponentsFromStrapi'
import { ProductsData } from '@/types/strapiApiResponses'
import React, { createContext, useState, useEffect } from 'react'

export const ProductContext = createContext<{ product: ProductsData[] | null } | null>(null)

export function ProductProvider ({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<ProductsData[] | null>(null)

  useEffect(() => {
    getProductData().then(setProduct)
  }, [])

  return (
    <ProductContext.Provider value={{ product }}>
      {children}
    </ProductContext.Provider>
  )
}

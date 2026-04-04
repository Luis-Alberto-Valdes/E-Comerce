'use client'

import { useEffect } from 'react'
import { Suspense } from 'react'
import Producto from '@/ui/products/Product'
import FilterMobile from '@/ui/products/FilterMobile'
import { useFilters } from '@/hooks/useFilters'
import { ProductsData } from '@/types/strapiApiResponses'
import styles from '@/app/products/page.module.css'
import ProductSkeleton from './ProductSkeleton'

function ProductGridContent ({ products }: { products: ProductsData[] }) {
  const { filteredProducts, restoreScrollPosition } = useFilters({ products })

  useEffect(() => {
    restoreScrollPosition()
  }, [restoreScrollPosition])

  return (
    <>
      <div className={styles.mobileHeader}>
        <Suspense fallback={<div className={styles.filterTogglePlaceholder} />}>
          <FilterMobile />
        </Suspense>
        <span className={styles.resultCount}>
          {filteredProducts.length} productos
        </span>
      </div>

      <div className={styles.grid}>
        <Suspense fallback={<ProductSkeleton />}>
          {filteredProducts.length > 0
            ? filteredProducts.map((product) => (
              <div key={product.slug} className={styles.productItem}>
                <Producto props={product} />
              </div>
            ))
            : (
              <div className={styles.emptyState}>
                <p>No se encontraron productos con los filtros seleccionados.</p>
              </div>
              )}
        </Suspense>
      </div>
    </>
  )
}

export default function ProductGrid ({ products }: { products: ProductsData[] | null }) {
  if (!products || products.length === 0) {
    return (
      <div className={styles.grid}>
        <div className={styles.emptyState}>
          <p>Cargando productos...</p>
        </div>
      </div>
    )
  }

  return <ProductGridContent products={products} />
}

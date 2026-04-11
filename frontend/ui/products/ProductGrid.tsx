'use client'

import { useEffect } from 'react'
import Producto from '@/ui/products/Product'
import FilterMobile from '@/ui/products/FilterMobile'
import { useFilters } from '@/hooks/useFilters'
import { ProductsData } from '@/types/strapiApiResponses'
import styles from '@/app/products/page.module.css'

function ProductGridContent ({ products }: { products: ProductsData[] }) {
  const { filteredProducts, restoreScrollPosition } = useFilters({ products })

  useEffect(() => {
    restoreScrollPosition()
  }, [restoreScrollPosition])

  return (
    <>
      <div className={styles.mobileHeader}>
        <FilterMobile products={products} />
        <span className={styles.resultCount}>
          {filteredProducts.length} productos
        </span>
      </div>

      <div className={styles.grid}>
        {filteredProducts.length > 0
          ? filteredProducts.map((product) => (
            <div key={product.variants[0]?.slug || product.title} className={styles.productItem}>
              <Producto props={product} />
            </div>
          ))
          : (
            <div className={styles.emptyState}>
              <p>No se encontraron productos con los filtros seleccionados.</p>
            </div>
            )}
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

import { Suspense } from 'react'
import type { Metadata } from 'next'
import FilterSidebar from '@/ui/products/FilterSidebar'
import FilterSkeleton from '@/ui/products/FilterSkeleton'
import ProductSkeleton from '@/ui/products/ProductSkeleton'
import ProductGrid from '../../ui/products/ProductGrid'
import { getProductData } from '@/services/getComponentsFromStrapi'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explora nuestra colección de productos con filtros avanzados por categoría y precio.',
}

export default async function ProductsPage () {
  const products = await getProductData()

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h2>Explora nuestra colección curada con un diseño moderno.</h2>
      </section>

      <div className={styles.content}>
        <Suspense fallback={<FilterSkeleton />}>
          <FilterSidebar products={products} />
        </Suspense>

        <section className={styles.main}>
          <Suspense fallback={<ProductSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}

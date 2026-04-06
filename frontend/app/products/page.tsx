import { Suspense } from 'react'
import FilterSidebar from '@/ui/products/FilterSidebar'
import FilterMobile from '@/ui/products/FilterMobile'
import FilterSkeleton from '@/ui/products/FilterSkeleton'
import ProductSkeleton from '@/ui/products/ProductSkeleton'
import ProductGrid from '../../ui/products/ProductGrid'
import { getProductData } from '@/services/getComponentsFromStrapi'
import styles from './page.module.css'

function MobileFilterHeader () {
  return (
    <div className={styles.mobileHeader}>
      <Suspense fallback={<div className={styles.filterTogglePlaceholder} />}>
        <FilterMobile />
      </Suspense>
    </div>
  )
}

export default async function ProductsPage () {
  const products = await getProductData()

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h2>Productos</h2>
        <p>Explora nuestra colección curada con un diseño moderno.</p>
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

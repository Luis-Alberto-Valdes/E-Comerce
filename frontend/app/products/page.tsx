'use client'
import Producto from '@/ui/products/Product'
import styles from './page.module.css'
import { Suspense, useState } from 'react'
import { useProduct } from '@/context/PorductContext'
import { ProductsData } from '@/types/strapiApiResponses'
import FilterSidebar from '@/ui/products/FilterSidebar'
import FilterToggle from '@/ui/products/FilterToggle'
import FilterDrawer from '@/ui/products/FilterDrawer'

export default function Productos () {
  const { product } = useProduct()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h2>Productos</h2>
        <p>Explora nuestra colección curada con un diseño moderno.</p>
      </section>

      <div className={styles.content}>
        <FilterSidebar />

        <section className={styles.main}>
          <div className={styles.mobileHeader}>
            <FilterToggle onClick={() => setDrawerOpen(true)} />
          </div>

          <div className={styles.grid}>
            <Suspense fallback={<ProductsSkeleton />}>
              {product?.map((product: ProductsData) => (
                <div key={product.slug} className={styles.productItem}>
                  <Producto props={product} />
                </div>
              ))}
            </Suspense>
          </div>
        </section>
      </div>

      {drawerOpen && <FilterDrawer onClose={() => setDrawerOpen(false)} />}
    </main>
  )
}

function ProductsSkeleton () {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className='animate-pulse'>
          <div className='h-80 bg-gray-200 rounded-2xl' />
        </div>
      ))}
    </>
  )
}

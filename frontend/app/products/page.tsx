'use client'
import Producto from '@/ui/proucts/Product'
import styles from './page.module.css'
import { Suspense, useContext } from 'react'
import { ProductContext } from '@/context/PorductContext'
import { ProductsData } from '@/types/strapiApiResponses'

export default function Productos () {
  const { product } = useContext(ProductContext)

  console.log(product)

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h2>Productos</h2>
        <p>Explora nuestra colección curada con un diseño moderno.</p>
      </section>

      <section className={styles.grid}>
        <Suspense>
          {product?.map((product:ProductsData) => (
            <div key={product.slug} className={styles.productItem}>
              <Producto props={product} />
            </div>
          ))}
        </Suspense>

      </section>
    </main>
  )
}

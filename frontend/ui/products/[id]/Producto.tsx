'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useProduct } from '@/context/PorductContext'
import styles from './page.module.css'
import { ProductsData, Variants } from '@/types/strapiApiResponses'

export default function Producto ({ id }: { id: string }) {
  const { product } = useProduct()
  const selectProduct = product?.find((p: ProductsData) => p.slug === id)
  const [variant, setVariant] = useState<Variants>(selectProduct?.variants[0])
  const [loading, setLoading] = useState(true)

  if (!product) {
    return (
      <div className={styles.container}>
        <h1>Cargando...</h1>
      </div>
    )
  }

  if (!selectProduct) {
    return (
      <div className={styles.container}>
        <h1>Producto no encontrado</h1>
        <Link href='/products'>Volver a productos</Link>
      </div>
    )
  }

  const variants: Variants[] = Array.isArray(selectProduct.variants)
    ? selectProduct.variants
    : [selectProduct.variants]

  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVariant = variants.find(v => v.color === event.target.value)
    if (newVariant) {
      setVariant(newVariant)
      setLoading(true)
    }
  }

  return (
    <div className={styles.container}>
      <Link href='/products' className={styles.backLink}>← Volver a productos</Link>
      <div className={styles.productCard}>
        <div className={styles.imageContainer}>
          {loading && <div className={styles.loadingPlaceholder} />}
          <Image
            src={variant.url}
            alt={selectProduct.title}
            fill
            className={styles.image}
            style={{ objectFit: 'contain', opacity: loading ? 0 : 1 }}
            onLoad={() => setLoading(false)}
            priority
          />
        </div>
        <div className={styles.info}>
          <span className={styles.category}>{selectProduct.categorie}</span>
          <h1 className={styles.title}>{selectProduct.title}</h1>
          <p className={styles.price}>Price: ${selectProduct.price}</p>
          <p className={styles.description}>{selectProduct.description}</p>

          <div className={styles.options}>
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Color:</label>
              <select
                onChange={handleVariantChange}
                className={styles.colorOptions}
                defaultValue={selectProduct?.variants[0].color}
              >
                {selectProduct?.variants.map((v: Variants) => (
                  <option key={v.id} value={v.color}>{v.color}</option>
                ))}
              </select>
            </div>

            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Talla:</label>
              <select className={styles.sizeOptions}>
                {variant?.size.map((size: string, index: number) => (
                  <option key={index} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className={styles.stock}>
              <span>Stock disponible: {variant.stock}</span>
            </div>
          </div>

          <button className={styles.button}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  )
}

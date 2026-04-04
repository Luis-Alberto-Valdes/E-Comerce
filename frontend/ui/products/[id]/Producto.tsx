'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useCartStore } from '@/context/CartContext'
import styles from './page.module.css'
import { ProductsData, Variants } from '@/types/strapiApiResponses'

interface ProductoProps {
  product: ProductsData
}

export default function Producto ({ product }: ProductoProps) {
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const variants: Variants[] = Array.isArray(product.variants)
    ? product.variants
    : [product.variants]

  const currentVariant = selectedColor
    ? variants.find(v => v.color === selectedColor) || variants[0]
    : variants[0]

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newColor = event.target.value
    setSelectedColor(newColor)
    const newVariant = variants.find(v => v.color === newColor)
    if (newVariant?.size?.[0]) {
      setSelectedSize(newVariant.size[0])
    } else {
      setSelectedSize(null)
    }
    setLoading(true)
  }

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(event.target.value)
  }

  const handleAddToCart = () => {
    if (isAdding) return
    
    setIsAdding(true)
    addItem({
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: 1,
      variant: { ...currentVariant, size: selectedSize ? [selectedSize] : currentVariant.size },
      image: currentVariant.url
    })
    
    setTimeout(() => setIsAdding(false), 600)
  }

  return (
    <div className={styles.container}>
      <Link href='/products' className={styles.backLink}>← Volver a productos</Link>
      <div className={styles.productCard}>
        <div className={styles.imageContainer}>
          {loading && <div className={styles.loadingPlaceholder} />}
          <Image
            src={currentVariant.url}
            alt={product.title}
            fill
            className={styles.image}
            style={{ objectFit: 'contain', opacity: loading ? 0 : 1 }}
            onLoad={() => setLoading(false)}
            priority
          />
        </div>
        <div className={styles.info}>
          <span className={styles.category}>{product.categorie}</span>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.options}>
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Color:</label>
              <select
                onChange={handleColorChange}
                className={styles.colorOptions}
                value={selectedColor || variants[0].color}
              >
                {variants.map((v: Variants) => (
                  <option key={v.id} value={v.color}>{v.color}</option>
                ))}
              </select>
            </div>

            {currentVariant.size && currentVariant.size.length > 0 && (
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>Talla:</label>
                <select 
                  className={styles.sizeOptions}
                  value={selectedSize || currentVariant.size[0]}
                  onChange={handleSizeChange}
                >
                  {currentVariant.size.map((size: string, index: number) => (
                    <option key={index} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button 
            onClick={handleAddToCart} 
            className={styles.button}
            disabled={isAdding}
          >
            {isAdding ? 'Añadido!' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useMemo } from 'react'
import { useCartStore } from '@/context/CartContext'
import styles from './page.module.css'
import { ProductsData, Variants } from '@/types/strapiApiResponses'

interface ProductoProps {
  product: ProductsData
}

export default function Producto ({ product }: ProductoProps) {
  const [selectedColor, setSelectedColor] = useState(product.variants[0].color)
  const [selectedSize, setSelectedSize] = useState<string | null>(product.variants[0].size || null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const productSlug = product.variants[0]?.slug || product.title.toLowerCase().replace(/\s+/g, '-')

  const uniqueColors = useMemo(() => {
    const seen = new Set<string>()
    return product.variants.filter(v => {
      if (seen.has(v.color)) return false
      seen.add(v.color)
      return true
    })
  }, [product.variants])

  const uniqueSizes = useMemo(() => {
    return product.variants
      .filter(v => v.color === selectedColor && v.size)
      .map(v => v.size!)
      .filter((size, index, arr) => arr.indexOf(size) === index)
  }, [product.variants, selectedColor])

  const imageVariant = useMemo(() => {
    return product.variants.find(v => v.color === selectedColor) || product.variants[0]
  }, [product.variants, selectedColor])

  const cartVariant = useMemo(() => {
    return product.variants.find(v => v.color === selectedColor && v.size === selectedSize) || product.variants.find(v => v.color === selectedColor) || product.variants[0]
  }, [product.variants, selectedColor, selectedSize])

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newColor = event.target.value
    setSelectedColor(newColor)
    const sizesForColor = product.variants.filter(v => v.color === newColor && v.size).map(v => v.size!)
    if (sizesForColor.length > 0) {
      setSelectedSize(sizesForColor[0])
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
      slug: productSlug,
      title: product.title,
      price: product.price,
      quantity: 1,
      variant: cartVariant,
      image: cartVariant.image
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
            src={imageVariant.image}
            alt={product.title}
            fill
            className={styles.image}
            style={{ objectFit: 'contain', opacity: loading ? 0 : 1 }}
            onLoad={() => setLoading(false)}
            priority
          />
        </div>
        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.options}>
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Color:</label>
              <select
                onChange={handleColorChange}
                className={styles.colorOptions}
                value={selectedColor}
              >
                {uniqueColors.map((v: Variants) => (
                  <option key={v.slug} value={v.color}>{v.color}</option>
                ))}
              </select>
            </div>

            {uniqueSizes.length > 0 && (
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>Talla:</label>
                <select
                  onChange={handleSizeChange}
                  className={styles.sizeOptions}
                  value={selectedSize || ''}
                  disabled={uniqueSizes.length <= 1}
                >
                  {uniqueSizes.map((size, index) => (
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

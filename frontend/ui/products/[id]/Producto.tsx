'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type ChangeEvent } from 'react'
import { useCartStore } from '@/context/cartStore'
import styles from './page.module.css'
import { ProductsData, Variants } from '@/types/strapiApiResponses'

interface ProductoProps {
  product: ProductsData
}

export default function Producto ({ product }: ProductoProps) {
  const firstVariant = product.variants[0]
  const [selectedColor, setSelectedColor] = useState(firstVariant?.color ?? '')
  const [selectedSize, setSelectedSize] = useState<string | null>(firstVariant?.size || null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const productSlug = firstVariant?.slug || product.title.toLowerCase().replace(/\s+/g, '-')

  const uniqueColors = product.variants.filter((v, i, arr) => arr.findIndex(v2 => v2.color === v.color) === i)

  const uniqueSizes = product.variants
    .filter(v => v.color === selectedColor && v.size)
    .map(v => v.size!)
    .filter((size, index, arr) => arr.indexOf(size) === index)

  const imageVariant = product.variants.find(v => v.color === selectedColor) || firstVariant

  const cartVariant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize) || product.variants.find(v => v.color === selectedColor) || firstVariant

  if (!firstVariant) return null

  const handleColorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newColor = event.target.value
    setSelectedColor(newColor)
    const sizesForColor = product.variants.filter(v => v.color === newColor && v.size).map(v => v.size!)
    if (sizesForColor.length > 0) {
      setSelectedSize(sizesForColor[0])
    }
    setLoading(true)
  }

  const handleSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
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
              <label htmlFor='color-select' className={styles.optionLabel}>Color:</label>
              <select
                id='color-select'
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
                <label htmlFor='size-select' className={styles.optionLabel}>Talla:</label>
                <select
                  id='size-select'
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
            type='button'
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

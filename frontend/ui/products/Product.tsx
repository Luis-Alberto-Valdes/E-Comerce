'use client'
import Image from 'next/image'
import styles from './Product.module.css'
import Link from 'next/link'
import { ProductsData, Variants } from '@/types/strapiApiResponses'
import { useCartStore } from '@/context/CartContext'
import React, { useState } from 'react'

export default function Producto ({ props }: { props: ProductsData }) {
  const { title, price, slug, description, categorie, variants } = props
  const variantsArray: Variants[] = Array.isArray(variants) ? variants : [variants]
  const [selectedColor, setSelectedColor] = useState(variantsArray[0].color)
  const [selectedSize, setSelectedSize] = useState<string | null>(
    variantsArray[0].size?.[0] || null
  )
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const currentVariant = variantsArray.find(v => v.color === selectedColor) || variantsArray[0]

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newColor = event.target.value
    setSelectedColor(newColor)
    const newVariant = variantsArray.find(v => v.color === newColor)
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
      slug,
      title,
      price,
      quantity: 1,
      variant: { ...currentVariant, size: selectedSize ? [selectedSize] : currentVariant.size },
      image: currentVariant.url
    })
    
    setTimeout(() => setIsAdding(false), 600)
  }

  return (
    <article className={styles.card} aria-labelledby={`product-title-${slug}`}>
      <Link className={styles.productLink} href={`/products/${slug}`}>
        <div className={styles.imageWrapper}>
          {loading && <div className={styles.loadingPlaceholder} />}
          <Image
            src={currentVariant.url}
            alt={title}
            fill
            className={styles.productImage}
            style={{ objectFit: 'contain', opacity: loading ? 0 : 1 }}
            onLoad={() => setLoading(false)}
            priority
          />
        </div>
      </Link>

      <section className={styles.content}>
        <div className={styles.titleBar}>
          <h3 id={`product-title-${slug}`} className={styles.title}>{title}</h3>
          <span className={styles.category}>{categorie}</span>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.meta}>
          <span className={styles.price}>${price.toFixed(2)}</span>
        </div>

        <div className={styles.selectorRow}>
          <label htmlFor={`color-${slug}`} className='sr-only'>Color</label>
          <select
            onChange={handleColorChange}
            id={`color-${slug}`}
            name='color'
            className={styles.selector}
            value={selectedColor}
          >
            {variantsArray.map((v: Variants) => (
              <option key={v.id} value={v.color}>{v.color}</option>
            ))}
          </select>

          <label htmlFor={`size-${slug}`} className='sr-only'>Talla</label>
          <select 
            id={`size-${slug}`} 
            name='size' 
            className={styles.selector}
            value={selectedSize || ''}
            onChange={handleSizeChange}
          >
            {currentVariant.size != null && currentVariant.size.length > 0
              ? currentVariant.size.map((s: string, index: number) => (
                <option key={index} value={s}>{s}</option>
              ))
              : <option value=''>Sin talla</option>}
          </select>
        </div>

        <div className={styles.action}>
          <button 
            type='button' 
            className={styles.addButton}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? 'Añadido!' : 'Agregar al carrito'}
          </button>
        </div>
      </section>
    </article>
  )
}

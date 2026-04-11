'use client'
import Image from 'next/image'
import styles from './Product.module.css'
import Link from 'next/link'
import { ProductsData, Variants } from '@/types/strapiApiResponses'
import { useCartStore } from '@/context/cartStore'
import { useState, type ChangeEvent } from 'react'

export default function Producto ({ props }: { props: ProductsData }) {
  const { title, price, description, category, variants } = props
  const firstVariant = variants[0]
  const productSlug = firstVariant?.slug || title.toLowerCase().replace(/\s+/g, '-')
  const [selectedColor, setSelectedColor] = useState(firstVariant?.color ?? '')
  const [selectedSize, setSelectedSize] = useState<string | null>(firstVariant?.size || null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const uniqueColors = variants.filter((v, i, arr) => arr.findIndex(v2 => v2.color === v.color) === i)

  const uniqueSizes = variants
    .filter(v => v.color === selectedColor && v.size)
    .map(v => v.size!)
    .filter((size, index, arr) => arr.indexOf(size) === index)

  const imageVariant = variants.find(v => v.color === selectedColor) || firstVariant

  const cartVariant = variants.find(v => v.color === selectedColor && v.size === selectedSize) || variants.find(v => v.color === selectedColor) || firstVariant

  if (!firstVariant) return null

  const handleColorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newColor = event.target.value
    setSelectedColor(newColor)
    const sizesForColor = variants.filter(v => v.color === newColor && v.size).map(v => v.size!)
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
      title,
      price,
      quantity: 1,
      variant: cartVariant,
      image: cartVariant.image
    })

    setTimeout(() => setIsAdding(false), 600)
  }

  return (
    <article className={styles.card} aria-labelledby={`product-title-${productSlug}`}>
      <Link className={styles.productLink} href={`/products/${productSlug}`}>
        <div className={styles.imageWrapper}>
          {loading && <div className={styles.loadingPlaceholder} />}
          <Image
            src={imageVariant.image}
            alt={title}
            fill
            className={styles.productImage}
            style={{ objectFit: 'contain', opacity: loading ? 0 : 1 }}
            onLoad={() => setLoading(false)}
          />
        </div>
      </Link>

      <section className={styles.content}>
        <div className={styles.titleBar}>
          <h3 id={`product-title-${productSlug}`} className={styles.title}>{title}</h3>
          <span className={styles.category}>{category}</span>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.meta}>
          <span className={styles.price}>Precio:  ${price.toFixed(2)}</span>
        </div>

        <div className={styles.selectorRow}>
          <label htmlFor={`color-${productSlug}`} className='sr-only'>Color</label>
          <select
            onChange={handleColorChange}
            id={`color-${productSlug}`}
            name='color'
            className={styles.selector}
            value={selectedColor}
          >
            {uniqueColors.map((v: Variants) => (
              <option key={v.slug} value={v.color}>{v.color}</option>
            ))}
          </select>

          <label htmlFor={`size-${productSlug}`} className='sr-only'>Talla</label>
          <select
            onChange={handleSizeChange}
            id={`size-${productSlug}`}
            name='size'
            className={styles.selector}
            value={selectedSize || ''}
            disabled={uniqueSizes.length <= 1}
          >
            {uniqueSizes.map((size, index) => (
              <option key={index} value={size}>{size}</option>
            ))}
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

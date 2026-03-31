import Image from 'next/image'
import styles from './Product.module.css'
import Link from 'next/link'
import { ProductsData, Variants } from '@/types/strapiApiResponses'
import React, { useState } from 'react'

export default function Producto ({ props }: { props: ProductsData }) {
  const { title, price, slug, description, categorie, variants } = props
  const [variant, setVariant] = useState<Variants>(variants[0])
  const [loading, setLoading] = useState(true)

  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVariant = variants.find(v => v.color === event.target.value)
    if (newVariant) {
      setVariant(newVariant)
      setLoading(true)
    }
  }

  return (
    <article className={styles.card} aria-labelledby={`product-title-${slug}`}>
      <Link className={styles.productLink} href={`/products/${slug}`}>
        <div className={styles.imageWrapper}>
          {loading && <div className={styles.loadingPlaceholder} />}
          <Image
            src={variant.url}
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
          <span className={styles.rating}>Stock: {variant.stock}</span>
        </div>

        <div className={styles.selectorRow}>
          <label htmlFor={`color-${slug}`} className='sr-only'>Color</label>
          <select
            onChange={handleVariantChange}
            id={`color-${slug}`}
            name='color'
            className={styles.selector}
            defaultValue={variant.color}
          >
            {variants.map((v: Variants) => (
              <option key={v.id} value={v.color}>{v.color}</option>
            ))}
          </select>

          <label htmlFor={`size-${slug}`} className='sr-only'>Size</label>
          <select id={`size-${slug}`} name='size' className={styles.selector}>
            {variant.size != null
              ? variant.size.map((s: string, index: number) => (
                <option key={index} value={s}>{s}</option>
              ))
              : ''}
          </select>
        </div>

        <div className={styles.action}>
          <button type='button' className={styles.addButton}>Agregar al carrito</button>
        </div>
      </section>
    </article>
  )
}

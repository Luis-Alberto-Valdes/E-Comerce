'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/context/CartContext'
import styles from './page.module.css'

export default function CartPage () {
  const items = useCartStore(state => state.items)
  const removeItem = useCartStore(state => state.removeItem)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const clearCart = useCartStore(state => state.clearCart)

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0)

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>Carrito de Compras</h1>
            <p>Tu carrito está vacío</p>
          </header>

          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
              <path d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' />
            </svg>
            <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
            <p className={styles.emptyText}>Añade productos para comenzar tu compra</p>
            <Link href='/products' className={styles.emptyBtn}>
              Ver Productos
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Carrito de Compras</h1>
          <p>{totalItems} producto{totalItems > 1 ? 's' : ''} en tu carrito</p>
        </header>

        <div className={styles.content}>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <article key={item.id} className={styles.item}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={100}
                  className={styles.itemImage}
                />

                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemVariant}>
                    {item.variant.color}
                    {item.variant.size && ` / ${item.variant.size.join(', ')}`}
                  </p>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>

                  <div className={styles.itemQuantity}>
                    <button
                      type='button'
                      className={styles.quantityBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label='Disminuir cantidad'
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      type='button'
                      className={styles.quantityBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label='Aumentar cantidad'
                    >
                      +
                    </button>
                  </div>

                  <button
                    type='button'
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.id)}
                  >
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <path d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Resumen del Pedido</h2>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal ({totalItems} items)</span>
              <span className={styles.summaryValue}>{formatPrice(totalPrice)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Envío</span>
              <span className={styles.summaryValue}>Calculado al checkout</span>
            </div>

            <div className={styles.summaryTotal}>
              <span className={styles.summaryLabel}>Total</span>
              <span className={styles.summaryValue}>{formatPrice(totalPrice)}</span>
            </div>

            <div className={styles.summaryActions}>
              <button
                type='button'
                className={styles.clearBtn}
                onClick={clearCart}
              >
                Limpiar carrito
              </button>
              <button type='button' className={styles.buyBtn}>
                Proceder al Checkout
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

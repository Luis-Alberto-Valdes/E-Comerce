'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/context/cartStore'
import styles from './cartIcon.module.css'

export default function CartIcon () {
  const pathname = usePathname()
  const totalItems = useCartStore(state => state.getTotalItems())

  const href = pathname === '/cart' ? '/products' : '/cart'

  return (
    <Link href={href} className={styles.cartLink}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={styles.cartIcon}
      >
        <circle cx='9' cy='21' r='1' />
        <circle cx='20' cy='21' r='1' />
        <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
      </svg>
      {totalItems > 0 && (
        <span className={styles.badge}>{totalItems}</span>
      )}
    </Link>
  )
}

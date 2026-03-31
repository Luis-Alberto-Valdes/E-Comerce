'use client'

import styles from './FilterToggle.module.css'

export default function FilterToggle ({ onClick }: { onClick: () => void }) {
  return (
    <button
      type='button'
      className={styles.toggleBtn}
      onClick={onClick}
      aria-label='Abrir filtros'
    >
      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
        <line x1='4' y1='6' x2='20' y2='6' />
        <line x1='8' y1='12' x2='20' y2='12' />
        <line x1='12' y1='18' x2='20' y2='18' />
      </svg>
      <span>Filtros</span>
    </button>
  )
}

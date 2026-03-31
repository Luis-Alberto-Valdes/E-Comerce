'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './ProductFilters.module.css'

interface FilterOption {
  label: string
  value: string
}

interface ProductFiltersProps {
  categories?: FilterOption[]
}

export default function ProductFilters({ categories = [] }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const mockCategories: FilterOption[] = categories.length > 0 ? categories : [
    { label: 'Todas', value: '' },
    { label: 'Electrónica', value: 'electronica' },
    { label: 'Ropa', value: 'ropa' },
    { label: 'Hogar', value: 'hogar' },
    { label: 'Deportes', value: 'deportes' },
    { label: 'Libros', value: 'libros' },
  ]

  const toggleDrawer = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={toggleDrawer}
        aria-expanded={isOpen}
        aria-controls="filter-drawer"
        aria-label="Abrir filtros"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="20" y2="12" />
          <line x1="12" y1="18" x2="20" y2="18" />
        </svg>
        <span>Filtros</span>
      </button>

      {hasMounted && (
        <div
          id="filter-drawer"
          className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
          onClick={closeDrawer}
          aria-hidden={!isOpen}
        />
      )}

      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de productos"
      >
        <header className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Filtros</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeDrawer}
            aria-label="Cerrar filtros"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className={styles.drawerContent}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Buscar</h3>
            <div className={styles.searchWrapper}>
              <svg
                className={styles.searchIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                id="search"
                name="search"
                placeholder="Buscar productos..."
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Categoría</h3>
            <div className={styles.radioGroup}>
              {mockCategories.map((category) => (
                <label key={category.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    className={styles.radio}
                  />
                  <span className={styles.radioMark} />
                  <span className={styles.labelText}>{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Precio máximo</h3>
            <div className={styles.priceWrapper}>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                min="0"
                placeholder="Ej: 500"
                className={styles.priceInput}
              />
              <span className={styles.currency}>$</span>
            </div>
            <div className={styles.priceRange}>
              <input
                type="range"
                min="0"
                max="1000"
                defaultValue="1000"
                className={styles.rangeSlider}
                aria-label="Precio máximo"
              />
              <div className={styles.rangeLabels}>
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>
          </div>
        </div>

        <footer className={styles.drawerFooter}>
          <button type="button" className={styles.clearBtn}>
            Limpiar todo
          </button>
          <button type="button" className={styles.applyBtn} onClick={closeDrawer}>
            Ver resultados
          </button>
        </footer>
      </aside>
    </>
  )
}

'use client'

import { useFilterValues } from '@/hooks/useFilters'
import { ProductsData } from '@/types/strapiApiResponses'
import styles from './FilterSidebar.module.css'

interface FilterSidebarProps {
  products: ProductsData[] | null
}

export default function FilterSidebar ({ products }: FilterSidebarProps) {
  const { filters, localSearch, setFilter, clearFilters, hasActiveFilters, uniqueCategories } = useFilterValues({ products: products || [] })

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h2 className={styles.title}>Filtros</h2>
        {hasActiveFilters && (
          <button
            type='button'
            onClick={clearFilters}
            className={styles.clearBtn}
          >
            Limpiar
          </button>
        )}
      </header>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Buscar</h3>
          <div className={styles.searchWrapper}>
            <label for='search' className={styles.labelText}>
              <svg className={styles.searchIcon} width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <circle cx='11' cy='11' r='8' />
                <line x1='21' y1='21' x2='16.65' y2='16.65' />
              </svg>
              <input
                type='search'
                id='search'
                name='search'
                placeholder='Buscar productos...'
                value={localSearch}
                onChange={(e) => setFilter('search', e.target.value)}
                className={styles.searchInput}
              />
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Categoría</h3>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type='radio'
                name='category'
                value=''
                checked={filters.category === ''}
                onChange={() => setFilter('category', '')}
                className={styles.radio}
              />
              <span className={styles.radioMark} />
              <span className={styles.labelText}>Todas</span>
            </label>
            {uniqueCategories.map((category) => (
              <label key={category} className={styles.radioLabel}>
                <input
                  type='radio'
                  name='category'
                  value={category}
                  checked={filters.category === category}
                  onChange={() => setFilter('category', category)}
                  className={styles.radio}
                />
                <span className={styles.radioMark} />
                <span className={styles.labelText}>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Precio máximo</h3>
          <div className={styles.priceWrapper}>
            <label for='maxPrice' className={styles.labelText}>
              <span className={styles.currency}>$</span>
              <input
                type='number'
                id='maxPrice'
                name='maxPrice'
                min='0'
                placeholder='Ej: 500'
                value={filters.maxPrice}
                onChange={(e) => setFilter('maxPrice', e.target.value)}
                className={styles.priceInput}
              />
            </label>
          </div>
        </div>
      </div>
    </aside>
  )
}

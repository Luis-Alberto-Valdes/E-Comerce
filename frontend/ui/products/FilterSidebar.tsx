import styles from './FilterSidebar.module.css'

const categories = [
  { label: 'Todas', value: '' },
  { label: 'Camisa', value: 'camisa' },
  { label: 'Pantalon', value: 'pantalon' },
  { label: 'Guantes', value: 'guantes' },
]

export default function FilterSidebar () {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h2 className={styles.title}>Filtros</h2>
      </header>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Buscar</h3>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <circle cx='11' cy='11' r='8' />
              <line x1='21' y1='21' x2='16.65' y2='16.65' />
            </svg>
            <input
              type='search'
              id='search'
              name='search'
              placeholder='Buscar productos...'
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Categoría</h3>
          <div className={styles.radioGroup}>
            {categories.map((category) => (
              <label key={category.value} className={styles.radioLabel}>
                <input type='radio' name='category' value={category.value} className={styles.radio} />
                <span className={styles.radioMark} />
                <span className={styles.labelText}>{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Precio máximo</h3>
          <div className={styles.priceWrapper}>
            <span className={styles.currency}>$</span>
            <input
              type='number'
              id='maxPrice'
              name='maxPrice'
              min='0'
              placeholder='Ej: 500'
              className={styles.priceInput}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}

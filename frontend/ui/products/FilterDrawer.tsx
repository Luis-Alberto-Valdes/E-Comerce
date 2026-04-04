'use client';

import { useState, useEffect } from 'react';
import { useFilterValues } from '@/hooks/useFilters';
import styles from './FilterDrawer.module.css';

const categories = [
  { label: 'Todas', value: '' },
  { label: 'Camisa', value: 'camisa' },
  { label: 'Pantalon', value: 'pantalon' },
  { label: 'Guantes', value: 'guantes' },
];

interface FilterDrawerProps {
  onClose: () => void;
}

export default function FilterDrawer({ onClose }: FilterDrawerProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const { filters, setFilter, clearFilters, hasActiveFilters } = useFilterValues();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {hasMounted && (
        <div
          className={styles.overlay}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Filtros de productos">
        <header className={styles.header}>
          <h2 className={styles.title}>Filtros</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar filtros"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Buscar</h3>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                id="search"
                name="search"
                placeholder="Buscar productos..."
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Categoría</h3>
            <div className={styles.radioGroup}>
              {categories.map((category) => (
                <label key={category.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={filters.category === category.value}
                    onChange={() => setFilter('category', category.value)}
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
              <span className={styles.currency}>$</span>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                min="0"
                placeholder="Ej: 500"
                value={filters.maxPrice}
                onChange={(e) => setFilter('maxPrice', e.target.value)}
                className={styles.priceInput}
              />
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            onClick={clearFilters}
            className={styles.clearBtn}
            disabled={!hasActiveFilters}
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.applyBtn}
          >
            Ver resultados
          </button>
        </footer>
      </aside>
    </>
  );
}

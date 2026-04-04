import styles from './FilterSkeleton.module.css';

export default function FilterSkeleton() {
  return (
    <aside className={styles.skeleton}>
      <div className={styles.header}>
        <div className={styles.title} />
        <div className={styles.clearBtn} />
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle} />
          <div className={styles.searchInput} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle} />
          <div className={styles.radioGroup}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.radioItem} />
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle} />
          <div className={styles.priceInput} />
        </div>
      </div>
    </aside>
  );
}

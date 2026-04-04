import styles from './ProductSkeleton.module.css'

export default function ProductSkeleton () {
  return (
    <div className={styles.skeleton}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.image} />
          <div className={styles.content}>
            <div className={styles.titleBar}>
              <div className={styles.title} />
              <div className={styles.category} />
            </div>
            <div className={styles.description} />
            <div className={styles.meta}>
              <div className={styles.price} />
            </div>
            <div className={styles.button} />
          </div>
        </div>
      ))}
    </div>
  )
}

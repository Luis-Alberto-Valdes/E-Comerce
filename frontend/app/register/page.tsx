import Link from 'next/link'
import styles from './page.module.css'

export default function Registro () {
  return (
    <main className={styles.container}>
      <h3 className={styles.title}>Register</h3>
      <form className={styles.form}>
        <input className={styles.input} type='email' placeholder='your@email.com' />
        <input className={styles.input} type='text' placeholder='Username' />
        <input className={styles.input} type='password' placeholder='Password' />
        <button type='submit' className={styles.submit}>Create account</button>
      </form>
      <Link href='/login' className={styles.link}>Already have an account? Login</Link>
    </main>
  )
}

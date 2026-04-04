import { getNavBarData } from '@/services/getComponentsFromStrapi'
import Link from 'next/link'
import CartIcon from './CartIcon'
import styles from './navbar.module.css'

export default async function NavBar () {
  const { text } = await getNavBarData()

  return (
    <nav className={styles.nav}>
      <h2 className={styles.logo}><Link href='/' className={styles.logoLink}>{text}</Link></h2>
      <div className={styles.links}>
        <CartIcon />
      </div>
    </nav>
  )
}

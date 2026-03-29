import Link from "next/link";
import styles from "./page.module.css";

export default function IniciarSecion(){

    return (
        <main className={styles.container}>
            <h3 className={styles.title}>Login</h3>
            <form className={styles.form}>
                <input className={styles.input} type="email" placeholder="your@email.com"></input>
                <input className={styles.input} type="password" placeholder="Password"></input>
                <button type="submit" className={styles.submit}>Enter</button>
            </form>
            <Link href='/register' className={styles.link}>Dont have account? Register</Link>
        </main>
    )


}
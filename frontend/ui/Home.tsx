import { getHomeData } from "@/services/getComponentsFromStrapi";
import Link from "next/link";
import styles from "./home.module.css";

export default async function Home(){
    const {titulo,description,link} = await getHomeData()
    
    return (
        <div className={styles.container}>
        <h2 className={styles.title}>{titulo}</h2>
        <p className={styles.description}>{description}</p>
        <Link href='/products' className={styles.link}>{link}</Link>
    </div>
    )
}
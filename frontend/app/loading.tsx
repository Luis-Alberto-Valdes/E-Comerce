import style from '@/app/page.module.css'

export default function Loading () {
  return (
    <div className={style.skeleton}>
      <p>Cargando..</p>
    </div>
  )
}

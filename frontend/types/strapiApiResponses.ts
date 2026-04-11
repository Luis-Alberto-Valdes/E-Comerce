export type Button = {
  id: number
  link: string
}

export type HomeData = {
  titulo: string
  description: string
  link: string
}

export type NavBarData = {
  text: string
}

export type Variants = {
  slug: string
  image: string
  color: string
  size?: string
}

export type ProductsData = {
  title: string
  price: number
  description: string
  category: string
  variants: Variants[]
}

type button = {
  id: number,
  link: string
}

export type HomeData = {
  titulo: string,
  description: string,
  link: string
}

export type NavBarData = {
  text: string,
  registrarce: button,
  loguearse: button
}

export type Variants = {
  id: number,
  url: string,
  stock: number,
  color: string,
  size?: string[]
}

export type ProductsData = {
  title: string,
  price: number,
  slug: string,
  shopifyID: string,
  description: string,
  categorie: string,
  variants: Variants[] | Variants
}

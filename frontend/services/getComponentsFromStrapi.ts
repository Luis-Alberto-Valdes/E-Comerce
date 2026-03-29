import { HomeData, NavBarData, ProductsData } from '@/types/strapiApiResponses'

const STRAPI_URL = 'http://localhost:1337/api/'
const API_TOKEN = 'fd4cb3d58a74c6ab3a2d93e2e09e8a131e558ec01f6c4233e101aeaefe57dde7be3a1853c1729dc255c5259e96e64a894b5172115f354b64422f387816807e44ceb6b18f06f2b9cbbe3a82955fbdb4500444732f1f24f853ea86161282f06e46d3036ffecb39546f353aa46e9e789590b52bf1d8425507cac5561ad5a1f2d0cd'

const query = async (url:string) => {
  const res = await fetch(`${STRAPI_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
  })
  return await res.json()
}

export const getHomeData = async ():Promise<HomeData> => {
  try {
    const data = await query('home?fields=titulo,description&populate[productos][fields]=link')

    const { titulo, description } = data.data
    const { link } = data.data.productos
    return { titulo, description, link }
  } catch (e) {
    return { titulo: '', description: '', link: '' }
  }
}

export const getNavBarData = async ():Promise<NavBarData> => {
  try {
    const data = await query('barra-de-navegacion?populate=*')

    const { registrarce, loguearse } = data.data
    const { text } = data.data.logo[0].children[0]

    return { text, registrarce, loguearse }
  } catch (e) {
    return { text: '', registrarce: { id: 0, link: '' }, loguearse: { id: 0, link: '' } }
  }
}

export const getProductData = async ():Promise<ProductsData[]> => {
  try {
    const data = await query('products?populate=*')

    const products:ProductsData[] = data.data.map((prod:ProductsData) => {
      const { title, price, slug, shopifyID, variants } = prod
      const description = prod.description[0].children[0].text
      const categorie = prod.categorie.categorieName

      return { title, price, slug, shopifyID, description, categorie, variants }
    })

    return products
  } catch (e) {
    return e
  }
}

import { HomeData, NavBarData, ProductsData } from '@/types/strapiApiResponses'
// eslint-disable-next-line camelcase
import { unstable_cache } from 'next/cache'

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337/api/'
const API_TOKEN = process.env.STRAPI_API_TOKEN

if (!API_TOKEN) {
  throw new Error('STRAPI_API_TOKEN is not defined in environment variables')
}

const query = async (url: string) => {
  const res = await fetch(`${STRAPI_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
  })
  return await res.json()
}

const fetchHomeData = async (): Promise<HomeData> => {
  const data = await query('home?fields=titulo,description&populate[productos][fields]=link')

  if (!data.data?.productos) {
    throw new Error('Invalid home data from Strapi')
  }

  const { titulo, description } = data.data
  const { link } = data.data.productos
  return { titulo, description, link }
}

const fetchNavBarData = async (): Promise<NavBarData> => {
  const data = await query('barra-de-navegacion?populate=*')

  if (!data.data?.logo?.[0]?.children?.[0]) {
    throw new Error('Invalid navbar data from Strapi')
  }

  const { text } = data.data.logo[0].children[0]
  return { text }
}

const fetchProductData = async (): Promise<ProductsData[]> => {
  const data = await query('product-shopifies?populate=*')

  if (!data.data || !Array.isArray(data.data)) {
    throw new Error('Invalid products data from Strapi')
  }

  const products: ProductsData[] = data.data.map((prod: Record<string, unknown>) => {
    const product = prod.product
    const { title, description } = product
    const price = parseFloat(product.priceRangeV2.maxVariantPrice.amount)
    const category = product.title.split(' ')[0] || 'General'
    const variants = product.variants.nodes.map((variant: Record<string, unknown>) => {
      const slug = String(variant.id).split('/').pop() || String(variant.id)
      const [color, size] = variant.title.split(' / ')
      const image = variant.image.url

      return { slug, color, size, image }
    })

    return { title, description, price, category, variants }
  })

  if (products.length === 0) {
    throw new Error('No products returned from Strapi')
  }

  return products
}

export const getHomeData = unstable_cache(fetchHomeData, ['home-data'], { revalidate: 300 })
export const getNavBarData = unstable_cache(fetchNavBarData, ['navbar-data'], { revalidate: 300 })
export const getProductData = unstable_cache(fetchProductData, ['products-data'], { revalidate: 300 })

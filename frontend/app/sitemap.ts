import type { MetadataRoute } from 'next'
import { getProductData } from '@/services/getComponentsFromStrapi'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'

export default async function sitemap (): Promise<MetadataRoute.Sitemap> {
  let products: Array<{ variants: Array<{ slug?: string }>; title: string }> | null = null

  try {
    products = await getProductData()
  } catch {
    products = null
  }

  const productUrls = products?.map((product) => ({
    url: `${DOMAIN}/products/${product.variants?.[0]?.slug || product.title.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  return [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${DOMAIN}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...productUrls,
  ]
}

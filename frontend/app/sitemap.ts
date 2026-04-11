import type { MetadataRoute } from 'next'
import { getProductData } from '@/services/getComponentsFromStrapi'

export default async function sitemap (): Promise<MetadataRoute.Sitemap> {
  const products = await getProductData()

  const productUrls = products?.map((product) => ({
    url: `https://tu-dominio.com/products/${product.variants[0]?.slug || product.title.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  return [
    {
      url: 'https://tu-dominio.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://tu-dominio.com/products',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...productUrls,
  ]
}

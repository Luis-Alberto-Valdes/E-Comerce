import type { MetadataRoute } from 'next'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'

export default function robots (): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  }
}

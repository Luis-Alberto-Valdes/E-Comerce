import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Aumenta el tiempo de espera (por ejemplo, a 30 segundos)
    imgOptTimeoutInSeconds: 60
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      }

    ],
    imageSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  },

}

export default nextConfig

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '@/ui/NavBar'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: {
    default: 'E-Commerce Store',
    template: '%s | E-Commerce Store',
  },
  description: 'Explora nuestra colección curada con un diseño moderno.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: {
      default: 'E-Commerce Store',
      template: '%s | E-Commerce Store',
    },
    description: 'Explora nuestra colección curada con un diseño moderno.',
    url: 'https://tu-dominio.com',
    siteName: 'E-Commerce Store',
    locale: 'es_ES',
    type: 'website',
  },
  alternates: {
    canonical: 'https://tu-dominio.com',
  },
}

export default function RootLayout ({
  children,
}: {
  children: import('react').ReactNode
}) {
  return (
    <html lang='es' className={inter.variable}>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  )
}

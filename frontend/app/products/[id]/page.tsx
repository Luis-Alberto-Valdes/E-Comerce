import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Producto from '@/ui/products/[id]/Producto'
import { getProductData } from '@/services/getComponentsFromStrapi'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const products = await getProductData()
  const product = products?.find((p) =>
    p.variants.some((v) => v.slug === id)
  )

  if (!product) {
    return {
      title: 'Producto no encontrado',
    }
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      type: 'website',
    },
  }
}

export default async function ProductDetailPage ({ params }: Props) {
  const { id } = await params
  const products = await getProductData()
  const product = products?.find((p) =>
    p.variants.some((v) => v.slug === id)
  )

  if (!product) {
    notFound()
  }

  return <Producto product={product} />
}

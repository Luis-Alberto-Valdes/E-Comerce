import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Producto from '@/ui/products/[id]/Producto'
import { getProductData } from '@/services/getComponentsFromStrapi'

export default async function ProductDetailPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const products = await getProductData()
  const product = products?.find((p) => p.slug === id)

  if (!product) {
    notFound()
  }

  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>}>
      <Producto product={product} />
    </Suspense>
  )
}

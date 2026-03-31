import Producto from '@/ui/products/[id]/Producto'
import { Suspense } from 'react'

export default async function Page ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>}>
      <Producto id={id} />
    </Suspense>
  )
}

import Producto from '@/ui/proucts/[id]/Producto'

export default async function Page ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  console.log(id)

  return <Producto id={id} />
}

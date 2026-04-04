import { getShopifyProductsData } from '@/services/getComponentsFromStrapi'
import Home from '@/ui/Home'
export default async function Page () {
  const { data } = await getShopifyProductsData()

  return (
    <main>
      <Home />
    </main>
  )
}

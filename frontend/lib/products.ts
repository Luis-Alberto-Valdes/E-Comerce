import { ProductsData } from '@/types/strapiApiResponses'

export interface ProductFilters {
  search?: string;
  category?: string;
  maxPrice?: string;
}

export function filterProducts (products: ProductsData[], filters: ProductFilters): ProductsData[] {
  let filtered = [...products]

  if (filters.category) {
    filtered = filtered.filter(p =>
      p.categorie.toLowerCase() === filters.category!.toLowerCase()
    )
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.maxPrice) {
    const maxPrice = parseFloat(filters.maxPrice)
    if (!isNaN(maxPrice)) {
      filtered = filtered.filter(p => p.price <= maxPrice)
    }
  }

  return filtered
}

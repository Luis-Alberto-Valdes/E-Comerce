'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import { filterProducts, ProductFilters } from '@/lib/products'
import { ProductsData } from '@/types/strapiApiResponses'

const SCROLL_POSITION_KEY = 'products_scroll_position'
const DEBOUNCE_DELAY = 300

function updateURL ({
  key,
  value,
  searchParams,
  pathname,
  router
}: {
  key: string
  value: string
  searchParams: URLSearchParams
  pathname: string
  router: ReturnType<typeof useRouter>
}) {
  if (typeof window === 'undefined') return

  const scrollPosition = window.scrollY
  sessionStorage.setItem(SCROLL_POSITION_KEY, String(scrollPosition))

  const params = new URLSearchParams(searchParams.toString())
  if (value) {
    params.set(key, value)
  } else {
    params.delete(key)
  }

  const queryString = params.toString()
  router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
}

export function useFilters ({ products }: { products: ProductsData[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [localSearch, setLocalSearch] = useState(() => searchParams.get('search') || '')

  const urlSearchValue = searchParams.get('search') || ''
  const categoryValue = searchParams.get('category') || ''
  const maxPriceValue = searchParams.get('maxPrice') || ''

  const filters = useMemo((): ProductFilters => ({
    search: urlSearchValue,
    category: categoryValue,
    maxPrice: maxPriceValue,
  }), [urlSearchValue, categoryValue, maxPriceValue])

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return filterProducts(products, filters)
  }, [products, filters])

  const setFilter = useCallback((key: string, value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (key === 'search') {
      setLocalSearch(value)
      debounceRef.current = setTimeout(() => {
        updateURL({ key, value, searchParams, pathname, router })
      }, DEBOUNCE_DELAY)
    } else {
      updateURL({ key, value, searchParams, pathname, router })
    }
  }, [searchParams, pathname, router])

  const clearFilters = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    setLocalSearch('')

    if (typeof window === 'undefined') return
    const scrollPosition = window.scrollY
    sessionStorage.setItem(SCROLL_POSITION_KEY, String(scrollPosition))

    router.push(pathname, { scroll: false })
  }, [pathname, router])

  const restoreScrollPosition = useCallback(() => {
    if (typeof window === 'undefined') return
    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY)
    if (savedPosition) {
      window.scrollTo({
        top: parseInt(savedPosition, 10),
        behavior: 'instant'
      })
      sessionStorage.removeItem(SCROLL_POSITION_KEY)
    }
  }, [])

  const hasActiveFilters = urlSearchValue !== '' || categoryValue !== '' || maxPriceValue !== ''

  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>()
    return products.filter(p => {
      if (seen.has(p.category)) return false
      seen.add(p.category)
      return true
    }).map(p => p.category)
  }, [products])

  return {
    filters,
    filteredProducts,
    localSearch,
    setFilter,
    clearFilters,
    hasActiveFilters,
    restoreScrollPosition,
    uniqueCategories,
  }
}

export { useFilters as useFilterValues }

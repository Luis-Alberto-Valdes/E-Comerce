'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { filterProducts, ProductFilters } from '@/lib/products'
import { ProductsData } from '@/types/strapiApiResponses'

const SCROLL_POSITION_KEY = 'products_scroll_position'
const DEBOUNCE_DELAY = 500

export function useFilters ({ products }: { products: ProductsData[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const [localSearch, setLocalSearch] = useState('')

  useEffect(() => {
    setLocalSearch(searchParams.get('search') || '')
  }, [searchParams])

  const filters = useMemo((): ProductFilters => ({
    search: localSearch,
    category: searchParams.get('category') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  }), [localSearch, searchParams])

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return filterProducts(products, filters)
  }, [products, filters])

  const setFilter = useCallback((key: string, value: string) => {
    if (key === 'search') {
      setLocalSearch(value)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        if (typeof window === 'undefined') return
        const scrollPosition = window.scrollY
        sessionStorage.setItem(SCROLL_POSITION_KEY, String(scrollPosition))

        const params = new URLSearchParams(searchParams.toString())
        if (value) {
          params.set('search', value)
        } else {
          params.delete('search')
        }

        const queryString = params.toString()
        router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
      }, DEBOUNCE_DELAY)
    } else {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

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

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return {
    filters,
    filteredProducts,
    setFilter,
    clearFilters,
    hasActiveFilters,
    restoreScrollPosition,
  }
}

export function useFilterValues () {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const [localSearch, setLocalSearch] = useState('')

  useEffect(() => {
    setLocalSearch(searchParams.get('search') || '')
  }, [searchParams])

  const filters = useMemo((): ProductFilters => ({
    search: localSearch,
    category: searchParams.get('category') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  }), [localSearch, searchParams])

  const setFilter = useCallback((key: string, value: string) => {
    if (key === 'search') {
      setLocalSearch(value)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        if (typeof window === 'undefined') return

        const params = new URLSearchParams(searchParams.toString())
        if (value) {
          params.set('search', value)
        } else {
          params.delete('search')
        }

        const queryString = params.toString()
        router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
      }, DEBOUNCE_DELAY)
    } else {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      if (typeof window === 'undefined') return

      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }
  }, [searchParams, pathname, router])

  const clearFilters = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    setLocalSearch('')

    if (typeof window === 'undefined') return
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  }
}

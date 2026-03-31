# Sistema de Filtros en Next.js - Best Practices

## Enfoque Recomendado: URL Search Params + Server Components

Este es el patrón más optimizado para e-commerce según las Next.js Best Practices.

### Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│  Server Component (page.tsx)                                │
│  - Recibe searchParams como Promise (Next.js 15+)           │
│  - Hace fetch directo a DB/API sin capa intermedia          │
│  - Renderiza ProductGrid con datos filtrados                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Client Component (FilterSidebar.tsx)                       │
│  - useSearchParams para leer filtros actuales              │
│  - useRouter para navegar con nuevos params                 │
│  - Solo se renderiza con Suspense boundary                  │
└─────────────────────────────────────────────────────────────┘
```

### Implementación

#### 1. Page Server Component

```tsx
// app/products/page.tsx
import { Suspense } from 'react';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductGrid } from '@/components/ProductGrid';
import { getFilteredProducts } from '@/lib/products';

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string; minPrice?: string; maxPrice?: string; sort?: string }> 
}) {
  const params = await searchParams;
  const products = await getFilteredProducts(params);

  return (
    <div className="flex gap-8">
      <Suspense fallback={<FilterSkeleton />}>
        <FilterSidebar />
      </Suspense>
      <ProductGrid products={products} />
    </div>
  );
}
```

#### 2. FilterSidebar Client Component

```tsx
// components/FilterSidebar.tsx
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export function FilterSidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const currentCategory = searchParams.get('category');
  const currentMinPrice = searchParams.get('minPrice');
  const currentMaxPrice = searchParams.get('maxPrice');

  return (
    <aside className={`w-64 ${isPending ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Filtros</h2>
        <button onClick={clearFilters} className="text-sm text-blue-600">
          Limpiar
        </button>
      </div>

      {/* Categorías */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Categoría</h3>
        <div className="space-y-2">
          {['Electrónica', 'Ropa', 'Hogar'].map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={currentCategory === category.toLowerCase()}
                onChange={() => updateFilter('category', category.toLowerCase())}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Rango de precio */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Precio</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={currentMinPrice || ''}
            onChange={(e) => updateFilter('minPrice', e.target.value || null)}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="number"
            placeholder="Max"
            value={currentMaxPrice || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value || null)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>
    </aside>
  );
}
```

#### 3. Skeleton Loading

```tsx
// components/FilterSkeleton.tsx
export function FilterSkeleton() {
  return (
    <aside className="w-64 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-20 mb-4" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    </aside>
  );
}
```

#### 4. Data Fetching

```tsx
// lib/products.ts
import { cache } from 'react';

export const getFilteredProducts = cache(async (params: {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}) => {
  const searchParams = new URLSearchParams();
  
  if (params.category) searchParams.set('category', params.category);
  if (params.minPrice) searchParams.set('minPrice', params.minPrice);
  if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice);
  if (params.sort) searchParams.set('sort', params.sort);

  const query = searchParams.toString();
  const url = query ? `/api/products?${query}` : '/api/products';
  
  const res = await fetch(url, { 
    next: { revalidate: 60 } // Revalidate cada 60 segundos
  });
  
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
});
```

## Custom Hook para Filtros

```tsx
// hooks/useFilters.ts
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export function useFilters<T extends Record<string, string>>() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const filters = Object.fromEntries(searchParams.entries()) as T;

  const setFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  const setMultipleFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      value ? params.set(key, value) : params.delete(key);
    });
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [pathname, router]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    filters,
    setFilter,
    setMultipleFilters,
    clearFilters,
    hasActiveFilters,
    isPending,
  };
}
```

## Resumen de Optimizaciones

| Práctica | Beneficio |
|----------|-----------|
| **Server Components** | Fetch directo a DB sin API layer, mejor bundle |
| **URL params como estado** | SEO-friendly, shareable, browser navigation funciona |
| **`useTransition`** | UI responsiva, indicador visual durante navegación |
| **Suspense boundary** | Evita hydration errors con useSearchParams |
| **Async searchParams** | Compatible con Next.js 15+ |
| **`cache()` en fetch** | Evita waterfalls, reusa requests |
| **`revalidate`** | ISR para datos que cambian poco |

## NO Hacer

```tsx
// ❌ MAL: Filtros en estado local
const [filters, setFilters] = useState({});
// Problemas: No es shareable, no funciona con browser back/forward, malo para SEO

// ❌ MAL: Client Component que hace fetch
'use client';
function ProductsPage() {
  const [products, setProducts] = useState([]);
  // Problemas: Loading flash, no SSR, peor SEO

// ❌ MAL: Sin Suspense
function Page() {
  return <FilterSidebar />; // Error de hydration
}

// ❌ MAL: Server Action para reads
const action = useActionState(getFilteredProducts);
// Problemas: POST no es cacheable, overhead innecesario
```

## Ejemplo de URL Resultante

```
/productos?category=electronica&minPrice=100&maxPrice=500&sort=price_asc
```

Esta URL es:
- Bookmarkable
- Shareable
- Indexable por Google
- Navegable con browser back/forward


bie ahora vamos a implementarlo en la ruta app/products/page.tsx quiero que se vea a la                                                      
  ┃  izquierda de los productos y que sea un menu desplegable que cuando toques un boton se             
  ┃  despliega hacia la derecha usa las skills de diseÑo disponibles
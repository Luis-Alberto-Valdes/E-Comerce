# Implementación de Filtros - Next.js Best Practices

## Importante: La API no soporta filtros

**Problema:** La API de Strapi no tiene endpoints para filtrar productos.

**Solución:** Se traen todos los productos una vez (con cache) y se filtran en el servidor (Server Component).

**Nota:** Aunque idealmente el filtrado debería ser en la API (para mejor SEO y performance), esta solución es funcional y usa cache para minimizar requests.

---

## Lo que se implementó

### 1. Hook `useFilters` (`frontend/hooks/useFilters.ts`)

```typescript
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  };

  const setFilter = useCallback((key: keyof Filters, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    
    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
  }, [searchParams, pathname, router]);

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [pathname, router]);

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
    isPending,
  };
}
```

**Características:**
- Lee filtros de URL con `useSearchParams`
- Actualiza URL con `useRouter.push`
- Usa `useTransition` para UI responsiva
- Proporciona `isPending` para feedback visual

---

### 2. Función de Fetch `getProducts` + `filterProducts` (`frontend/lib/products.ts`)

```typescript
import { cache } from 'react';
import { ProductsData } from '@/types/strapiApiResponses';

export const getProducts = cache(async (): Promise<ProductsData[]> => {
  // Trae TODOS los productos
  const res = await fetch(`${STRAPI_URL}products?populate=*`, {
    next: { revalidate: 60 }
  });

  return normalizeProducts(data.data);
});

export function filterProducts(products: ProductsData[], filters: ProductFilters): ProductsData[] {
  let filtered = [...products];

  // Filtra por categoría
  if (filters.category) {
    filtered = filtered.filter(p => 
      p.categorie.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  // Filtra por búsqueda
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  // Filtra por precio máximo
  if (filters.maxPrice) {
    const maxPrice = parseFloat(filters.maxPrice);
    if (!isNaN(maxPrice)) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }
  }

  return filtered;
}
```

**Características:**
- `getProducts()`: Trae todos los productos con cache
- `filterProducts()`: Filtra en memoria
- ISR con revalidate cada 60 segundos
- Los productos se cachean, el filtrado es rápido

---

### 3. Page como Server Component (`frontend/app/products/page.tsx`)

```typescript
import { getProducts, filterProducts, ProductFilters } from '@/lib/products';

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // 1. Obtener todos los productos (cached)
  const allProducts = await getProducts();
  
  // 2. Filtrar en el servidor
  const filters: ProductFilters = {
    search: params.search,
    category: params.category,
    maxPrice: params.maxPrice,
  };
  const products = filterProducts(allProducts, filters);

  return (
    <main>
      <Suspense fallback={<FilterSkeleton />}>
        <FilterSidebar />
      </Suspense>
      <ProductGrid products={products} />
    </main>
  );
}
```

**Características:**
- Server Component (sin 'use client')
- Recibe `searchParams` como Promise
- Trae productos una vez, filtra múltiples veces
- Envuelve componentes con `useSearchParams` en Suspense

---

### 4. Componentes de UI

#### FilterSidebar (`frontend/ui/products/FilterSidebar.tsx`)
- Client Component
- Usa `useFilters()` hook
- Muestra filtros actuales
- Botón "Limpiar" condicional

#### FilterDrawer (`frontend/ui/products/FilterDrawer.tsx`)
- Client Component
- Para mobile (drawer desde la izquierda)
- Usa `useFilters()` hook

#### FilterMobile (`frontend/ui/products/FilterMobile.tsx`)
- Client Component
- Maneja estado del drawer
- Renderiza FilterToggle + FilterDrawer

#### FilterSkeleton (`frontend/ui/products/FilterSkeleton.tsx`)
- Skeleton loading para Suspense

---

## Flujo Completo

```
1. Usuario toca "Camisa"
   ↓
2. useFilters.setFilter('category', 'camisa')
   ↓
3. router.push('/products?category=camisa')
   ↓
4. URL cambia → Next.js detecta
   ↓
5. Server Component se re-renderiza
   ↓
6. getProducts() → trae todos (cached)
   ↓
7. filterProducts(allProducts, { category: 'camisa' })
   ↓
8. ProductGrid renderiza productos filtrados
```

---

## Estructura de Archivos

```
frontend/
├── app/
│   └── products/
│       └── page.tsx          ← Server Component
├── hooks/
│   └── useFilters.ts         ← Hook para filtros
├── lib/
│   └── products.ts           ← getProducts() + filterProducts()
└── ui/
    └── products/
        ├── FilterSidebar.tsx     ← Desktop
        ├── FilterDrawer.tsx      ← Mobile
        ├── FilterMobile.tsx      ← Wrapper mobile
        ├── FilterToggle.tsx      ← Botón mobile
        └── FilterSkeleton.tsx     ← Loading state
```

---

## Beneficios

| Aspecto | Beneficio |
|---------|-----------|
| **SEO** | URLs indexables: `/products?category=camisa` |
| **SSR** | HTML completo desde el servidor |
| **Cache** | Productos cacheados con `cache()` |
| **UX** | useTransition + isPending |
| **Shareable** | URL compartible |
| **Responsive** | Sidebar en desktop, drawer en mobile |

---

## URLs de Ejemplo

```
/products                           ← Sin filtros
/products?category=camisa           ← Filtrado por categoría
/products?maxPrice=500              ← Filtrado por precio
/products?search=rojo               ← Búsqueda
/products?category=camisa&maxPrice=500 ← Combinado
```

---

## Para Mejorar (Futuro)

Si Strapi se configura para soportar filtros:

1. Agregar endpoint `/api/products?filters[category][$eq]=camisa`
2. Modificar `getProducts()` para pasar filtros directamente a Strapi
3. Filtrado en servidor (API) en lugar de en memoria

Esto mejoraría:
- Performance (menos datos transferidos)
- SEO (Google recibiría HTML filtrado directamente)

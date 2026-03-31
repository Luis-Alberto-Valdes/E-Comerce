# Sistema de Filtros en Next.js - Guía Completa

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR (Usuario)                                 │
│                                                                             │
│   Usuario toca "Camisa" → URL cambia → Productos se actualizan              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SERVER COMPONENT (page.tsx)                              │
│                                                                             │
│   1. Recibe searchParams de la URL                                        │
│   2. Hace fetch a la API/DB con los filtros                               │
│   3. Retorna HTML completo (SSR)                                           │
│   4. Se cachea automáticamente por query string                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   CLIENT COMPONENT (FilterSidebar)                          │
│                                                                             │
│   1. Lee los filtros actuales de la URL (useSearchParams)                  │
│   2. Proporciona UI para cambiar filtros                                   │
│   3. Actualiza la URL (useRouter.push)                                    │
│   4. Usa useTransition para UI responsiva                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Flujo Paso a Paso

### Paso 1: Usuario interactúa con un filtro

```
Usuario toca "Camisa" en los radio buttons
    ↓
Se dispara onChange
    ↓
```

### Paso 2: Hook actualiza la URL

```typescript
// hooks/useFilters.ts
const setFilter = (key: string, value: string | null) => {
  const params = new URLSearchParams(searchParams.toString());
  value ? params.set(key, value) : params.delete(key);
  
  startTransition(() => {
    router.push(`${pathname}?${params.toString()}`);
  });
};
```

**URL cambia de:** `/products` → `/products?category=camisa`

### Paso 3: Next.js detecta el cambio

```
URL cambió
    ↓
Next.js detecta el cambio en searchParams
    ↓
Server Component se re-renderiza con los nuevos params
    ↓
```

### Paso 4: Server Component hace fetch con filtros

```typescript
// app/products/page.tsx
export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string; maxPrice?: string; search?: string }> 
}) {
  // Await los searchParams (Next.js 15+)
  const params = await searchParams;
  
  // Fetch con los filtros
  const products = await getFilteredProducts(params);
  
  return <ProductGrid products={products} />;
}
```

### Paso 5: Productos se renderizan

```typescript
// lib/products.ts
import { cache } from 'react';

export const getFilteredProducts = cache(async (filters: {
  category?: string;
  maxPrice?: string;
  search?: string;
}) => {
  // Construir query string
  const query = new URLSearchParams();
  if (filters.category) query.set('category', filters.category);
  if (filters.maxPrice) query.set('maxPrice', filters.maxPrice);
  if (filters.search) query.set('search', filters.search);
  
  // Fetch a tu API
  const res = await fetch(
    `http://localhost:1337/api/products?${query.toString()}`,
    { next: { revalidate: 60 } }
  );
  
  return res.json();
});
```

## Beneficios de este Enfoque

| Beneficio | Descripción |
|-----------|-------------|
| **SEO** | Google indexa `/products?category=camisa` |
| **Shareable** | Usuario comparte URL y otros ven lo mismo |
| **Browser Navigation** | Back/Forward del navegador funciona |
| **SSR** | HTML completo en primera carga |
| **Caching** | Next.js cachea por query string automáticamente |
| **UX** | `useTransition` da feedback visual durante carga |

## Implementación en tu Proyecto

### 1. Crear el Hook

```typescript
// frontend/hooks/useFilters.ts
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

  const setFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
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

### 2. Actualizar FilterSidebar

```typescript
// frontend/ui/products/FilterSidebar.tsx
'use client';

import { useFilters } from '@/hooks/useFilters';
import styles from './FilterSidebar.module.css';

export default function FilterSidebar() {
  const { filters, setFilter, clearFilters, hasActiveFilters } = useFilters();

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h2 className={styles.title}>Filtros</h2>
        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearBtn}>
            Limpiar
          </button>
        )}
      </header>

      <div className={styles.content}>
        {/* Buscador */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Buscar</h3>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Buscar productos..."
            className={styles.searchInput}
          />
        </div>

        {/* Categorías */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Categoría</h3>
          <div className={styles.radioGroup}>
            {[
              { label: 'Todas', value: '' },
              { label: 'Camisa', value: 'camisa' },
              { label: 'Pantalon', value: 'pantalon' },
              { label: 'Guantes', value: 'guantes' },
            ].map((cat) => (
              <label key={cat.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={filters.category === cat.value}
                  onChange={() => setFilter('category', cat.value)}
                />
                <span className={styles.radioMark} />
                <span className={styles.labelText}>{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Precio máximo */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Precio máximo</h3>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilter('maxPrice', e.target.value)}
            placeholder="Ej: 500"
            className={styles.priceInput}
          />
        </div>
      </div>
    </aside>
  );
}
```

### 3. Actualizar page.tsx (Server Component)

```typescript
// frontend/app/products/page.tsx
import { Suspense } from 'react';
import FilterSidebar from '@/ui/products/FilterSidebar';
import FilterToggle from '@/ui/products/FilterToggle';
import FilterDrawer from '@/ui/products/FilterDrawer';
import { getFilteredProducts } from '@/lib/products';
import styles from './page.module.css';

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string; maxPrice?: string; search?: string }> 
}) {
  const params = await searchParams;
  const products = await getFilteredProducts(params);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h2>Productos</h2>
        <p>Explora nuestra colección curada con un diseño moderno.</p>
      </section>

      <div className={styles.content}>
        {/* Desktop: Sidebar visible */}
        <Suspense fallback={<FilterSkeleton />}>
          <FilterSidebar />
        </Suspense>

        <section className={styles.main}>
          {/* Mobile: Botón para abrir drawer */}
          <div className={styles.mobileHeader}>
            <FilterToggle />
            <span className={styles.resultCount}>
              {products.length} productos
            </span>
          </div>

          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function FilterSkeleton() {
  return (
    <aside className={styles.filterSkeleton}>
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-20 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </aside>
  );
}
```

### 4. Actualizar ProductDrawer (Mobile)

```typescript
// frontend/ui/products/FilterDrawer.tsx
'use client';

import { useFilters } from '@/hooks/useFilters';
import styles from './FilterDrawer.module.css';

export default function FilterDrawer({ onClose }: { onClose: () => void }) {
  const { filters, setFilter, clearFilters } = useFilters();

  const handleApply = () => {
    onClose();
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer}>
        {/* ... mismo contenido que FilterSidebar ... */}
        
        <footer className={styles.footer}>
          <button onClick={clearFilters} className={styles.clearBtn}>
            Limpiar
          </button>
          <button onClick={handleApply} className={styles.applyBtn}>
            Ver resultados
          </button>
        </footer>
      </aside>
    </>
  );
}
```

### 5. Función de fetch con cache

```typescript
// frontend/lib/products.ts
import { cache } from 'react';

interface Filters {
  category?: string;
  maxPrice?: string;
  search?: string;
}

export const getFilteredProducts = cache(async (filters: Filters) => {
  const query = new URLSearchParams();
  
  if (filters.category) query.set('category', filters.category);
  if (filters.maxPrice) query.set('maxPrice', filters.maxPrice);
  if (filters.search) query.set('search', filters.search);

  const res = await fetch(
    `http://localhost:1337/api/products?${query.toString()}`,
    { 
      next: { revalidate: 60 } // Revalidar cada 60 segundos
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
});
```

## Indicador de Carga

Para mostrar feedback visual mientras se cargan los productos:

```typescript
// En page.tsx
import { useProduct } from '@/context/ProductContext';

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
```

El indicador de carga se maneja automáticamente por Next.js con:
- Suspense boundaries
- Streaming SSR
- Optimistic UI con `useTransition`

## URLs de Ejemplo

| Acción | URL Resultante |
|--------|----------------|
| Sin filtros | `/products` |
| Filtrar por camisa | `/products?category=camisa` |
| Precio máximo $500 | `/products?maxPrice=500` |
| Buscar "rojo" | `/products?search=rojo` |
| Combinado | `/products?category=camisa&maxPrice=500&search=rojo` |

## Errores Comunes a Evitar

```typescript
// ❌ NO guardes filtros en useState
const [filters, setFilters] = useState({});
// Problema: No es shareable, no funciona back/forward, malo para SEO

// ❌ NO guardes productos filtrados en Context
// El Server Component ya tiene los productos filtrados

// ❌ NO uses Server Action para leer filtros
// Server Actions son para mutations (POST), no reads (GET)

// ❌ NO olvides el Suspense boundary
// useSearchParams requiere Suspense en Server Components
```

## Resumen Final

```
┌─────────────────────────────────────────────────────────────────┐
│                         JERARQUÍA                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   app/products/page.tsx (Server Component)                      │
│   ├── Recibe searchParams                                      │
│   ├── Hace fetch con filtros                                   │
│   ├── Renderiza productos                                      │
│   └── Envuelve en Suspense                                     │
│          │                                                      │
│          ▼                                                      │
│   ui/products/FilterSidebar.tsx (Client Component)              │
│   ├── Hook useFilters()                                        │
│   ├── Lee filtros de URL                                       │
│   └── Actualiza URL con router.push                            │
│          │                                                      │
│          ▼                                                      │
│   hooks/useFilters.ts                                           │
│   ├── useSearchParams (leer)                                   │
│   ├── useRouter (navegar)                                      │
│   └── useTransition (UX responsiva)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

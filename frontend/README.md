# Frontend Documentation

## Visión general

El frontend es una aplicación Next.js 16 con App Router y React 19. Está diseñada para:

- renderizar páginas estáticas y dinámicas del catálogo de productos
- consumir datos de Strapi
- manejar un carrito de compras persistente en el cliente
- orquestar el checkout mediante Shopify

## Estructura de carpetas

- `frontend/app/`: páginas y rutas de Next.js.
- `frontend/ui/`: componentes UI reutilizables.
- `frontend/context/`: estado global del carrito con Zustand.
- `frontend/hooks/`: hooks personalizados (por ejemplo filtros URL).
- `frontend/services/`: acceso a Strapi.
- `frontend/lib/`: integración con Shopify.
- `frontend/types/`: tipos TypeScript de respuestas Strapi.
- `frontend/tests/`: pruebas E2E en Playwright.

## Páginas importantes

- `frontend/app/page.tsx`
  - Entrada principal de la home.
  - Renderiza `Home` como Server Component.

- `frontend/app/products/page.tsx`
  - Lista los productos obtenidos de Strapi.
  - Usa `FilterSidebar` y `ProductGrid`.

- `frontend/app/products/[id]/page.tsx`
  - Página dinámica de detalle de producto.
  - Busca variantes usando `slug`.

- `frontend/app/cart/page.tsx`
  - Página del carrito que consume `useCartStore`.
  - Maneja operaciones de cantidad, eliminación y checkout.

## Consumo de datos

### Strapi

- `frontend/services/getComponentsFromStrapi.ts` es el cliente REST principal.
- Usa `STRAPI_API_URL` y `STRAPI_API_TOKEN`.
- Implementa:
  - `getHomeData()`
  - `getNavBarData()`
  - `getProductData()`

### Caché

- Cada función usa `unstable_cache` de Next.js.
- Revalidation configurado a 300 segundos.
- Mejora el rendimiento evitando fetch innecesarios.

## Estado del carrito

- `frontend/context/cartStore.ts` usa `zustand` con `persist`.
- El store define:
  - `items`
  - `addItem`
  - `removeItem`
  - `updateQuantity`
  - `clearCart`
  - `getTotalItems`
  - `getTotalPrice`
- El ID del item se construye desde `slug`, `color` y `size`.

## Checkout y Shopify

- `frontend/lib/shopify.ts` implementa `shopifyFetch()` y `createCheckout()`.
- `frontend/app/api/checkout/route.ts` valida con Zod y crea un `draft_order` en la API Admin de Shopify.

### Flujo de checkout

1. El cliente envía `POST /api/checkout` con `lineItems`.
2. La ruta API valida datos con `CheckoutSchema`.
3. Si la configuración es correcta, se crea un draft order en Shopify.
4. Se devuelve `invoiceUrl` para redirigir al usuario.

## Validación y tipos

- `Zod` se usa en `frontend/app/api/checkout/route.ts`.
- `frontend/types/strapiApiResponses.ts` define:
  - `HomeData`
  - `NavBarData`
  - `ProductsData`
  - `Variants`

## Hooks y UX

- `frontend/hooks/useFilters.ts` maneja:
  - filtros por búsqueda, categoría y precio máximo
  - actualización de query string sin recargar
  - restauración de scroll con `sessionStorage`
  - debounce en búsqueda

## Metadata y SEO

- `frontend/app/sitemap.ts` genera sitemap dinámico usando productos cargados de Strapi.
- `frontend/app/robots.ts` configura el archivo `robots.txt`.

## Testing

- Las pruebas E2E están en `frontend/tests/`.
- Se valida flujo de checkout, páginas de producto, carrito y manejo de errores.
- Comando:

```bash
cd frontend
npm run test:e2e
```

## Scripts principales

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test:e2e
```

## Tips de desarrollo

- Mantener `frontend/services/getComponentsFromStrapi.ts` como única capa de fetch a Strapi.
- Agregar nuevos componentes en `frontend/ui/` y páginas en `frontend/app/`.
- Siempre tipar la data con `ProductsData` y `Variants`.
- Validar `lineItems` antes de invocar `/api/checkout`.

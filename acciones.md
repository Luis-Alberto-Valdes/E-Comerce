# Acciones Realizadas - Tests E2E Playwright

## Fecha
2026-04-10

## Resumen
Se crearon tests E2E para el e-commerce Next.js con Playwright.

## Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `tests/home.spec.js` | Tests homepage (título, descripción, botón navegación) |
| `tests/products.spec.js` | Tests /products (filtros search, category, maxPrice, grid, empty state) |
| `tests/product-detail.spec.js` | Tests /products/[id] (detalle, variants color/size, back link, 404) |
| `tests/cart.spec.js` | Tests /cart (empty state, add, remove, quantity +/-, clear, persistencia) |
| `tests/checkout.spec.js` | Tests checkout con mock de Shopify API |
| `tests/errors-edge-cases.spec.js` | Tests edge cases (404, error boundary, loading, filtros) |

## Tests Totales
- **32 tests** ejecutados
- **32 passed** ✅

## Cambios en el Proyecto

### Accessibility Mejorada
- `frontend/ui/products/FilterSidebar.tsx`: Agregado `id` y `htmlFor` en inputs de search y maxPrice
- `frontend/ui/products/[id]/Producto.tsx`: Agregado `id` y `htmlFor` en selects de color y size

### Configuración Actualizada
- `playwright.config.js`: Configurado baseURL, webServer para Next.js, reporter HTML

## Patrones Usados (de skills Playwright)
- getByRole() / getByLabel() para selectores
- Web-first assertions: expect(locator).toBeVisible()
- Un comportamiento por test
- Mock de API externa (Shopify) en checkout

## Notas
- Strapi: NO mockeado (datos reales)
- Shopify: MOCKEADO (api/checkout)
- Tests cubren toda la priority list de instruction.md
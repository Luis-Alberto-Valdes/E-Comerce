# Backend Documentation

## Visión general

El backend es una aplicación Strapi 5 que expone contenido headless y campos personalizados de Shopify.

## Estructura de carpetas

- `backend/src/api/`: APIs y content types.
- `backend/config/`: configuración del servidor y base de datos.
- `backend/package.json`: dependencias y scripts.

## Modelos y contenido

### `home`
- Tipo: `singleType`
- Campos:
  - `titulo` (string)
  - `description` (text)
  - `productos` (component `navegacion.boton`)
- Archivo: `backend/src/api/home/content-types/home/schema.json`

### `barra-de-navegacion`
- Tipo: `singleType`
- Campos:
  - `logo` (blocks)
- Archivo: `backend/src/api/barra-de-navegacion/content-types/barra-de-navegacion/schema.json`

### `product-shopify`
- Tipo: `collectionType`
- Campos:
  - `product` (custom field `plugin::shopify.product`)
- Archivo: `backend/src/api/product-shopify/content-types/product-shopify/schema.json`

## APIs Strapi

Strapi genera routers, controllers y servicios básicos usando factories.

- `backend/src/api/home/routes/home.ts`
- `backend/src/api/barra-de-navegacion/routes/barra-de-navegacion.ts`
- `backend/src/api/product-shopify/routes/product-shopify.ts`
- `backend/src/api/product/routes/product.ts`

### Customización

Los services y controllers usan `factories.createCoreService` y `factories.createCoreController`.
No hay lógica personalizada adicional dentro de los servicios cargados actualmente.

## Configuración de Strapi

### `backend/config/server.ts`
- Host: `HOST` o `0.0.0.0`
- Puerto: `PORT` o `1337`
- Clave de aplicación `APP_KEYS`

### `backend/config/database.ts`
- Client configurable con `DATABASE_CLIENT`.
- Soporta `sqlite`, `postgres` y `mysql`.
- Variables adicionales usadas:
  - `DATABASE_URL`
  - `DATABASE_HOST`
  - `DATABASE_PORT`
  - `DATABASE_NAME`
  - `DATABASE_USERNAME`
  - `DATABASE_PASSWORD`
  - `DATABASE_SSL`

## Shopify

El backend incorpora `@strapi-community/shopify` y define un custom field Shopify dentro del content-type `product-shopify`.

Esto permite almacenar productos existentes de Shopify directamente en Strapi y exponerlos como contenido para el frontend.

## Base de datos

- Por defecto el backend puede usar `sqlite` con `backend/.tmp/data.db`.
- La configuración es flexible y permite migrar a Postgres o MySQL.

## Seguridad y permisos

- Strapi puede usar `@strapi/plugin-users-permissions`.
- El acceso del frontend a Strapi depende de `STRAPI_API_TOKEN`.
- El checkout Shopify usa `SHOPIFY_API_ADMIN_ACCESS_TOKEN` desde el frontend server-side.

## Despliegue

### Comandos

```bash
cd backend
npm install
npm run dev
npm run build
npm run start
```

### Variables de entorno críticas

| Variable | Descripción |
|---|---|
| `HOST` | Host Strapi |
| `PORT` | Puerto de aplicación |
| `APP_KEYS` | Claves secretas de Strapi |
| `DATABASE_CLIENT` | Cliente DB (`sqlite`, `postgres`, `mysql`) |
| `DATABASE_URL` | Cadena de conexión Postgres |
| `DATABASE_HOST` | Host DB |
| `DATABASE_PORT` | Puerto DB |
| `DATABASE_NAME` | Nombre de la DB |
| `DATABASE_USERNAME` | Usuario DB |
| `DATABASE_PASSWORD` | Contraseña DB |

## Extensiones futuras

- Agregar un nuevo modelo Strapi en `backend/src/api/`.
- Usar `plugin::shopify.product` para mapear más campos de Shopify.
- Añadir lógica personalizada a controllers o servicios si se requiere business logic.
- Ejecutar migraciones de contenido desde Strapi para mantener consistencia.

## Good practices

- Mantener `backend/config/database.ts` como única fuente de verdad para DB.
- No mezclar lógica de negocio en `frontend` con los content types de Strapi.
- Si se añade un nuevo content-type, exponerlo con un nuevo endpoint de Strapi y actualizar `frontend/services/getComponentsFromStrapi.ts`.

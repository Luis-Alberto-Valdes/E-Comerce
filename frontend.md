## 1.Tecnologias usadas
- Next.js 16+: Como framework web
- Typescrypt: Para el tipado
- zod: Validacion de los datos
- clsx: Para la gestion dinamica de clases
- zustand: Para la gestion de estado
- estilos con css modules


## 2.Cosas a tener en cuenta
- Todo lo aqui dicho sera valido solo para la carpeta frontend del proyecto y cuando nos referimos a terminos como raiz del proyecto o similares nos referimos solo a esta carpeta frontend
- No ejecutaras comandos de terminal a no ser que se te lo pida
- Cualquier cosa que vallas a implementar que no este en el prompt inicial me lo preguntas para dar el okay, modificarlo o descartarlo
- Los componentes se crean a partir de la api de strapi enlazes que se proporcionaran en el archivo getComponentsFromStrapi.ts en la carpeta services en la raiz del proyecto

## 3. Estructura basica del proyecto
- Este es un ejemplo de la estructura base del proyecto y de como debes organizar los archivos

frontend(carpeta raiz)
 -app
    -login
        -page.module.css
        -page.tsx
        -loading.tsx
        -error.tsx
    -layout.tsx
    -page.tsx
    -global.css
 -ui
 -hooks
 -context
 -services
 -public


## 3.1 Explicacion de la estructura del proyecto
app: Aqui crearas los componentes basandote en la directiva de nextjs 16¡+ y organizados por rutas, cada carpeta dentro de app representa una ruta en la aplicacion, por ejemplo la carpeta login representa la ruta /login, dentro de cada carpeta de ruta se encuentran los archivos page.tsx que es el componente principal de esa ruta, page.module.css para los estilos especificos de esa ruta, loading.tsx para mostrar un componente mientras se carga la pagina y error.tsx para mostrar un componente en caso de error al cargar la pagina.

ui: Aqui se encuentran los componentes reutilizables de la aplicacion, como botones, formularios, etc. Estos componentes se crean a partir de la api de strapi

hooks: Aqui se encuentran los hooks personalizados que se utilizan en la aplicacion, como por ejemplo para manejar el estado de autenticacion, para hacer peticiones a la api, etc.

context: Aqui se encuentran los contextos de la aplicacion que se manejaran con zustand, como por ejemplo el contexto de autenticacion, el contexto de temas, etc.

services: Aqui se encuentran los servicios que se encargan de hacer las peticiones a la api, como por ejemplo el servicio de autenticacion, el servicio de usuarios, etc.

public: Aqui se encuentran los archivos publicos de la aplicacion, como por ejemplo las imagenes, los iconos, etc.


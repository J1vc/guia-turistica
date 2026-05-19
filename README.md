# Guia Turistica

Proyecto React compatible con Vite y Vercel.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de produccion

```bash
npm run build
```

## Configuracion en Vercel

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

El archivo `vercel.json` ya incluye estas opciones y una regla de rewrite para que la aplicacion funcione como SPA.

## Base de datos

La aplicacion incluye una capa de datos en `src/database.js`.

Sin configurar variables de entorno, funciona con almacenamiento local del navegador para probar:

- Registro e inicio de sesion.
- Favoritos.
- Comentarios y calificaciones.

Para usar Supabase:

1. Crea un proyecto en Supabase.
2. Ejecuta el SQL de `database/supabase-schema.sql` en el SQL Editor.
3. Copia `.env.example` como `.env.local`.
4. Completa:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_publica
```

En Vercel agrega esas mismas variables en Project Settings > Environment Variables.

La autenticacion en nube usa Supabase Auth. En Supabase, si quieres que el registro entre inmediatamente a la app durante pruebas, desactiva temporalmente la confirmacion por email en Authentication > Providers > Email. Para produccion, puedes dejar la confirmacion activada.

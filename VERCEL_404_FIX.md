# Solución para Error 404 en Vercel

## Problema
El deployment está "Ready" pero al abrir la página muestra error 404 NOT_FOUND.

## Cambios Realizados

### 1. Corrección en `app/page.tsx`
- ❌ **Antes**: Usaba `NextPage` de Pages Router (incompatible con App Router)
- ✅ **Ahora**: Usa función export default estándar de App Router

### 2. Configuración de Next.js
- ✅ Next.js 15.2.6 (versión estable)
- ✅ Turbopack configurado
- ✅ Webpack configurado para compatibilidad

## Verificación en Vercel Dashboard

### Paso 1: Verificar Build Settings
Ve a **Settings → Build & Development Settings** y verifica:

**Root Directory:**
```
packages/nextjs
```

**Build Command:**
```
yarn build
```

**Install Command:**
```
cd ../.. && yarn install
```

**Output Directory:**
```
.next
```

### Paso 2: Verificar Variables de Entorno
Ve a **Settings → Environment Variables** y verifica que no haya variables que puedan causar problemas.

### Paso 3: Verificar Framework Preset
En **Settings → General → Framework Preset**, debe estar:
```
Next.js
```

### Paso 4: Redeploy
1. Ve a **Deployments**
2. Haz clic en el deployment más reciente
3. Haz clic en **"Redeploy"** (menú de 3 puntos)
4. Espera a que termine el build

## Si el problema persiste

### Opción A: Verificar Build Logs
1. Ve a **Deployments → [Tu deployment] → Build Logs**
2. Busca errores relacionados con:
   - Routing
   - Metadata
   - Client/Server components

### Opción B: Verificar que el archivo existe
Asegúrate de que existe:
- ✅ `packages/nextjs/app/page.tsx`
- ✅ `packages/nextjs/app/layout.tsx`

### Opción C: Forzar nuevo deployment
```bash
git commit --allow-empty -m "force redeploy"
git push origin main
```

## Estructura Correcta de App Router

```
packages/nextjs/app/
├── layout.tsx          # Server Component (puede exportar metadata)
├── page.tsx            # Client Component (usa "use client")
└── ...
```

## Notas Importantes

1. **App Router vs Pages Router**: Este proyecto usa **App Router** (carpeta `app/`), no Pages Router
2. **Metadata**: Solo se exporta en `layout.tsx` (server component)
3. **Client Components**: Usan `"use client"` al inicio del archivo
4. **No usar NextPage**: Es solo para Pages Router, no App Router



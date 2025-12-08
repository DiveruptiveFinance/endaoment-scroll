# 🔧 Arreglar Error: Root Directory no existe

## ⚠️ Error
```
The specified Root Directory "packages/nextjs" does not exist.
```

## ✅ SOLUCIÓN

El problema es que Vercel está buscando `packages/nextjs` pero puede que:
1. La carpeta no esté en GitHub (está en .gitignore)
2. El Root Directory esté mal escrito

### Paso 1: Verificar en GitHub

Ve a: https://github.com/DiveruptiveFinance/endaoment-scroll/tree/main/packages

¿Ves la carpeta `nextjs` ahí?

- ✅ Si la ves → El problema es la configuración en Vercel
- ❌ Si NO la ves → La carpeta no está en GitHub

### Paso 2: Si NO está en GitHub

```bash
# Agregar la carpeta nextjs a Git
git add packages/nextjs
git commit -m "add nextjs folder to git"
git push origin main
```

### Paso 3: Verificar Root Directory en Vercel

1. Ve a **Settings** → **General**
2. En **Root Directory**, debe decir exactamente: `packages/nextjs`
3. **NO** debe tener:
   - Espacios extra
   - `/` al inicio
   - `/` al final
   - Mayúsculas diferentes

### Paso 4: Si sigue el error

**Opción A: Usar raíz del proyecto**

1. En Settings → General
2. **Root Directory**: Déjalo **VACÍO** (borra `packages/nextjs`)
3. En Build Settings, cambia:
   - **Build Command**: `cd packages/nextjs && yarn install && yarn build`
   - **Output Directory**: `packages/nextjs/.next`
   - **Install Command**: `yarn install`

**Opción B: Verificar estructura en GitHub**

Asegúrate de que en GitHub la estructura sea:
```
endaoment-scroll/
  packages/
    nextjs/
      package.json
      ...
```

---

## 🎯 Configuración Correcta

### Settings → General
- **Root Directory**: `packages/nextjs` (sin espacios, sin / al inicio/final)

### Settings → Build & Development Settings
- **Build Command**: `cd ../.. && yarn install && yarn next:build`
- **Output Directory**: `.next`
- **Install Command**: `cd ../.. && yarn install`

---

## ✅ Verificar

1. Ve a GitHub: https://github.com/DiveruptiveFinance/endaoment-scroll
2. Click en "packages"
3. Debe aparecer la carpeta "nextjs"
4. Click en "nextjs"
5. Debe aparecer "package.json"

Si NO aparece, necesitas agregarla a Git.


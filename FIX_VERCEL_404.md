# 🔧 Arreglar Error 404 en Vercel

## ⚠️ Problema
Vercel desplegó el proyecto pero muestra **404: NOT_FOUND**. Esto es porque no detectó correctamente el monorepo.

## ✅ SOLUCIÓN RÁPIDA (3 pasos)

### Paso 1: Ir a Settings del Proyecto

1. En Vercel Dashboard, ve a tu proyecto: **endaoment-scroll2**
2. Click en **"Settings"** (arriba a la derecha)
3. Click en **"General"** (menú izquierdo)

### Paso 2: Configurar Root Directory

En la sección **"Root Directory"**:

1. Click en **"Edit"**
2. Marca la casilla **"Override"**
3. Escribe: `packages/nextjs`
4. Click **"Save"**

### Paso 3: Configurar Build Settings

En la misma página, busca **"Build & Development Settings"**:

1. **Framework Preset**: `Next.js`
2. **Root Directory**: `packages/nextjs` (debe estar ya configurado)
3. **Build Command**: `cd ../.. && yarn install && yarn next:build`
4. **Output Directory**: `.next`
5. **Install Command**: `cd ../.. && yarn install`

### Paso 4: Agregar Environment Variables

1. En Settings, click en **"Environment Variables"** (menú izquierdo)
2. Agrega estas variables:

```
NEXT_PUBLIC_ALCHEMY_API_KEY
Valor: cR4WnXePioePZ5fFrnSiR
Environment: Production, Preview, Development (marca todas)

NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
Valor: 3a8170812b534d0ff9d794f19a901d64
Environment: Production, Preview, Development (marca todas)
```

3. Click **"Save"** para cada una

### Paso 5: Redeploy

1. Ve a la pestaña **"Deployments"**
2. Click en los **3 puntos** del último deployment
3. Click **"Redeploy"**
4. O simplemente haz un nuevo push a GitHub:

```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

---

## 📋 Configuración Completa en Vercel

### Settings → General

- **Root Directory**: `packages/nextjs` ✅
- **Framework Preset**: `Next.js` ✅

### Settings → Build & Development Settings

```
Build Command: cd ../.. && yarn install && yarn next:build
Output Directory: .next
Install Command: cd ../.. && yarn install
```

### Settings → Environment Variables

```
NEXT_PUBLIC_ALCHEMY_API_KEY = cR4WnXePioePZ5fFrnSiR
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = 3a8170812b534d0ff9d794f19a901d64
```

---

## 🎯 Verificar que Funciona

Después del redeploy:

1. Espera 2-3 minutos
2. Ve a tu URL: `https://endaoment-scroll2.vercel.app`
3. Debe mostrar el frontend (no el 404)
4. Puedes conectar tu wallet

---

## 🐛 Si Sigue el Error 404

### Opción A: Revisar Build Logs

1. Ve a **"Deployments"**
2. Click en el último deployment
3. Click en **"Build Logs"**
4. Revisa si hay errores

### Opción B: Verificar que el código está en GitHub

```bash
# Verifica que el código está en GitHub
git remote -v
# Debe mostrar: https://github.com/DiveruptiveFinance/endaoment-scroll.git

# Verifica que hiciste push
git log --oneline -5
```

### Opción C: Eliminar y Recrear el Proyecto

Si nada funciona:

1. En Vercel, ve a **Settings** → **General**
2. Scroll hasta abajo
3. Click **"Delete Project"**
4. Vuelve a crear el proyecto desde GitHub
5. **Esta vez**, cuando importes, configura:
   - Root Directory: `packages/nextjs`
   - Build Command: `cd ../.. && yarn install && yarn next:build`

---

## ✅ Checklist Final

- [ ] Root Directory configurado: `packages/nextjs`
- [ ] Build Command: `cd ../.. && yarn install && yarn next:build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `cd ../.. && yarn install`
- [ ] Environment Variables agregadas
- [ ] Redeploy realizado
- [ ] App carga correctamente (no 404)

---

**¡Después de estos pasos, tu app debería funcionar! 🚀**


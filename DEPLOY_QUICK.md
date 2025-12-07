# 🚀 DEPLOY RÁPIDO - GitHub + Vercel

## ⚡ RUTA RÁPIDA (5 minutos)

### Paso 1: Preparar para GitHub

```bash
# Desde la raíz del proyecto
cd C:\Users\jcmb_\endaoment

# Verificar que no hay archivos sensibles
git status

# Si hay cambios, agregarlos
git add .

# Commit
git commit -m "feat: Scroll Hackathon pivot - Lossless Donation Protocol"
```

### Paso 2: Subir a GitHub

```bash
# Si ya tienes un repo remoto
git remote -v

# Si NO tienes repo, crea uno en GitHub primero:
# 1. Ve a: https://github.com/new
# 2. Crea repositorio (ej: "endaoment-scroll")
# 3. NO inicialices con README

# Agregar remote (reemplaza TU_USUARIO y REPO_NAME)
git remote add origin https://github.com/TU_USUARIO/REPO_NAME.git

# O si ya existe, actualiza la URL:
git remote set-url origin https://github.com/TU_USUARIO/REPO_NAME.git

# Push
git branch -M main
git push -u origin main
```

### Paso 3: Desplegar en Vercel

#### Opción A: Desde Vercel Dashboard (MÁS FÁCIL)

1. **Ve a**: https://vercel.com/new
2. **Importa tu repositorio** de GitHub
3. **Configuración**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `packages/nextjs`
   - **Build Command**: `cd ../.. && yarn install && yarn next:build`
   - **Output Directory**: `.next`
   - **Install Command**: `yarn install`

4. **Environment Variables** (agregar):
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY=tu_key
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=tu_project_id
   ```

5. **Deploy** → ¡Listo!

#### Opción B: Desde CLI

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Login
vercel login

# Desde la raíz del proyecto
cd packages/nextjs
vercel

# Sigue las instrucciones:
# - Link to existing project? No
# - Project name: endaoment-scroll
# - Directory: ./
# - Override settings? No
```

---

## 📋 CHECKLIST PRE-DEPLOY

### ✅ Antes de subir a GitHub

- [ ] Verificar `.gitignore` incluye:
  - `node_modules/`
  - `.env*`
  - `deployments/` (opcional, pero recomendado)
  - `.next/`

- [ ] NO subir archivos sensibles:
  - `packages/hardhat/.env`
  - `packages/nextjs/.env.local`
  - Claves privadas

- [ ] Verificar que compila:
  ```bash
  yarn hardhat:compile
  yarn next:build
  ```

### ✅ Variables de Entorno para Vercel

Agregar en Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_ALCHEMY_API_KEY=cR4WnXePioePZ5fFrnSiR
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=3a8170812b534d0ff9d794f19a901d64
```

---

## 🔧 Configuración de Vercel (Importante)

### vercel.json (ya existe en packages/nextjs/)

El proyecto ya tiene `vercel.json` configurado. Verifica que existe:

```json
{
  "buildCommand": "cd ../.. && yarn install && yarn next:build",
  "outputDirectory": ".next",
  "installCommand": "yarn install"
}
```

### Si necesitas crear/actualizar vercel.json:

```bash
# En packages/nextjs/vercel.json
```

---

## 🎯 COMANDOS RÁPIDOS

### Todo en uno (desde raíz):

```bash
# 1. Verificar estado
git status

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "feat: Deploy to Vercel"

# 4. Push a GitHub
git push origin main

# 5. Vercel detectará cambios automáticamente y redeployará
```

---

## 🐛 Troubleshooting

### Error: "Build failed"
- Verifica que `yarn next:build` funciona localmente
- Revisa logs en Vercel Dashboard

### Error: "Module not found"
- Asegúrate de que `yarn install` se ejecuta correctamente
- Verifica que todas las dependencias están en `package.json`

### Error: "Environment variables missing"
- Agrega variables en Vercel Dashboard → Settings → Environment Variables
- Reinicia el deployment después de agregar variables

---

## 📝 NOTAS IMPORTANTES

1. **Monorepo**: Vercel necesita saber que es un monorepo
   - Root Directory: `packages/nextjs`
   - Build Command debe incluir `cd ../..` para ir a la raíz

2. **Contratos**: Los contratos desplegados están en `packages/nextjs/contracts/deployedContracts.ts`
   - Este archivo se genera automáticamente después de `yarn deploy`
   - Para producción, necesitas desplegar contratos a Scroll Sepolia primero

3. **Auto-deploy**: Vercel redeployará automáticamente cuando hagas push a `main`

---

## ✅ VERIFICACIÓN POST-DEPLOY

1. **Visita tu URL de Vercel**: `https://tu-proyecto.vercel.app`
2. **Verifica que carga**: Debe mostrar el frontend
3. **Conecta wallet**: Prueba conectar MetaMask
4. **Verifica red**: Debe estar configurada para Scroll Sepolia

---

## 🚀 LISTO!

Tu app estará en: `https://tu-proyecto.vercel.app`

**Próximos pasos**:
1. Desplegar contratos a Scroll Sepolia
2. Actualizar `deployedContracts.ts` con direcciones reales
3. Redeployar en Vercel


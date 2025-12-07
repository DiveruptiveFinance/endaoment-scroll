# ⚡ COMANDOS RÁPIDOS - Copy & Paste

## 🚀 DEPLOY EN 3 PASOS

### PASO 1: Subir a GitHub

```bash
# Desde la raíz del proyecto
cd C:\Users\jcmb_\endaoment

# Agregar todos los cambios
git add .

# Commit
git commit -m "feat: Scroll Hackathon - Lossless Donation Protocol"

# Si NO tienes repo en GitHub, créalo primero:
# 1. Ve a: https://github.com/new
# 2. Nombre: endaoment-scroll
# 3. NO marques "Initialize with README"
# 4. Click "Create repository"

# Agregar remote (REEMPLAZA con tu URL)
git remote add origin https://github.com/TU_USUARIO/endaoment-scroll.git

# O si ya existe, actualizar:
git remote set-url origin https://github.com/TU_USUARIO/endaoment-scroll.git

# Push
git branch -M main
git push -u origin main
```

### PASO 2: Desplegar en Vercel (Dashboard)

1. **Ve a**: https://vercel.com/new
2. **Click**: "Import Git Repository"
3. **Selecciona**: Tu repositorio `endaoment-scroll`
4. **Configuración**:
   ```
   Framework Preset: Next.js
   Root Directory: packages/nextjs
   Build Command: cd ../.. && yarn install && yarn next:build
   Output Directory: .next
   Install Command: cd ../.. && yarn install
   ```
5. **Environment Variables** → Agregar:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY = cR4WnXePioePZ5fFrnSiR
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = 3a8170812b534d0ff9d794f19a901d64
   ```
6. **Click**: "Deploy"
7. **Espera**: 2-3 minutos
8. **¡Listo!**: Tu app estará en `https://tu-proyecto.vercel.app`

### PASO 3: Verificar

- ✅ Abre la URL de Vercel
- ✅ Verifica que carga el frontend
- ✅ Conecta wallet (MetaMask)
- ✅ Verifica que está en Scroll Sepolia

---

## 📋 COMANDOS ALTERNATIVOS (CLI)

### Si prefieres usar Vercel CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desde packages/nextjs
cd packages/nextjs
vercel

# Sigue las instrucciones
```

---

## ⚠️ IMPORTANTE

### Antes de hacer push, verifica:

```bash
# Ver qué se va a subir
git status

# Ver archivos que NO se subirán (deben estar en .gitignore)
git check-ignore -v .env
```

### NO subir:
- ❌ `.env` files
- ❌ `node_modules/`
- ❌ Claves privadas
- ❌ `deployments/localhost/`

---

## 🔄 ACTUALIZAR DESPUÉS

Cada vez que hagas cambios:

```bash
git add .
git commit -m "tu mensaje"
git push origin main
# Vercel redeployará automáticamente
```

---

## ✅ CHECKLIST FINAL

- [ ] Código subido a GitHub
- [ ] Repositorio público o privado configurado
- [ ] Vercel conectado al repositorio
- [ ] Build exitoso en Vercel
- [ ] Environment variables configuradas
- [ ] App accesible en URL de Vercel
- [ ] Wallet se conecta correctamente
- [ ] Red configurada para Scroll Sepolia

---

## 🎯 URL FINAL

Tu app estará en:
```
https://tu-proyecto.vercel.app
```

**¡Eso es todo! 🚀**


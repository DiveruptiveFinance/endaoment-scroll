# 🛡️ PREVENCIÓN DE ERRORES DE DEPLOY

## 📋 ANÁLISIS DE ERRORES COMUNES

### **1. Imports No Usados**

**Error típico:**
```
Error: 'useEffect' is defined but never used. @typescript-eslint/no-unused-vars
Error: 'formatUSDC' is defined but never used. @typescript-eslint/no-unused-vars
```

**Causa:**
- Imports agregados pero nunca utilizados en el código
- Refactorización que dejó imports obsoletos

**Solución:**
- Ejecutar `yarn lint --fix` antes de commit
- Usar ESLint con regla `@typescript-eslint/no-unused-vars`
- Revisar imports antes de hacer commit

---

### **2. Configuración de Next.js Inválida**

**Error típico:**
```
⚠ Invalid next.config.ts options detected: 
⚠     Unrecognized key(s) in object: 'turbopack'
```

**Causa:**
- `turbopack` solo está disponible en Next.js 16+
- Estamos usando Next.js 15.2.6

**Solución:**
- Eliminar `turbopack: {}` de `next.config.ts`
- Verificar versión de Next.js antes de agregar configuraciones nuevas

---

## 🔧 SOLUCIONES IMPLEMENTADAS

### **1. ESLint Config Mejorado**

Agregada regla para ignorar variables que empiezan con `_`:
```javascript
"@typescript-eslint/no-unused-vars": [
  "error",
  {
    "argsIgnorePattern": "^_",
    "varsIgnorePattern": "^_",
    "caughtErrorsIgnorePattern": "^_"
  }
]
```

Esto permite usar `catch { }` sin variable o `const _unused = ...` cuando sea necesario.

---

### **2. Scripts de Pre-commit (Recomendado)**

Agregar a `package.json`:
```json
{
  "scripts": {
    "precommit": "yarn lint --fix && yarn format",
    "prebuild": "yarn lint"
  }
}
```

---

### **3. Verificación Manual Antes de Deploy**

**Checklist antes de push:**
- [ ] Ejecutar `yarn lint` - No debe haber errores
- [ ] Ejecutar `yarn format` - Formatear código
- [ ] Ejecutar `yarn build` localmente - Verificar que compile
- [ ] Revisar `next.config.ts` - No debe tener opciones inválidas
- [ ] Verificar imports - No debe haber imports no usados

---

## 🚨 ERRORES CORREGIDOS EN ESTA SESIÓN

### **1. `app/fund/donate/page.tsx`**
- ❌ `useEffect` importado pero no usado
- ❌ `formatUSDC` importado pero no usado
- ✅ Eliminados ambos imports

### **2. `next.config.ts`**
- ❌ `turbopack: {}` no válido en Next.js 15
- ✅ Eliminada opción `turbopack`

---

## 📝 MEJORES PRÁCTICAS

### **1. Imports**
- Solo importar lo que se usa
- Usar `yarn lint --fix` para limpiar automáticamente
- Revisar imports después de refactorizar

### **2. Next.js Config**
- Verificar documentación de Next.js antes de agregar opciones
- No usar opciones de versiones futuras
- Probar `yarn build` localmente antes de deploy

### **3. TypeScript/ESLint**
- Mantener reglas de ESLint estrictas
- Usar `_` prefix para variables intencionalmente no usadas
- Ejecutar linter antes de commit

---

## 🔍 COMANDOS ÚTILES

```bash
# Verificar errores de lint
yarn lint

# Arreglar errores automáticamente
yarn lint --fix

# Formatear código
yarn format

# Build local (verificar que compile)
yarn build

# Verificar tipos TypeScript
yarn check-types
```

---

## ✅ VERIFICACIÓN FINAL

Antes de cada deploy, ejecutar:

```bash
cd packages/nextjs
yarn lint --fix
yarn format
yarn build
```

Si todos pasan, el deploy en Vercel debería ser exitoso.

---

**Con estos cambios, los errores no deberían volver a ocurrir.**


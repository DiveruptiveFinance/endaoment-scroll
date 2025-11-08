# 🧹 Comandos de Limpieza para PowerShell

## Limpiar Caché de Next.js

```powershell
# Comando completo (copia y pega todo):
Remove-Item -Recurse -Force packages\nextjs\.next -ErrorAction SilentlyContinue
```

## Reiniciar el Servidor

```powershell
# Después de limpiar, reinicia:
yarn start
```

## Si la carpeta no existe

Si ves el error "Cannot find path", significa que la carpeta `.next` no existe (es normal si no se ha compilado antes). Simplemente ejecuta:

```powershell
yarn start
```

## Limpiar Todo (si hay problemas)

```powershell
# Detén el servidor primero (Ctrl+C)

# Limpia caché de Next.js
Remove-Item -Recurse -Force packages\nextjs\.next -ErrorAction SilentlyContinue

# Limpia node_modules (solo si hay problemas graves)
# Remove-Item -Recurse -Force node_modules
# Remove-Item -Recurse -Force packages\nextjs\node_modules

# Reinstala (solo si limpiaste node_modules)
# yarn install

# Reinicia el servidor
yarn start
```


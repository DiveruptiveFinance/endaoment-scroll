#!/bin/bash

echo "========================================"
echo "  DEPLOY RAPIDO - GitHub + Vercel"
echo "========================================"
echo ""

echo "[1/5] Agregando cambios a Git..."
git add .
echo "✓ Cambios agregados"
echo ""

echo "[2/5] Haciendo commit..."
git commit -m "feat: Scroll Hackathon - Lossless Donation Protocol with Governance"
echo "✓ Commit realizado"
echo ""

echo "[3/5] Verificando remote de GitHub..."
git remote -v
echo ""
read -p "¿Ya tienes un repositorio en GitHub? (s/n): " has_repo

if [[ $has_repo == "s" || $has_repo == "S" ]]; then
    echo ""
    read -p "Ingresa la URL de tu repositorio: " repo_url
    git remote set-url origin $repo_url
    echo "✓ Remote configurado"
else
    echo ""
    echo "1. Ve a https://github.com/new"
    echo "2. Crea un nuevo repositorio (ej: endaoment-scroll)"
    echo "3. NO inicialices con README"
    echo "4. Copia la URL del repositorio"
    echo ""
    read -p "Pega la URL aqui: " repo_url
    git remote add origin $repo_url
    echo "✓ Remote agregado"
fi
echo ""

echo "[4/5] Push a GitHub..."
git branch -M main
git push -u origin main
echo "✓ Push completado"
echo ""

echo "[5/5] Configuración de Vercel..."
echo ""
echo "========================================"
echo "  SIGUIENTE PASO: VERCEL"
echo "========================================"
echo ""
echo "1. Ve a: https://vercel.com/new"
echo "2. Importa tu repositorio: $repo_url"
echo "3. Configuración:"
echo "   - Framework: Next.js"
echo "   - Root Directory: packages/nextjs"
echo "   - Build Command: cd ../.. && yarn install && yarn next:build"
echo "   - Output Directory: .next"
echo ""
echo "4. Environment Variables:"
echo "   NEXT_PUBLIC_ALCHEMY_API_KEY=cR4WnXePioePZ5fFrnSiR"
echo "   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=3a8170812b534d0ff9d794f19a901d64"
echo ""
echo "5. Click 'Deploy'"
echo ""
echo "========================================"
echo "  ¡LISTO! Tu app estará en Vercel"
echo "========================================"


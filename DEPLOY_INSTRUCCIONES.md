# 🚀 INSTRUCCIONES PARA DEPLOY EN SCROLL SEPOLIA

## ⚠️ PROBLEMA ACTUAL

El deploy falló porque la wallet del deployer no tiene fondos suficientes para pagar el gas en Scroll Sepolia.

---

## 📋 PASOS PARA COMPLETAR EL DEPLOY

### **1. Obtener Fondos en Scroll Sepolia**

Necesitas ETH en Scroll Sepolia para pagar el gas. Opciones:

#### **Opción A: Faucet de Scroll Sepolia**
1. Ve a: https://sepolia.scrollscan.com/
2. Busca el faucet oficial de Scroll
3. O usa: https://scroll.io/alpha/bridge (puente desde Sepolia)

#### **Opción B: Bridge desde Ethereum Sepolia**
1. Ve a: https://scroll.io/alpha/bridge
2. Conecta tu wallet
3. Bridge ETH desde Ethereum Sepolia → Scroll Sepolia

#### **Opción C: Faucet de Scroll (si está disponible)**
- https://scroll.io/alpha/faucet
- O busca "Scroll Sepolia faucet" en Google

**Necesitas aproximadamente 0.01-0.05 ETH en Scroll Sepolia para desplegar todos los contratos.**

---

### **2. Configurar Wallet en .env**

Crea un archivo `.env` en `packages/hardhat/` con tu clave privada:

```bash
# packages/hardhat/.env
__RUNTIME_DEPLOYER_PRIVATE_KEY=tu_clave_privada_aqui
```

**⚠️ IMPORTANTE:**
- NUNCA compartas tu clave privada
- NUNCA hagas commit del archivo `.env` a GitHub
- Asegúrate de que `.env` esté en `.gitignore`

---

### **3. Desplegar Contratos**

Una vez que tengas fondos, ejecuta:

```bash
cd packages/hardhat
npx hardhat deploy --network scrollSepolia
```

Esto desplegará todos los contratos en orden:
1. MockUSDC
2. StudentRegistry
3. MockAavePool
4. TimelockController
5. YieldSplitter
6. StudentSBT
7. MyGovernor
8. LosslessVault
9. UniversityRegistry
10. DonationTracker
11. Configuración de StudentRegistry

---

### **4. Verificar deployedContracts.ts**

Después del deploy, verifica que `packages/nextjs/contracts/deployedContracts.ts` se haya actualizado automáticamente con las direcciones de Scroll Sepolia.

Si no se actualizó automáticamente, ejecuta:

```bash
cd packages/hardhat
npx hardhat run scripts/generateTsAbis.ts
```

---

### **5. Commit y Push a GitHub**

Una vez desplegado:

```bash
# Desde el root del proyecto
git add .
git commit -m "Deploy contracts to Scroll Sepolia"
git push origin main
```

Vercel redeployará automáticamente con los nuevos contratos.

---

## 🔍 VERIFICAR DEPLOYMENT

### **Verificar en Scroll Sepolia Scanner**

1. Ve a: https://sepolia.scrollscan.com/
2. Busca las direcciones de los contratos en `deployedContracts.ts`
3. Verifica que los contratos estén desplegados correctamente

### **Contratos que se desplegarán:**

- `MockUSDC` - Token USDC de prueba
- `StudentRegistry` - Registro de estudiantes
- `MockAavePool` - Pool simulado de Aave
- `TimelockController` - Controlador de timelock para DAO
- `YieldSplitter` - Divisor de yield 50/50
- `StudentSBT` - Token Soulbound para estudiantes
- `MyGovernor` - Gobernador de la DAO
- `LosslessVault` - Vault principal (ERC4626)
- `UniversityRegistry` - Registro de universidades
- `DonationTracker` - Tracker de donaciones

---

## 📝 NOTAS IMPORTANTES

1. **Gas Costs**: Scroll Sepolia es más barato que Ethereum, pero aún necesitas ETH para gas.

2. **Deploy Order**: Los contratos se despliegan en orden específico debido a dependencias. No cambies el orden de los archivos en `deploy/`.

3. **Verification**: Después del deploy, puedes verificar los contratos en Scroll Sepolia Scanner usando:
   ```bash
   npx hardhat verify --network scrollSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
   ```

4. **Testing**: Después del deploy, prueba los contratos en Vercel conectando tu wallet a Scroll Sepolia.

---

## ✅ CHECKLIST

- [ ] Obtener ETH en Scroll Sepolia (0.01-0.05 ETH)
- [ ] Configurar `.env` con clave privada
- [ ] Ejecutar `npx hardhat deploy --network scrollSepolia`
- [ ] Verificar que `deployedContracts.ts` se actualizó
- [ ] Verificar contratos en Scroll Sepolia Scanner
- [ ] Commit y push a GitHub
- [ ] Verificar redeploy en Vercel
- [ ] Probar en Vercel con wallet conectada

---

## 🆘 SI ALGO FALLA

1. **Error de fondos**: Asegúrate de tener suficiente ETH en Scroll Sepolia
2. **Error de red**: Verifica que la RPC de Scroll Sepolia esté funcionando
3. **Error de contrato**: Revisa los logs del deploy para ver qué contrato falló
4. **deployedContracts.ts no se actualiza**: Ejecuta manualmente `generateTsAbis.ts`

---

**Una vez completado el deploy, todo estará listo para testear en Vercel! 🎉**



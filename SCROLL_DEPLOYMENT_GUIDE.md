# 🚀 Guía Completa: Despliegue en Scroll Mainnet

## 📋 Tabla de Contenidos
1. [¿Qué estoy haciendo?](#qué-estoy-haciendo)
2. [Proceso Paso a Paso](#proceso-paso-a-paso)
3. [Análisis del Proyecto](#análisis-del-proyecto)
4. [Recomendaciones de Mejoras](#recomendaciones-de-mejoras)
5. [Configuración para Scroll Mainnet](#configuración-para-scroll-mainnet)

---

## ¿Qué estoy haciendo?

### ⚠️ Estado Actual
- **SÍ, estoy modificando tu proyecto local** (el que tienes en `C:\Users\jcmb_\endaoment`)
- **NO estoy modificando directamente GitHub** - solo tu copia local
- **He revertido los cambios** para que puedas seguir el proceso correcto

### 🔄 Proceso Correcto (Workflow Git)
1. **Clonar** el repositorio de GitHub
2. **Probar** localmente que todo funciona
3. **Crear una rama** para tus cambios
4. **Hacer cambios** y probarlos
5. **Hacer commit** y **push** a tu fork
6. **Crear Pull Request** al repositorio original

---

## Proceso Paso a Paso

### Paso 1: Clonar el Repositorio

```bash
# 1. Navega a donde quieres clonar el proyecto
cd C:\Users\jcmb_

# 2. Clona el repositorio
git clone https://github.com/fruteroclub/endaoment.git endaoment-scroll

# 3. Entra al directorio
cd endaoment-scroll
```

**¿Qué hace esto?**
- Descarga una copia completa del código desde GitHub
- Crea un nuevo directorio `endaoment-scroll` con todo el código
- Ya tienes el historial completo de commits

### Paso 2: Instalar Dependencias

```bash
# Instala todas las dependencias del proyecto
yarn install
```

**¿Qué hace esto?**
- Lee `package.json` y `yarn.lock`
- Descarga todas las librerías necesarias (React, Hardhat, Wagmi, etc.)
- Crea `node_modules` con todas las dependencias

### Paso 3: Probar Localmente

```bash
# Terminal 1: Inicia la blockchain local
yarn chain

# Terminal 2: Despliega los contratos localmente
yarn deploy

# Terminal 3: Inicia el frontend
yarn start
```

**¿Qué hace esto?**
- `yarn chain`: Inicia Hardhat Network (blockchain local para desarrollo)
- `yarn deploy`: Compila y despliega los contratos en la red local
- `yarn start`: Inicia Next.js en `http://localhost:3000`

**Verifica que funciona:**
1. Abre `http://localhost:3000`
2. Ve a la página `/debug` para interactuar con contratos
3. Prueba hacer un depósito en el vault

### Paso 4: Crear Fork y Rama para Cambios

```bash
# 1. Crea un fork en GitHub (desde la interfaz web)
# Ve a: https://github.com/fruteroclub/endaoment
# Click en "Fork" (arriba a la derecha)

# 2. Agrega tu fork como remoto
git remote add fork https://github.com/TU_USUARIO/endaoment.git

# 3. Crea una nueva rama para tus cambios
git checkout -b feature/scroll-mainnet-deployment

# 4. Verifica que estás en la rama correcta
git branch
```

**¿Qué hace esto?**
- **Fork**: Crea una copia del repositorio en tu cuenta de GitHub
- **Rama**: Crea un espacio aislado para tus cambios sin afectar `main`
- **Remoto**: Te permite hacer push a tu fork

### Paso 5: Hacer Cambios para Scroll Mainnet

Sigue las instrucciones en la sección [Configuración para Scroll Mainnet](#configuración-para-scroll-mainnet)

### Paso 6: Probar los Cambios

```bash
# Compila los contratos
yarn hardhat:compile

# Ejecuta los tests
yarn test

# Prueba el despliegue en Scroll Sepolia (testnet primero)
yarn deploy:scrollSepolia
```

### Paso 7: Commit y Push

```bash
# 1. Ver qué archivos cambiaron
git status

# 2. Agregar archivos modificados
git add .

# 3. Hacer commit con mensaje descriptivo
git commit -m "feat: Add Scroll mainnet deployment configuration"

# 4. Push a tu fork
git push fork feature/scroll-mainnet-deployment
```

### Paso 8: Crear Pull Request

1. Ve a tu fork en GitHub: `https://github.com/TU_USUARIO/endaoment`
2. Verás un banner que dice "Compare & pull request"
3. Click en "Create pull request"
4. Describe los cambios:
   - Qué hiciste
   - Por qué lo hiciste
   - Cómo probarlo
5. Click en "Create pull request"

---

## Análisis del Proyecto

### 🏗️ Arquitectura del Sistema

Tu proyecto es una **plataforma de filantropía DeFi** con tres componentes principales:

#### 1. **EndaomentVault** (Vault de Fondos)
```solidity
// Ubicación: packages/hardhat/contracts/EndaomentVault.sol
```

**¿Qué hace?**
- Implementa el estándar **ERC-4626** (vault tokenizado)
- Los usuarios depositan USDC y reciben "shares" (tokens del vault)
- Genera yield simulado del **5% APY** basado en tiempo
- Rastrea participantes (whales y retail)

**Flujo:**
```
Usuario → Deposita USDC → Recibe Shares → Yield se acumula (5% APY)
```

#### 2. **AllocationManager** (Gestor de Distribución)
```solidity
// Ubicación: packages/hardhat/contracts/AllocationManager.sol
```

**¿Qué hace?**
- Maneja **épocas de 30 días**
- Permite a usuarios **votar** por estudiantes
- Distribuye yield según votos:
  - **10%** → Whale (creador del vault)
  - **15%** → Retail (proporcional a sus shares)
  - **75%** → Estudiantes (proporcional a votos)

**Flujo:**
```
Epoch inicia → Usuarios votan → Epoch finaliza → Yield se distribuye
```

#### 3. **StudentRegistry** (Registro de Estudiantes)
```solidity
// Ubicación: packages/hardhat/contracts/StudentRegistry.sol
```

**¿Qué hace?**
- Mantiene lista de estudiantes verificados
- Solo admin puede agregar/desactivar estudiantes
- Rastrea cuánto ha recibido cada estudiante

### 📊 Flujo Completo del Sistema

```
1. ADMIN registra estudiantes
   ↓
2. WHALE crea vault y deposita 1000+ USDC
   ↓
3. RETAIL deposita 10+ USDC al vault
   ↓
4. Yield se acumula (5% APY simulado)
   ↓
5. Usuarios votan por estudiantes (usando sus shares)
   ↓
6. Epoch finaliza (30 días)
   ↓
7. Yield se distribuye:
   - 10% → Whale
   - 15% → Retail (proporcional)
   - 75% → Estudiantes (proporcional a votos)
```

### ✅ ¿El Proceso Lógico Hace Sentido?

**SÍ, en general el diseño es sólido**, pero hay algunas áreas de mejora:

#### ✅ **Fortalezas:**
1. **ERC-4626 estándar**: Usa un estándar bien establecido
2. **Separación de responsabilidades**: Vault, Allocation, Registry están separados
3. **Sistema de votación**: Permite participación democrática
4. **Tracking de participantes**: Rastrea quién ha depositado

#### ⚠️ **Áreas de Mejora:**
1. **Yield simulado**: Actualmente es solo cálculo, no genera yield real
2. **Sin retiros**: No hay función `withdraw` (aunque ERC-4626 la tiene)
3. **Dependencia de admin**: Muchas funciones requieren `onlyOwner`
4. **Sin verificación de estudiantes**: Cualquiera puede ser agregado por admin

---

## Recomendaciones de Mejoras

### 🔴 **Críticas (Antes de Mainnet)**

#### 1. **Integrar Yield Real**
**Problema actual:**
```solidity
// Solo calcula yield, no lo genera realmente
function getAccruedYield() public view returns (uint256) {
    // Cálculo matemático, pero no hay USDC real
}
```

**Solución:**
- Integrar con protocolos DeFi reales:
  - **Aave**: Depositar USDC y ganar interés real
  - **Compound**: Similar a Aave
  - **Yearn Vaults**: Vaults optimizados automáticamente

**Ejemplo:**
```solidity
// Depositar en Aave y obtener yield real
function _deployToAave(uint256 amount) internal {
    IERC20(asset()).approve(aaveLendingPool, amount);
    ILendingPool(aaveLendingPool).deposit(asset(), amount, address(this), 0);
}
```

#### 2. **Implementar Retiros (Withdraw)**
**Problema actual:**
- Los usuarios pueden depositar pero no retirar
- ERC-4626 tiene `withdraw()` pero no está implementado

**Solución:**
```solidity
function withdraw(uint256 assets, address receiver, address owner) 
    public override returns (uint256) {
    _updateYield();
    return super.withdraw(assets, receiver, owner);
}
```

#### 3. **Sistema de Verificación de Estudiantes**
**Problema actual:**
- Cualquier admin puede agregar cualquier estudiante
- No hay verificación de identidad

**Solución:**
- Integrar con **Worldcoin** o **Gitcoin Passport**
- Requerir documentos verificados (IPFS)
- Sistema de reputación on-chain

### 🟡 **Importantes (Mejoras de UX)**

#### 4. **Quadratic Funding**
**Problema actual:**
- Votos son lineales (1 share = 1 voto)
- Whales tienen demasiado poder

**Solución:**
```solidity
// Implementar votación cuadrática
function calculateQuadraticVotes(uint256 shares) internal pure returns (uint256) {
    return sqrt(shares); // Raíz cuadrada reduce poder de whales
}
```

#### 5. **Múltiples Vaults (Factory Pattern)**
**Problema actual:**
- Solo hay un vault hardcodeado

**Solución:**
```solidity
contract VaultFactory {
    function createVault(address whale, string memory name) external returns (address) {
        EndaomentVault vault = new EndaomentVault(usdc, name, "VAULT", whale);
        allocationManager.registerVault(address(vault));
        return address(vault);
    }
}
```

#### 6. **Auto-Finalización de Epochs**
**Problema actual:**
- Admin debe llamar `finalizeEpoch()` manualmente

**Solución:**
```solidity
// Usar Chainlink Automation o Gelato
function checkUpkeep(bytes calldata) external view returns (bool, bytes memory) {
    bool shouldFinalize = block.timestamp >= epochs[currentEpochId].endTime;
    return (shouldFinalize, "");
}
```

### 🟢 **Mejoras Futuras (Nice to Have)**

#### 7. **Governance Token**
- Token ERC-20 para decisiones de plataforma
- Staking para votar en parámetros

#### 8. **Impact Reports**
- Estudiantes pueden subir actualizaciones
- NFTs de impacto para donantes

#### 9. **Multi-Chain**
- Desplegar en múltiples L2s
- Bridge entre chains

---

## Configuración para Scroll Mainnet

### Paso 1: Verificar Chain IDs de Scroll

```typescript
// Scroll Sepolia Testnet: Chain ID 534351
// Scroll Mainnet: Chain ID 534352
```

### Paso 2: Actualizar `hardhat.config.ts`

```typescript
// packages/hardhat/hardhat.config.ts

// Ya tienes esto configurado:
scrollSepolia: {
  url: "https://sepolia-rpc.scroll.io",
  accounts: [deployerPrivateKey],
},
scroll: {
  url: "https://rpc.scroll.io",
  accounts: [deployerPrivateKey],
},
```

**✅ Ya está configurado correctamente**

### Paso 3: Configurar Etherscan para Scroll

```typescript
// packages/hardhat/hardhat.config.ts

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  // ... resto de configuración
  
  etherscan: {
    apiKey: {
      scrollSepolia: process.env.SCROLL_ETHERSCAN_API_KEY || "",
      scroll: process.env.SCROLL_ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://sepolia-blockscout.scroll.io/api",
          browserURL: "https://sepolia-blockscout.scroll.io"
        }
      },
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com"
        }
      }
    ]
  },
};
```

### Paso 4: Actualizar `scaffold.config.ts`

```typescript
// packages/nextjs/scaffold.config.ts

import * as chains from "viem/chains";

const scaffoldConfig = {
  // Para Scroll Mainnet, usa chains.scroll
  targetNetworks: [chains.hardhat, chains.scroll],
  
  rpcOverrides: {
    // Scroll Mainnet RPC
    [chains.scroll.id]: "https://rpc.scroll.io",
  },
  
  // ... resto de configuración
};
```

### Paso 5: Agregar Scripts de Despliegue

```json
// packages/hardhat/package.json

{
  "scripts": {
    // ... scripts existentes
    "deploy:scrollSepolia": "hardhat deploy --network scrollSepolia",
    "deploy:scroll": "hardhat deploy --network scroll",
    "verify:scrollSepolia": "hardhat verify --network scrollSepolia",
    "verify:scroll": "hardhat verify --network scroll"
  }
}
```

### Paso 6: Configurar Variables de Entorno

```bash
# .env (en packages/hardhat/)
DEPLOYER_PRIVATE_KEY_ENCRYPTED=tu_clave_encriptada
SCROLL_ETHERSCAN_API_KEY=tu_api_key_de_scrollscan
ALCHEMY_API_KEY=tu_alchemy_key
```

### Paso 7: Obtener Fondos para Despliegue

**Para Scroll Sepolia (Testnet):**
1. Ve a: https://scroll.io/faucet
2. Conecta tu wallet
3. Solicita ETH de testnet

**Para Scroll Mainnet:**
1. Bridge ETH desde Ethereum Mainnet
2. Usa: https://scroll.io/bridge
3. O compra directamente en un exchange

### Paso 8: Desplegar a Scroll Sepolia (Primero)

```bash
# 1. Compila los contratos
yarn hardhat:compile

# 2. Despliega a Scroll Sepolia
yarn deploy:scrollSepolia

# 3. Verifica los contratos
yarn verify:scrollSepolia
```

### Paso 9: Desplegar a Scroll Mainnet

```bash
# ⚠️ SOLO DESPUÉS DE PROBAR EN TESTNET

# 1. Despliega a Scroll Mainnet
yarn deploy:scroll

# 2. Verifica los contratos
yarn verify:scroll
```

### Paso 10: Actualizar Frontend

```typescript
// packages/nextjs/scaffold.config.ts

const scaffoldConfig = {
  // Cambiar a Scroll Mainnet
  targetNetworks: [chains.scroll],
  
  rpcOverrides: {
    [chains.scroll.id]: "https://rpc.scroll.io",
  },
};
```

---

## Checklist Pre-Mainnet

- [ ] ✅ Contratos auditados (o al menos revisados)
- [ ] ✅ Tests pasando (100% coverage)
- [ ] ✅ Desplegado y probado en Scroll Sepolia
- [ ] ✅ Verificación de contratos en Scrollscan
- [ ] ✅ Frontend actualizado con direcciones de contratos
- [ ] ✅ Documentación actualizada
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Fondos suficientes para gas
- [ ] ✅ Plan de rollback preparado

---

## Recursos Útiles

- **Scroll Docs**: https://docs.scroll.io
- **Scrollscan**: https://scrollscan.com
- **Scroll Bridge**: https://scroll.io/bridge
- **Scroll Faucet**: https://scroll.io/faucet

---

## Próximos Pasos

1. **Sigue el proceso paso a paso** de arriba
2. **Prueba localmente** primero
3. **Despliega en Scroll Sepolia** para probar
4. **Haz los cambios** necesarios
5. **Crea el Pull Request** con tus mejoras

¿Tienes preguntas sobre algún paso específico?


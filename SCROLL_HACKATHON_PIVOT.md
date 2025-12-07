# 🚀 EnDAOment Scroll Hackathon Pivot

## 📋 Resumen del Nuevo Modelo

**Pivot Completo**: De Base/Octant con splits Retail/Whale → Scroll Sepolia con Governance Institucional

### 🎯 Objetivo Principal
**"Lossless Donation" Protocol**: Donantes depositan USDC, mantienen su principal, y donan el 100% del yield.

### 💰 Distribución del Yield
- **50%** → University Wallet (Operational expenses - Multisig)
- **50%** → Student DAO Treasury (TimelockController - Participatory governance)

---

## 🏗️ Arquitectura: "The Holy Trinity"

### 1. **The Vault** (LosslessVault.sol)
- **Base**: ERC-4626 de OpenZeppelin
- **Estrategia**: Deposita en MockAavePool
- **Lógica**: 
  - Principal se mantiene en MockAavePool
  - Solo el yield se harvest y envía al Splitter
  - Donantes pueden retirar su principal en cualquier momento

### 2. **The Splitter** (YieldSplitter.sol)
- Recibe USDC (yield del vault)
- **50%** → UniversityWallet (multisig)
- **50%** → TimelockController (DAO Treasury)

### 3. **The Governance** (Optimistic con Veto)
- **Token**: StudentSBT.sol (ERC721 Soulbound - no transferible)
- **Governor**: MyGovernor.sol (OpenZeppelin Governor)
- **Timelock**: TimelockController.sol
- **Veto**: UniversityWallet tiene rol CANCELLER para cancelar propuestas maliciosas

---

## 📦 Contratos Creados

### Core Contracts

1. **MockAavePool.sol**
   - Simula Aave V3 para demos
   - Funciones: `supply()`, `withdraw()`, `adminAddYield()`
   - Permite generar yield instantáneamente para demos

2. **LosslessVault.sol**
   - ERC-4626 vault
   - Deposita principal en MockAavePool
   - Harvest solo el yield y lo envía a YieldSplitter

3. **YieldSplitter.sol**
   - Divide yield 50/50 entre University y DAO
   - Transferencias inmediatas

4. **StudentSBT.sol**
   - ERC721 Soulbound Token
   - No transferible (funciones de transfer revertidas)
   - Solo estudiantes registrados pueden tenerlo

5. **MyGovernor.sol**
   - OpenZeppelin Governor
   - Voting Delay: 0 (instant)
   - Voting Period: 150 blocks (~5 minutos para demo)
   - Quorum: 4%
   - Integrado con TimelockController

6. **TimelockController.sol** (OpenZeppelin)
   - Delay: 1 hora (configurable)
   - Proposer: Governor
   - Executor: Open (address 0)
   - Canceller: UniversityWallet (VETO power)

---

## 🚀 Scripts de Despliegue

Los scripts están en orden de dependencias:

1. `00_deploy_mock_usdc.ts` - MockUSDC token
2. `04_deploy_mock_aave_pool.ts` - MockAavePool
3. `05_deploy_timelock_controller.ts` - TimelockController con veto
4. `06_deploy_yield_splitter.ts` - YieldSplitter
5. `07_deploy_student_sbt.ts` - StudentSBT
6. `08_deploy_my_governor.ts` - MyGovernor
7. `09_deploy_lossless_vault.ts` - LosslessVault

### Variables de Entorno Necesarias

```bash
# .env (en packages/hardhat/)
DEPLOYER_PRIVATE_KEY_ENCRYPTED=tu_clave_encriptada
UNIVERSITY_WALLET=0x... # Dirección del multisig de la universidad
```

---

## 📝 Flujo Completo

### 1. Setup Inicial
```bash
# Compilar contratos
yarn hardhat:compile

# Desplegar a Scroll Sepolia
yarn deploy --network scrollSepolia
```

### 2. Demo Flow

#### A. Registrar Estudiantes
```solidity
// Admin registra estudiantes y les da SBT
studentSBT.mint(studentAddress);
```

#### B. Donante Deposita
```solidity
// Donante deposita USDC al vault
losslessVault.deposit(1000e6, donorAddress);
// Principal va a MockAavePool
```

#### C. Generar Yield (Demo)
```solidity
// Admin genera yield instantáneamente para demo
mockAavePool.adminAddYield(50e6); // 5% yield
```

#### D. Harvest Yield
```solidity
// Admin harvest yield y lo envía al splitter
losslessVault.harvestYield();
// Splitter divide 50/50 automáticamente
```

#### E. Governance (Opcional)
```solidity
// Estudiante propone uso de fondos DAO
governor.propose(targets, values, calldatas, description);
// Votación (5 minutos)
// Si pasa, va a Timelock (1 hora delay)
// University puede vetar durante el delay
```

---

## 🔧 Configuración para Scroll Sepolia

### Hardhat Config
Ya configurado en `hardhat.config.ts`:
```typescript
scrollSepolia: {
  url: "https://sepolia-rpc.scroll.io",
  accounts: [deployerPrivateKey],
}
```

### Frontend Config
Actualizado en `scaffold.config.ts`:
```typescript
targetNetworks: [chains.hardhat, chains.scrollSepolia],
rpcOverrides: {
  [chains.scrollSepolia.id]: "https://sepolia-rpc.scroll.io",
}
```

### Block Explorer
- **Scroll Sepolia**: https://sepolia.scrollscan.com/

---

## 🧪 Testing

### Compilar
```bash
yarn hardhat:compile
```

### Ejecutar Tests
```bash
yarn test
```

### Desplegar Localmente
```bash
# Terminal 1
yarn chain

# Terminal 2
yarn deploy
```

### Desplegar a Scroll Sepolia
```bash
yarn deploy --network scrollSepolia
```

---

## 📊 Parámetros de Governance

- **Voting Delay**: 0 blocks (instant)
- **Voting Period**: 150 blocks (~5 minutos en Scroll)
- **Quorum**: 4%
- **Timelock Delay**: 3600 segundos (1 hora)
- **Proposal Threshold**: 0 (cualquier SBT holder puede proponer)

---

## 🔐 Roles y Permisos

### TimelockController
- **PROPOSER_ROLE**: MyGovernor (puede proponer)
- **EXECUTOR_ROLE**: Open (cualquiera puede ejecutar)
- **CANCELLER_ROLE**: UniversityWallet (puede vetar)

### StudentSBT
- **Owner**: Puede agregar authorized minters
- **Authorized Minters**: Pueden mint SBTs a estudiantes

### MockAavePool
- **Owner**: Puede llamar `adminAddYield()` para demos

### LosslessVault
- **Owner**: Puede llamar `harvestYield()`

---

## 🎬 Demo Script

Para una demo rápida:

1. **Deploy todos los contratos**
2. **Mint SBTs a estudiantes**
3. **Donante deposita USDC**
4. **Admin genera yield** (`adminAddYield`)
5. **Harvest yield** (`harvestYield`)
6. **Verificar split** (50% University, 50% DAO)

---

## ⚠️ Notas Importantes

1. **MockAavePool**: Solo para demos. En producción, usar Aave V3 real.
2. **UniversityWallet**: Debe ser un multisig en producción.
3. **Voting Period**: Ajustado para demo (5 min). En producción, usar períodos más largos.
4. **Timelock Delay**: 1 hora para demo. En producción, considerar delays más largos.

---

## 🔗 Recursos

- **Scroll Docs**: https://docs.scroll.io
- **Scroll Sepolia Explorer**: https://sepolia.scrollscan.com
- **OpenZeppelin Governor**: https://docs.openzeppelin.com/contracts/4.x/api/governance
- **OpenZeppelin Wizard**: https://wizard.openzeppelin.com/#governor

---

## 📝 Próximos Pasos

1. ✅ Contratos creados
2. ✅ Scripts de despliegue creados
3. ⏳ Tests unitarios
4. ⏳ Frontend integration
5. ⏳ Deploy a Scroll Sepolia
6. ⏳ Demo video

---

**¡Listo para el Scroll Hackathon! 🚀**


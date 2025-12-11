# 📊 Análisis Completo: Contratos Inteligentes y Frontend - EnDAOment

## 🎯 RESUMEN EJECUTIVO

**Estado Actual:** Los contratos están desplegados en Scroll Sepolia, pero **NO hay integración completa** entre frontend y smart contracts. El frontend usa principalmente datos mock.

---

## 🏗️ ARQUITECTURA DE CONTRATOS INTELIGENTES

### **"The Holy Trinity" - Los 3 Contratos Principales**

#### 1. **LosslessVault** (ERC-4626) - El Vault Principal
**Ubicación:** `packages/hardhat/contracts/LosslessVault.sol`

**¿Qué hace?**
- Es un vault ERC-4626 que permite a los donantes depositar USDC
- **Modelo "Lossless Donation"**: Los donantes mantienen su principal, donan el 100% del yield
- Deposita el principal en `MockAavePool` para generar yield
- Cuando se harvestea yield, lo envía a `YieldSplitter` para distribución

**Funciones Principales:**
```solidity
// Depositar USDC y recibir shares del vault
function deposit(uint256 assets, address receiver) → returns (uint256 shares)

// Retirar principal (solo el principal, no el yield)
function withdraw(uint256 assets, address receiver, address owner) → returns (uint256 shares)

// Harvestear yield del pool y enviarlo al splitter
function harvestYield() → onlyOwner

// Ver yield disponible
function getAvailableYield() → returns (uint256)
```

**Flujo:**
1. Donante deposita USDC → Recibe shares del vault
2. Vault deposita principal en MockAavePool
3. Admin llama `harvestYield()` → Yield va a YieldSplitter
4. YieldSplitter divide 50/50 entre University y DAO

---

#### 2. **MockAavePool** - Simulación de Aave V3
**Ubicación:** `packages/hardhat/contracts/MockAavePool.sol`

**¿Qué hace?**
- Simula el comportamiento de Aave V3 para demos/hackathons
- Permite `supply` (depositar) y `withdraw` (retirar) assets
- Tiene función `adminAddYield()` para generar yield instantáneamente (para demos)

**Funciones Principales:**
```solidity
// Depositar assets al pool
function supply(uint256 amount, address onBehalfOf)

// Retirar assets del pool
function withdraw(uint256 amount, address to) → returns (uint256)

// ADMIN: Agregar yield instantáneamente (para demos)
function adminAddYield(uint256 amount) → onlyOwner

// Ver yield disponible (total assets - principal)
function getAvailableYield() → returns (uint256)

// Harvestear solo el yield, mantener principal
function harvestYield(address to) → onlyOwner → returns (uint256)
```

**Flujo:**
1. LosslessVault deposita principal via `supply()`
2. Admin llama `adminAddYield()` para simular yield (demo)
3. LosslessVault llama `harvestYield()` para retirar solo el yield
4. Principal permanece en el pool

---

#### 3. **YieldSplitter** - Distribuidor de Yield
**Ubicación:** `packages/hardhat/contracts/YieldSplitter.sol`

**¿Qué hace?**
- Recibe yield del vault
- Divide el yield 50/50 entre:
  - **50% → University Wallet** (multisig para gastos operacionales)
  - **50% → TimelockController** (DAO Treasury para gobernanza)

**Funciones Principales:**
```solidity
// Dividir yield 50/50
function splitYield() → nonReentrant

// Ver balance de yield pendiente
function getYieldBalance() → returns (uint256)
```

**Flujo:**
1. LosslessVault envía yield al splitter
2. Cualquiera puede llamar `splitYield()` (típicamente el vault)
3. Yield se divide automáticamente 50/50
4. University recibe su parte inmediatamente
5. DAO recibe su parte en TimelockController

---

### **Sistema de Gobernanza**

#### 4. **StudentSBT** - Token Soulbound para Votación
**Ubicación:** `packages/hardhat/contracts/StudentSBT.sol`

**¿Qué hace?**
- ERC721 **NO TRANSFERIBLE** (Soulbound Token)
- Solo estudiantes registrados pueden tenerlo
- 1 SBT = 1 voto en el DAO
- Implementa `IVotes` para compatibilidad con OpenZeppelin Governor

**Funciones Principales:**
```solidity
// Mint SBT a un estudiante (solo minters autorizados)
function mint(address student) → onlyAuthorizedMinter → returns (uint256 tokenId)

// Verificar si un estudiante tiene SBT
function hasSBT(address student) → returns (bool)

// Obtener poder de voto (1 si tiene SBT, 0 si no)
function getVotes(address account) → returns (uint256)
```

**Flujo:**
1. Estudiante se registra en `StudentRegistry`
2. Registry llama `mint()` en StudentSBT
3. Estudiante recibe SBT (no transferible)
4. Estudiante puede votar en propuestas del DAO

---

#### 5. **MyGovernor** - Gobernanza Optimista con Veto
**Ubicación:** `packages/hardhat/contracts/MyGovernor.sol`

**¿Qué hace?**
- Sistema de gobernanza usando OpenZeppelin Governor
- Estudiantes con SBT pueden proponer y votar
- **Optimistic Governance**: Voting delay = 0 (instantáneo)
- Voting period = ~5-10 minutos (para demos)
- TimelockController para ejecución con delay
- University tiene poder de veto (CANCELLER_ROLE en Timelock)

**Funciones Principales:**
```solidity
// Crear una propuesta
function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
) → returns (uint256 proposalId)

// Votar en una propuesta
function castVote(uint256 proposalId, uint8 support) → returns (uint256)

// Ejecutar propuesta (después de timelock)
function execute(...) → returns (uint256)
```

**Flujo:**
1. Estudiante con SBT crea propuesta via `propose()`
2. Propuesta entra en votación inmediatamente (delay = 0)
3. Estudiantes votan durante 5-10 minutos
4. Si pasa quorum, propuesta va a Timelock
5. University puede cancelar (veto) durante timelock
6. Si no se cancela, propuesta se ejecuta automáticamente

---

#### 6. **TimelockController** - Ejecución con Delay
**Ubicación:** OpenZeppelin (desplegado en `05_deploy_timelock_controller.ts`)

**¿Qué hace?**
- Recibe el 50% del yield (DAO Treasury)
- Ejecuta propuestas del Governor con un delay
- University tiene `CANCELLER_ROLE` para vetar propuestas maliciosas

**Roles:**
- `PROPOSER_ROLE`: MyGovernor (puede proponer)
- `EXECUTOR_ROLE`: Address(0) = cualquiera puede ejecutar
- `CANCELLER_ROLE`: University Wallet (puede cancelar/vetar)

---

## 🔗 INTEGRACIÓN FRONTEND vs SMART CONTRACTS

### ✅ **LO QUE SÍ ESTÁ CONECTADO**

#### 1. **Dashboard** (`app/dashboard/page.tsx`)
**Contratos que lee:**
- ✅ `EndaomentVault` (contrato antiguo, no LosslessVault)
  - `userShares()` - Shares del usuario
  - `userAssets()` - Assets del usuario
  - `totalVaultYield()` - Yield total
  - `whale()` - Dirección del whale
  - `vaultName()` - Nombre del vault

**Problema:** Usa `EndaomentVault` (contrato antiguo), no `LosslessVault` (nuevo)

---

#### 2. **Vault Create** (`app/vault/create/page.tsx`)
**Contratos que usa:**
- ✅ `MockUSDC`
  - `balanceOf()` - Balance de USDC
  - `approve()` - Aprobar gasto
- ✅ `EndaomentVault` (contrato antiguo)
  - `deposit()` - Depositar al vault

**Problema:** Usa `EndaomentVault` (contrato antiguo), no `LosslessVault` (nuevo)

---

#### 3. **Student Create** (`app/student/create/page.tsx`)
**Contratos que usa:**
- ✅ `StudentRegistry`
  - `registerStudent()` - Registrar estudiante

**Estado:** ✅ Funcional

---

#### 4. **Allocate** (`app/allocate/page.tsx`)
**Contratos que usa:**
- ✅ `AllocationManager`
  - `currentEpoch()` - Época actual
  - `getStudentAddresses()` - Direcciones de estudiantes
  - `allocateVotes()` - Asignar votos
- ✅ `EndaomentVault` (contrato antiguo)
  - `simulateYield()` - Simular yield

**Problema:** Usa `EndaomentVault` (contrato antiguo), no `LosslessVault` (nuevo)

---

### ❌ **LO QUE NO ESTÁ CONECTADO**

#### 1. **LosslessVault** - NO HAY INTERACCIÓN
- ❌ No hay página para depositar en LosslessVault
- ❌ No hay UI para ver balance del vault
- ❌ No hay UI para harvestear yield
- ❌ No hay UI para ver yield disponible

**Contrato desplegado:** ✅ Sí
**Frontend conectado:** ❌ No

---

#### 2. **MockAavePool** - NO HAY INTERACCIÓN
- ❌ No hay UI para que admin agregue yield (`adminAddYield`)
- ❌ No hay UI para ver balance del pool
- ❌ No hay UI para ver yield disponible

**Contrato desplegado:** ✅ Sí
**Frontend conectado:** ❌ No

---

#### 3. **YieldSplitter** - NO HAY INTERACCIÓN
- ❌ No hay UI para ver balance pendiente
- ❌ No hay UI para llamar `splitYield()`
- ❌ No hay UI para ver historial de splits

**Contrato desplegado:** ✅ Sí
**Frontend conectado:** ❌ No

---

#### 4. **StudentSBT** - PARCIALMENTE CONECTADO
- ❌ No hay UI para ver si un estudiante tiene SBT
- ❌ No hay UI para ver tokenId del SBT
- ❌ No hay UI para verificar poder de voto

**Contrato desplegado:** ✅ Sí
**Frontend conectado:** ⚠️ Parcial (solo lectura en algunos lugares)

---

#### 5. **MyGovernor** - NO HAY INTERACCIÓN
- ❌ No hay UI para crear propuestas
- ❌ No hay UI para votar en propuestas
- ❌ No hay UI para ver estado de propuestas
- ❌ No hay UI para ejecutar propuestas

**Contrato desplegado:** ✅ Sí
**Frontend conectado:** ❌ No

---

#### 6. **TimelockController** - NO HAY INTERACCIÓN
- ❌ No hay UI para ver propuestas en timelock
- ❌ No hay UI para que University cancele propuestas (veto)
- ❌ No hay UI para ver balance del DAO Treasury

**Contrato desplegado:** ✅ Sí
**Frontend conectado:** ❌ No

---

## 📋 RESUMEN DE ESTADO

| Contrato | Desplegado | Frontend Conectado | Estado |
|----------|------------|-------------------|--------|
| **LosslessVault** | ✅ | ❌ | **FALTA INTEGRACIÓN** |
| **MockAavePool** | ✅ | ❌ | **FALTA INTEGRACIÓN** |
| **YieldSplitter** | ✅ | ❌ | **FALTA INTEGRACIÓN** |
| **StudentSBT** | ✅ | ⚠️ | **PARCIAL** |
| **MyGovernor** | ✅ | ❌ | **FALTA INTEGRACIÓN** |
| **TimelockController** | ✅ | ❌ | **FALTA INTEGRACIÓN** |
| **EndaomentVault** (antiguo) | ✅ | ✅ | **OBSOLETO** |
| **StudentRegistry** | ✅ | ✅ | **FUNCIONAL** |
| **AllocationManager** | ✅ | ✅ | **FUNCIONAL** |

---

## 🎯 QUÉ FALTA PARA COMPLETAR LA INTEGRACIÓN

### **Prioridad ALTA - Core Functionality**

1. **Página de Donación (LosslessVault)**
   - UI para depositar USDC
   - UI para ver shares del usuario
   - UI para ver yield disponible
   - UI para retirar principal (opcional)

2. **Página de Admin (MockAavePool)**
   - UI para agregar yield (`adminAddYield`)
   - UI para ver balance del pool
   - UI para harvestear yield

3. **Página de Yield Splitter**
   - UI para ver balance pendiente
   - UI para llamar `splitYield()`
   - UI para ver historial

4. **Página de Gobernanza (MyGovernor)**
   - UI para crear propuestas
   - UI para votar
   - UI para ver estado de propuestas
   - UI para ejecutar propuestas

5. **Página de Veto (TimelockController)**
   - UI para University ver propuestas en timelock
   - UI para cancelar propuestas (veto)

---

## 📝 CÓMO ESTRUCTURAR INSTRUCCIONES PARA AVANZAR

### **Formato Recomendado para Documentos**

Para que la integración sea eficiente, estructura tus documentos así:

#### **1. Contexto del Flujo**
```
¿Qué usuario está haciendo?
¿Cuál es el objetivo?
¿Qué problema resuelve?
```

#### **2. Flujo de Usuario (User Journey)**
```
Paso 1: Usuario hace X
Paso 2: Sistema hace Y
Paso 3: Usuario ve Z
```

#### **3. Contratos Involucrados**
```
- Contrato A: Función X() con parámetros [a, b, c]
- Contrato B: Función Y() con parámetros [d, e]
```

#### **4. UI/UX Requerida**
```
- Componente: Nombre del componente
- Props: { prop1: tipo, prop2: tipo }
- Estados: loading, success, error
- Validaciones: [lista de validaciones]
```

#### **5. Datos a Mostrar**
```
- Lectura de contrato: useScaffoldReadContract({ contractName: "X", functionName: "Y" })
- Escritura de contrato: useScaffoldWriteContract("X") → writeContractAsync({ functionName: "Y", args: [...] })
```

#### **6. Eventos a Escuchar**
```
- Evento: NombreDelEvento
- Parámetros: [param1, param2]
- Acción: Actualizar UI cuando se emite
```

---

### **Ejemplo de Estructura de Documento**

```markdown
# Feature: Donación al Vault

## Contexto
Los donantes quieren depositar USDC en el vault para generar yield que se dona.

## Flujo de Usuario
1. Usuario va a /donate
2. Usuario ingresa cantidad de USDC
3. Usuario aprueba gasto de USDC
4. Usuario deposita al vault
5. Usuario recibe shares del vault
6. Usuario ve su balance actualizado

## Contratos Involucrados
- MockUSDC.approve(spender, amount)
- LosslessVault.deposit(assets, receiver)

## UI Requerida
- Componente: DonateForm
- Estados: idle, approving, depositing, success, error
- Validaciones: balance suficiente, amount > 0

## Datos a Mostrar
- USDC Balance: useScaffoldReadContract({ contractName: "MockUSDC", functionName: "balanceOf" })
- Vault Shares: useScaffoldReadContract({ contractName: "LosslessVault", functionName: "balanceOf" })

## Eventos
- LosslessVault.Deposit → Actualizar UI
```

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

1. **Revisar tus documentos** de flujo, marketing, estrategia
2. **Identificar qué flujos requieren integración con contratos**
3. **Priorizar** según importancia del negocio
4. **Estructurar** cada feature usando el formato arriba
5. **Implementar** feature por feature

---

## 💡 NOTAS IMPORTANTES

1. **Contratos Antiguos vs Nuevos:**
   - `EndaomentVault` es el contrato antiguo (aún usado en frontend)
   - `LosslessVault` es el nuevo (no conectado aún)
   - **Decisión necesaria:** ¿Migrar todo a LosslessVault o mantener ambos?

2. **Hooks de Scaffold-ETH:**
   - ✅ `useScaffoldReadContract` - Para leer datos
   - ✅ `useScaffoldWriteContract` - Para escribir transacciones
   - ✅ `useScaffoldEventHistory` - Para leer eventos históricos
   - ✅ `useScaffoldWatchContractEvent` - Para escuchar eventos en tiempo real

3. **Red:**
   - Contratos están en **Scroll Sepolia**
   - Frontend debe estar conectado a Scroll Sepolia
   - Verificar `scaffold.config.ts` para configuración de red

---

## ✅ CONCLUSIÓN

**Estado Actual:**
- ✅ Contratos desplegados y funcionando
- ⚠️ Frontend parcialmente conectado (usa contratos antiguos)
- ❌ Falta integración completa con nuevos contratos

**Próximo Paso:**
Comparte tus documentos estructurados y comenzamos a integrar feature por feature.




# ❓ Dudas Resueltas y Sugerencias para MVP

## ✅ DECISIONES CONFIRMADAS

1. **UniversityRegistry:** ✅ Crear contrato
2. **StudentRegistry:** ✅ Modificar para función pública
3. **Perfil Donante:** ✅ localStorage + IPFS
4. **APY:** ✅ **10% fijo** (actualizado)
5. **Gastos Yield:** ✅ Mock data

---

## 🔑 GENERACIÓN DE WALLETS PARA UNIVERSIDADES

### **Solución Implementada:**
- Script de Hardhat para generar wallets aleatorias
- Guardar en `.university-wallets.json` (NO commitear)
- Usar en deployment scripts
- Acceso a private keys para demos

### **Archivos a Crear:**
- `packages/hardhat/scripts/generate-university-wallets.ts`
- `packages/hardhat/.university-wallets.json` (gitignored)
- `packages/hardhat/university-wallets-public.json` (solo addresses)

---

## 🎨 LOGOS DE UNIVERSIDADES

### **Orden Confirmado:**
1. UNAM
2. IBERO
3. BUAP
4. UDLAP
5. ANAHUAC
6. TEC de Monterrey

### **Estructura de Archivos:**
```
packages/nextjs/public/universities/
├── unam.png (o .svg)
├── ibero.png
├── buap.png
├── udlap.png
├── anahuac.png
└── tec.png
```

### **Nota:**
Los logos que adjuntaste están en formato imagen. Necesito guardarlos en la carpeta `public/universities/` con los nombres correspondientes.

---

## ❓ DUDAS RESUELTAS

### **1. ¿Cómo fijar wallets de universidades en MVP?**

**Solución:**
- Crear `UniversityRegistry` con función `lockWallet()` que solo owner puede llamar
- En deployment, llamar `lockWallet()` inmediatamente después de registrar
- Agregar modifier `onlyUnlocked` que revierte si está locked

```solidity
mapping(address => bool) public isLocked;

modifier onlyUnlocked(address wallet) {
    require(!isLocked[wallet], "Wallet is locked for MVP");
    _;
}

function lockWallet(address wallet) external onlyOwner {
    isLocked[wallet] = true;
}
```

---

### **2. ¿Cómo simular yield en tiempo real?**

**Solución:**
- Panel Admin (`/admin/yield`) con dos botones:
  1. **"Add Yield"** → `MockAavePool.adminAddYield(amount)`
  2. **"Harvest & Split"** → `LosslessVault.harvestYield()`
  
- **Flujo completo:**
  ```
  Admin → Add Yield (1000 USDC)
    ↓
  MockAavePool tiene yield disponible
    ↓
  Admin → Harvest & Split
    ↓
  LosslessVault.harvestYield()
    ↓
  MockAavePool.harvestYield() → envía a YieldSplitter
    ↓
  YieldSplitter.splitYield() → 50% University, 50% Timelock
  ```

---

### **3. ¿Cómo mostrar fondos depositados en wallet de universidad?**

**Solución:**
- Leer balance de USDC en wallet de universidad:
  ```typescript
  useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "balanceOf",
    args: [universityWalletAddress]
  })
  ```

- Leer eventos `YieldSplit` del YieldSplitter:
  ```typescript
  useScaffoldEventHistory({
    contractName: "YieldSplitter",
    eventName: "YieldSplit",
    fromBlock: 0n
  })
  // Filtrar por universityWallet
  ```

---

## 💡 SUGERENCIAS PARA MEJORAR LA CONEXIÓN

### **1. Arquitectura de Datos**

#### **Problema Actual:**
- Datos dispersos entre contratos
- No hay forma de relacionar donaciones con universidades
- No hay tracking de gastos después del split

#### **Sugerencia:**
Crear contrato `DonationTracker` que emite eventos estructurados:

```solidity
event DonationMade(
    address indexed donor,
    address indexed university,
    uint256 amount,
    uint256 timestamp
);

event YieldDistributed(
    address indexed university,
    uint256 operationalAmount,  // 50%
    uint256 daoAmount,          // 50%
    uint256 timestamp
);
```

**Beneficio:** Frontend puede leer eventos estructurados fácilmente.

---

### **2. Sistema de Metadata Off-Chain**

#### **Problema:**
- Perfiles de estudiantes, universidades, donantes necesitan metadata
- Guardar todo en-chain es costoso

#### **Sugerencia:**
Usar **IPFS + Contrato de Referencia**:

```solidity
contract MetadataRegistry {
    mapping(address => string) public ipfsHash; // address => IPFS hash
    
    function setMetadata(address entity, string memory hash) external {
        ipfsHash[entity] = hash;
    }
}
```

**Frontend:**
- Subir metadata a IPFS (Pinata, NFT.Storage, etc.)
- Guardar hash en contrato
- Leer metadata desde IPFS

**Beneficio:** Datos ricos sin costo on-chain.

---

### **3. Eventos Estructurados para UI**

#### **Problema:**
- UI necesita actualizarse cuando hay eventos on-chain
- Actualmente hay que hacer polling

#### **Sugerencia:**
Usar `useScaffoldWatchContractEvent` para escuchar eventos en tiempo real:

```typescript
useScaffoldWatchContractEvent({
  contractName: "LosslessVault",
  eventName: "Deposit",
  onLogs: (logs) => {
    // Actualizar UI inmediatamente
    refetchUserBalance();
  }
});
```

**Beneficio:** UI reactiva sin polling constante.

---

### **4. Cálculo de Proyecciones Off-Chain**

#### **Problema:**
- Gráfica de proyección necesita cálculos complejos
- Hacerlo on-chain es costoso

#### **Sugerencia:**
Función helper en frontend:

```typescript
function calculateProjection(
  principal: number,
  apy: number = 0.10, // 10%
  periods: { daily: 1, weekly: 7, monthly: 30, quarterly: 90, yearly: 365 }
) {
  return Object.entries(periods).map(([period, days]) => ({
    period,
    yield: principal * (apy / 100) * (days / 365),
    total: principal + (principal * (apy / 100) * (days / 365))
  }));
}
```

**Beneficio:** Cálculos instantáneos, sin costo de gas.

---

### **5. Estado de Carga y Errores**

#### **Problema:**
- Transacciones pueden fallar
- Usuario no sabe qué está pasando

#### **Sugerencia:**
Estados claros en UI:

```typescript
type TransactionState = 
  | "idle"
  | "approving" 
  | "depositing"
  | "success"
  | "error";

// Mostrar en UI:
- Spinner durante "approving" y "depositing"
- Mensaje de éxito con link a scanner
- Mensaje de error con razón específica
```

**Beneficio:** Mejor UX, menos confusión.

---

### **6. Validaciones On-Chain y Off-Chain**

#### **Problema:**
- Validaciones solo on-chain = mal UX (gas wasted)
- Validaciones solo off-chain = inseguro

#### **Sugerencia:**
**Doble validación:**

```typescript
// Off-chain (antes de enviar)
function validateDonation(amount: bigint, balance: bigint) {
  if (amount <= 0n) throw new Error("Amount must be > 0");
  if (amount > balance) throw new Error("Insufficient balance");
  // ... más validaciones
}

// On-chain (en contrato)
require(amount > 0, "Amount must be > 0");
require(balance >= amount, "Insufficient balance");
```

**Beneficio:** Mejor UX + seguridad.

---

### **7. Testing de Flujos Completos**

#### **Problema:**
- Flujos complejos (donar → yield → split → governance)
- Difícil testear manualmente

#### **Sugerencia:**
Script de testing end-to-end:

```typescript
// packages/hardhat/scripts/test-full-flow.ts
async function testFullFlow() {
  // 1. Donante deposita
  // 2. Admin agrega yield
  // 3. Admin harvestea
  // 4. Verificar split
  // 5. Estudiante crea propuesta
  // 6. Estudiantes votan
  // 7. Universidad veta/aprueba
}
```

**Beneficio:** Validar flujo completo antes de demos.

---

### **8. Documentación de Contratos para Frontend**

#### **Problema:**
- Frontend necesita saber qué funciones llamar
- Parámetros pueden ser confusos

#### **Sugerencia:**
Archivo de documentación:

```typescript
// packages/nextjs/contracts/contract-interactions.md

## LosslessVault.deposit()

**Cuándo usar:** Cuando donante quiere depositar USDC

**Parámetros:**
- `assets`: Cantidad de USDC (en wei, 6 decimals)
- `receiver`: Address del donante

**Ejemplo:**
```typescript
await writeContractAsync({
  contractName: "LosslessVault",
  functionName: "deposit",
  args: [parseUnits("1000", 6), address]
});
```

**Beneficio:** Frontend developers saben exactamente qué hacer.

---

### **9. Manejo de Decimals Consistente**

#### **Problema:**
- USDC tiene 6 decimals
- ETH tiene 18 decimals
- Fácil confundirse

#### **Sugerencia:**
Helper functions:

```typescript
// utils/format.ts
export const USDC_DECIMALS = 6;

export function parseUSDC(amount: string): bigint {
  return parseUnits(amount, USDC_DECIMALS);
}

export function formatUSDC(amount: bigint): string {
  return formatUnits(amount, USDC_DECIMALS);
}
```

**Beneficio:** Menos errores, código más claro.

---

### **10. Loading States Granulares**

#### **Problema:**
- UI puede congelarse durante transacciones
- Usuario no sabe qué está pasando

#### **Sugerencia:**
Estados específicos:

```typescript
const [donationState, setDonationState] = useState<{
  step: "idle" | "checking-allowance" | "approving" | "depositing" | "success" | "error";
  message: string;
}>({ step: "idle", message: "" });
```

**Beneficio:** Usuario siempre sabe qué está pasando.

---

## 🎯 PRIORIZACIÓN DE IMPLEMENTACIÓN

### **Fase 1: Core (Crítico)**
1. ✅ Generar wallets universidades
2. ✅ Guardar logos
3. ✅ Modificar StudentRegistry
4. ✅ Crear UniversityRegistry
5. ✅ Integrar LosslessVault en `/fund/donate`

### **Fase 2: Dashboards (Importante)**
6. ✅ Dashboard Donor
7. ✅ Dashboard Student (mejorar)
8. ✅ Dashboard University

### **Fase 3: Features (Nice to Have)**
9. ⚠️ Admin panel yield
10. ⚠️ Governance UI
11. ⚠️ Proyecciones avanzadas

---

## 📋 CHECKLIST FINAL

### **Antes de Empezar:**
- [x] Decisiones confirmadas
- [ ] Logos guardados en `public/universities/`
- [ ] Wallets generadas
- [ ] APY actualizado a 10%

### **Durante Implementación:**
- [ ] Validar cada flujo completo
- [ ] Probar en Scroll Sepolia
- [ ] Verificar eventos en scanner
- [ ] Documentar funciones importantes

### **Antes de Demo:**
- [ ] Testear flujo completo end-to-end
- [ ] Preparar datos de prueba
- [ ] Verificar que todas las wallets tienen fondos
- [ ] Probar yield simulation

---

## 🚀 PRÓXIMOS PASOS

1. **Generar wallets** (script ya preparado)
2. **Guardar logos** (necesito que los subas o los guardo yo)
3. **Modificar contratos** (StudentRegistry, crear UniversityRegistry)
4. **Desplegar contratos actualizados**
5. **Implementar frontend** (en orden de prioridad)

¿Procedo con la generación de wallets y guardado de logos, o prefieres hacerlo tú?


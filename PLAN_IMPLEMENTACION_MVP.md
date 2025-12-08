# 📋 PLAN DE IMPLEMENTACIÓN - MVP EnDAOment

## 🎯 OBJETIVO
Integrar completamente los contratos inteligentes con el frontend según los requerimientos del MVP.

---

## 📊 ANÁLISIS DE REQUERIMIENTOS

### **1. DASHBOARD DONOR (Donante)**

#### **Componentes a Crear:**
- `app/donor/dashboard/page.tsx` - Dashboard principal del donante

#### **Datos a Mostrar (On-Chain):**
```typescript
// USDC disponible en cartera
useScaffoldReadContract({
  contractName: "MockUSDC",
  functionName: "balanceOf",
  args: [address]
})

// USDC utilizado para generar yield (principal depositado)
useScaffoldReadContract({
  contractName: "LosslessVault",
  functionName: "balanceOf",
  args: [address]
}) → convertir a assets

// Total assets del usuario
useScaffoldReadContract({
  contractName: "LosslessVault",
  functionName: "convertToAssets",
  args: [userShares]
})
```

#### **Gráfica de Proyección (Off-Chain Calculation):**
- **Input:** Capital depositado, APY estimado: **10% fijo** (simulado por MockAavePool)
- **Cálculo:** Proyección de yield diario, semanal, mensual, trimestral, anual
- **Librería:** Recharts o Chart.js para gráfica de líneas
- **Fórmula:** `yield = principal * (0.10) * (días / 365)`

#### **Lista de Iniciativas Apoyadas:**
- Leer eventos `Deposit` del LosslessVault
- Agrupar por universidad (necesitamos mapeo universidad → wallet)
- Mostrar historial de donaciones

#### **Perfil del Usuario:**
- Foto de perfil (IPFS o storage local)
- Nombre y descripción (localStorage o contrato nuevo)
- **Nota:** Podríamos crear un contrato `DonorProfile` o usar localStorage

#### **Botón "Donar":**
- Redirige a `/fund`

---

### **2. SECCIÓN "FUND"**

#### **Ruta:** `app/fund/page.tsx`

#### **Dos Secciones:**

##### **A. Universities** (`app/fund/universities/page.tsx`)
- **Tarjetas de Universidades:**
  - Tec de Monterrey
  - UNAM
  - IBERO
  - BUAP
  - UDLAP
  - ANAHUAC
  - etc.

- **Datos por Tarjeta:**
  ```typescript
  // Capital recaudado (principal depositado)
  // Necesitamos: mapeo universidad → wallet
  // Leer balance de USDC en wallet de universidad
  
  // Intereses generados (yield split)
  // Leer eventos YieldSplit del YieldSplitter
  // Filtrar por universityWallet
  ```

- **Progreso:**
  - Barra de progreso: Capital recaudado / Meta
  - Barra de progreso: Intereses generados

- **Botón "Fund this university":**
  - Redirige a `/fund/donate?university=[id]`

##### **B. Initiatives** (`app/fund/initiatives/page.tsx`)
- Mostrar "Coming Soon"
- Mantener estructura pero deshabilitar funcionalidad

---

### **3. FLUJO ESTUDIANTE - CUESTIONARIO INICIAL**

#### **Ruta:** `app/student/register/page.tsx`

#### **Preguntas del Cuestionario:**

1. **Universidad:**
   - Tarjetas con logos de universidades
   - Selección única
   - Guardar en estado

2. **Facultad, Carrera, Semestre:**
   - Inputs de texto
   - Guardar en estado

3. **Subir ID:**
   - Upload de imagen (cualquier imagen por ahora)
   - Guardar en IPFS o storage local
   - Mostrar preview

4. **Nombre:**
   - Input de texto
   - "¿Cómo quisieras que te llamemos?"

5. **Logros:**
   - Barras de selección (sliders o inputs numéricos):
     - Logros académicos: 0-10
     - Logros deportivos: 0-10
     - Logros estudiantiles: 0-10

#### **Al Enviar:**
```typescript
// 1. Registrar en StudentRegistry
writeContractAsync({
  contractName: "StudentRegistry",
  functionName: "registerStudent", // Necesitamos verificar si existe
  args: [address, name, university, researchArea]
})

// 2. Mint StudentSBT
// Necesitamos que StudentRegistry tenga permisos de minter
// O llamar directamente a StudentSBT.mint() si el usuario tiene permisos
```

**Problema Detectado:** `StudentRegistry` actual no tiene función `registerStudent` pública. Solo `addStudent` que es `onlyOwner`.

**Solución:** Necesitamos modificar `StudentRegistry` o crear función pública.

---

### **4. DASHBOARD ESTUDIANTE**

#### **Ruta:** `app/student/dashboard/page.tsx` (ya existe, necesita mejoras)

#### **Stats de Universidad:**
```typescript
// Leer todos los estudiantes de la universidad
// Calcular stats agregadas
// Mostrar: total estudiantes, total fondos recibidos, etc.
```

#### **Poder de Voto:**
```typescript
// Lógica sencilla basada en logros:
// Base: 1 voto (si tiene SBT)
// Bonus: +0.1 por cada logro académico
// Bonus: +0.1 por cada logro deportivo
// Bonus: +0.1 por cada logro estudiantil
// Máximo: 4 votos

// Verificar SBT
useScaffoldReadContract({
  contractName: "StudentSBT",
  functionName: "hasSBT",
  args: [address]
})

// Calcular poder de voto (off-chain basado en datos del cuestionario)
```

#### **Desglose de Fondos:**
- **Gráfico Lineal 1:** USDC aportado en el tiempo
  - Leer eventos `Deposit` del LosslessVault
  - Agrupar por fecha
  - Mostrar línea de tiempo

- **Gráfico Lineal 2:** Intereses generados en el tiempo
  - Leer eventos `YieldSplit` del YieldSplitter
  - Filtrar por universidad
  - Mostrar línea de tiempo

#### **Gráfico de Pastel:**
- **50% Operaciones** (Decajon - wallet de universidad)
- **20% Becas y Apoyos**
- **30% University DAO** (TimelockController)

**Problema:** No tenemos forma de rastrear cómo se gasta el yield después del split.

**Solución:** 
- Opción A: Mock data para MVP
- Opción B: Leer eventos de propuestas ejecutadas del Governor

#### **Botón "Ver Propuestas University DAO":**
- Redirige a `/student/governance` o `/governance/proposals`

---

### **5. SECCIÓN UNIVERSIDADES**

#### **Ruta:** `app/university/register/page.tsx`

#### **Flujo:**
1. Seleccionar universidad (tarjetas)
2. Conectar wallet (representativa para recibir intereses)
3. Guardar mapeo: universidad → wallet

**Problema:** ¿Dónde guardar este mapeo?

**Soluciones:**
- **Opción A:** Contrato nuevo `UniversityRegistry`
- **Opción B:** Modificar `YieldSplitter` para tener mapeo
- **Opción C:** Base de datos off-chain (no ideal para MVP)

**Recomendación:** Crear contrato `UniversityRegistry` simple.

#### **Dashboard Universidad:**
- Ver iniciativas votando en UniversityDAO
- Ver propuestas en Timelock
- Aprobar/Rechazar usando MyGovernor (veto)

---

### **6. INTEGRACIÓN LOSSLESSVAULT - DONACIÓN**

#### **Ruta:** `app/fund/donate/page.tsx`

#### **Flujo:**
1. Mostrar balance USDC disponible
2. Input para cantidad o botones sugeridos (10k, 50k, 100k)
3. Botón "Confirmar Donación"
4. Aprobar USDC → Depositar en LosslessVault

```typescript
// 1. Aprobar USDC
writeContractAsync({
  contractName: "MockUSDC",
  functionName: "approve",
  args: [losslessVaultAddress, amount]
})

// 2. Depositar en LosslessVault
writeContractAsync({
  contractName: "LosslessVault",
  functionName: "deposit",
  args: [amount, address] // assets, receiver
})

// 3. Verificar transacción en Scroll Sepolia Scanner
// Mostrar link a: https://sepolia.scrollscan.com/tx/{txHash}
```

---

### **7. DASHBOARD DONANTE - BOTONES DONAR Y RETIRAR**

#### **Botón "Donar":**
- Redirige a `/fund/donate`

#### **Botón "Retirar":**
```typescript
// Retirar principal del LosslessVault
writeContractAsync({
  contractName: "LosslessVault",
  functionName: "withdraw",
  args: [assets, receiver, owner]
})

// Esto retira del MockAavePool también (automático en el contrato)
```

---

### **8. SIMULACIÓN DE YIELD EN TIEMPO REAL**

#### **Problema:** ¿Cómo simular yield para que se vea en cadena?

#### **Solución:**

**Opción A: Admin Panel (Recomendado para MVP)**
- Crear página `/admin/yield` (solo para owner)
- Botón "Add Yield" que llama `MockAavePool.adminAddYield(amount)`
- Botón "Harvest Yield" que llama `LosslessVault.harvestYield()`
- Esto ejecuta automáticamente `YieldSplitter.splitYield()`

**Flujo Completo:**
```typescript
// 1. Admin agrega yield
writeContractAsync({
  contractName: "MockAavePool",
  functionName: "adminAddYield",
  args: [amount] // ej: 1000 USDC
})

// 2. Admin harvestea yield
writeContractAsync({
  contractName: "LosslessVault",
  functionName: "harvestYield",
  args: []
})
// Esto automáticamente:
// - Llama MockAavePool.harvestYield() → envía yield a YieldSplitter
// - Llama YieldSplitter.splitYield() → divide 50/50
```

**Opción B: Automatización (Futuro)**
- Keeper bot que ejecuta periódicamente
- Para MVP, manual es suficiente

---

### **9. FIJAR WALLETS DE UNIVERSIDADES**

#### **Problema:** ¿Cómo evitar que cambien las wallets en MVP?

#### **Solución:**

**Opción A: Contrato UniversityRegistry con Owner Only**
```solidity
contract UniversityRegistry is Ownable {
    mapping(string => address) public universityWallets;
    mapping(address => bool) public isLocked; // Para MVP, todas locked
    
    function setUniversityWallet(string memory university, address wallet) external onlyOwner {
        require(!isLocked[wallet], "Wallet is locked for MVP");
        universityWallets[university] = wallet;
    }
    
    function lockWallet(address wallet) external onlyOwner {
        isLocked[wallet] = true;
    }
}
```

**Opción B: Hardcode en YieldSplitter (Más Simple para MVP)**
- Modificar deployment script para setear wallets fijas
- No permitir cambios en MVP

**Recomendación:** Opción A es más flexible y profesional.

---

## 🔧 CAMBIOS NECESARIOS EN CONTRATOS

### **1. StudentRegistry - Agregar Función Pública**
```solidity
function registerStudent(
    string calldata name,
    string calldata university,
    string calldata researchArea,
    string calldata studentId,
    uint256 academicAchievements,
    uint256 sportsAchievements,
    uint256 studentAchievements
) external {
    require(!isRegistered[msg.sender], "Already registered");
    // ... registro
    // Mint SBT automáticamente
}
```

### **2. Crear UniversityRegistry**
```solidity
contract UniversityRegistry is Ownable {
    struct University {
        string name;
        address wallet;
        bool isActive;
        bool isLocked; // Para MVP
    }
    
    mapping(string => University) public universities;
    
    function registerUniversity(string memory name, address wallet) external onlyOwner {
        // ...
    }
}
```

### **3. Modificar YieldSplitter para Usar UniversityRegistry**
- O mantener simple y hardcodear en deployment

---

## 📁 ESTRUCTURA DE ARCHIVOS A CREAR

```
packages/nextjs/app/
├── donor/
│   └── dashboard/
│       └── page.tsx (NUEVO)
├── fund/
│   ├── page.tsx (NUEVO - Landing con tabs)
│   ├── universities/
│   │   └── page.tsx (NUEVO)
│   ├── initiatives/
│   │   └── page.tsx (NUEVO - Coming Soon)
│   └── donate/
│       └── page.tsx (NUEVO)
├── student/
│   ├── register/
│   │   └── page.tsx (NUEVO - Cuestionario)
│   └── dashboard/
│       └── page.tsx (MEJORAR existente)
├── university/
│   ├── register/
│   │   └── page.tsx (NUEVO)
│   └── dashboard/
│       └── page.tsx (NUEVO)
├── admin/
│   └── yield/
│       └── page.tsx (NUEVO - Solo owner)
└── governance/
    └── proposals/
        └── page.tsx (NUEVO - Ver propuestas)
```

---

## 🎨 COMPONENTES A CREAR

```
packages/nextjs/components/
├── donor/
│   ├── DonorDashboard.tsx
│   ├── DonationProjectionChart.tsx
│   └── SupportedInitiativesList.tsx
├── fund/
│   ├── UniversityCard.tsx
│   └── DonateForm.tsx
├── student/
│   ├── StudentRegistrationForm.tsx
│   ├── UniversitySelector.tsx
│   └── VotingPowerDisplay.tsx
├── university/
│   ├── UniversityCard.tsx
│   └── ProposalList.tsx
└── charts/
    ├── LineChart.tsx
    └── PieChart.tsx
```

---

## ❓ PREGUNTAS PARA RESOLVER ANTES DE IMPLEMENTAR

1. **¿Crear UniversityRegistry o hardcodear wallets?**
   - Recomendación: Crear contrato simple

2. **¿Modificar StudentRegistry o crear función wrapper?**
   - Recomendación: Modificar para agregar función pública

3. **¿Dónde guardar perfil de donante (foto, nombre, descripción)?**
   - Opción A: Contrato DonorProfile
   - Opción B: localStorage + IPFS para foto
   - Recomendación: localStorage para MVP, contrato para producción

4. **¿Cómo rastrear gastos de yield (50% ops, 20% becas, 30% DAO)?**
   - Opción A: Mock data para MVP
   - Opción B: Leer eventos de propuestas ejecutadas
   - Recomendación: Mock data + estructura para futuro

5. **¿APY fijo o dinámico para proyecciones?**
   - ✅ **Confirmado: 10% APY fijo** para MVP (simulado por MockAavePool)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Contratos (Backend)**
- [ ] Modificar StudentRegistry para función pública
- [ ] Crear UniversityRegistry
- [ ] Actualizar deployment scripts
- [ ] Desplegar contratos actualizados

### **Fase 2: Donor Dashboard**
- [ ] Crear `/donor/dashboard`
- [ ] Integrar lectura de LosslessVault
- [ ] Crear gráfica de proyección
- [ ] Lista de iniciativas apoyadas
- [ ] Perfil de usuario

### **Fase 3: Fund Section**
- [ ] Crear `/fund` con tabs
- [ ] Crear `/fund/universities` con tarjetas
- [ ] Crear `/fund/initiatives` (Coming Soon)
- [ ] Crear `/fund/donate` con integración LosslessVault

### **Fase 4: Student Flow**
- [ ] Crear `/student/register` con cuestionario
- [ ] Integrar StudentRegistry + StudentSBT mint
- [ ] Mejorar `/student/dashboard`
- [ ] Agregar gráficas y stats

### **Fase 5: University Flow**
- [ ] Crear `/university/register`
- [ ] Crear `/university/dashboard`
- [ ] Integrar con MyGovernor para veto

### **Fase 6: Admin & Yield Simulation**
- [ ] Crear `/admin/yield`
- [ ] Integrar MockAavePool.adminAddYield
- [ ] Integrar LosslessVault.harvestYield

### **Fase 7: Governance**
- [ ] Crear `/governance/proposals`
- [ ] Integrar MyGovernor para crear/votar propuestas
- [ ] Mostrar propuestas en Timelock

---

## 🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Contratos** (StudentRegistry, UniversityRegistry)
2. **Fund/Donate** (Core functionality)
3. **Donor Dashboard** (Visualización)
4. **Student Registration** (Onboarding)
5. **Student Dashboard** (Experiencia completa)
6. **University Flow** (Completar ecosistema)
7. **Admin Panel** (Yield simulation)
8. **Governance** (Propuestas y votación)

---

## 📝 NOTAS IMPORTANTES

1. **Mock Data:** Usar mock data donde sea necesario para MVP, estructurar para migrar a on-chain después

2. **APY:** Usar 5% APY fijo para cálculos de proyección

3. **Universidades:** Lista hardcodeada de universidades mexicanas con logos

4. **Scroll Sepolia:** Todas las transacciones deben mostrar link a scanner

5. **Testing:** Probar cada flujo completo antes de avanzar

---

## ⚠️ DECISIONES PENDIENTES

Por favor confirma:
1. ¿Crear UniversityRegistry o hardcodear?
2. ¿Modificar StudentRegistry o crear wrapper?
3. ¿Dónde guardar perfil de donante?
4. ¿APY fijo (5%) o configurable?
5. ¿Mock data para gastos de yield o leer eventos?

Una vez confirmado, procedo con la implementación.


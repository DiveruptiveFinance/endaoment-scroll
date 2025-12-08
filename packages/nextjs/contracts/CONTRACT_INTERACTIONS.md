# 📚 Guía de Interacciones con Contratos - EnDAOment

Esta guía documenta cómo interactuar con cada contrato desde el frontend.

---

## 🏦 LosslessVault

### **Depositar USDC**

**Cuándo usar:** Cuando un donante quiere depositar USDC al vault.

**Función:** `deposit(uint256 assets, address receiver)`

**Parámetros:**
- `assets`: Cantidad de USDC en wei (6 decimals)
- `receiver`: Address del donante (quien recibe las shares)

**Ejemplo:**
```typescript
import { parseUSDC } from "~~/utils/format";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const { writeContractAsync } = useScaffoldWriteContract("LosslessVault");

await writeContractAsync({
  functionName: "deposit",
  args: [parseUSDC("1000"), address], // 1000 USDC
});
```

**Eventos:**
- `Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)`

---

### **Retirar Principal**

**Cuándo usar:** Cuando un donante quiere retirar su principal.

**Función:** `withdraw(uint256 assets, address receiver, address owner)`

**Parámetros:**
- `assets`: Cantidad de USDC a retirar
- `receiver`: Address que recibe los USDC
- `owner`: Owner de las shares (típicamente el donante)

**Ejemplo:**
```typescript
await writeContractAsync({
  functionName: "withdraw",
  args: [parseUSDC("500"), address, address], // Retirar 500 USDC
});
```

**Eventos:**
- `Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)`

---

### **Leer Balance del Usuario**

**Función:** `balanceOf(address account)`

**Ejemplo:**
```typescript
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { formatUSDC } from "~~/utils/format";

const { data: shares } = useScaffoldReadContract({
  contractName: "LosslessVault",
  functionName: "balanceOf",
  args: [address],
});

// Convertir shares a assets
const { data: assets } = useScaffoldReadContract({
  contractName: "LosslessVault",
  functionName: "convertToAssets",
  args: [shares || 0n],
});

const formatted = formatUSDC(assets); // "1000.00"
```

---

### **Ver Yield Disponible**

**Función:** `getAvailableYield()`

**Ejemplo:**
```typescript
const { data: availableYield } = useScaffoldReadContract({
  contractName: "LosslessVault",
  functionName: "getAvailableYield",
});

const formatted = formatUSDC(availableYield);
```

---

### **Harvestear Yield (Solo Owner/Admin)**

**Función:** `harvestYield()`

**Cuándo usar:** En panel admin para harvestear yield y enviarlo al YieldSplitter.

**Ejemplo:**
```typescript
await writeContractAsync({
  functionName: "harvestYield",
  args: [],
});
```

**Eventos:**
- `YieldHarvested(uint256 amount, address indexed to)`

---

## 🏊 MockAavePool

### **Agregar Yield (Solo Owner/Admin)**

**Función:** `adminAddYield(uint256 amount)`

**Cuándo usar:** En panel admin para simular yield generation.

**Ejemplo:**
```typescript
const { writeContractAsync } = useScaffoldWriteContract("MockAavePool");

await writeContractAsync({
  functionName: "adminAddYield",
  args: [parseUSDC("1000")], // Agregar 1000 USDC de yield
});
```

**Eventos:**
- `YieldAdded(uint256 amount, uint256 timestamp)`

---

### **Ver Yield Disponible**

**Función:** `getAvailableYield()`

**Ejemplo:**
```typescript
const { data: availableYield } = useScaffoldReadContract({
  contractName: "MockAavePool",
  functionName: "getAvailableYield",
});
```

---

## 💰 YieldSplitter

### **Dividir Yield**

**Función:** `splitYield()`

**Cuándo usar:** Automáticamente llamado por LosslessVault.harvestYield(), pero puede llamarse manualmente.

**Ejemplo:**
```typescript
const { writeContractAsync } = useScaffoldWriteContract("YieldSplitter");

await writeContractAsync({
  functionName: "splitYield",
  args: [],
});
```

**Eventos:**
- `YieldSplit(uint256 totalAmount, uint256 universityAmount, uint256 daoAmount, address indexed universityWallet, address indexed timelockController)`

---

### **Ver Balance Pendiente**

**Función:** `getYieldBalance()`

**Ejemplo:**
```typescript
const { data: balance } = useScaffoldReadContract({
  contractName: "YieldSplitter",
  functionName: "getYieldBalance",
});
```

---

## 🎓 StudentRegistry

### **Registrar Estudiante (Público)**

**Función:** `registerStudent(...)`

**Parámetros:**
- `name`: Nombre completo
- `university`: Universidad
- `researchArea`: Facultad/Carrera
- `studentId`: ID o matrícula
- `academicAchievements`: Logros académicos (0-10)
- `sportsAchievements`: Logros deportivos (0-10)
- `studentAchievements`: Logros estudiantiles (0-10)

**Ejemplo:**
```typescript
const { writeContractAsync } = useScaffoldWriteContract("StudentRegistry");

await writeContractAsync({
  functionName: "registerStudent",
  args: [
    "Juan Pérez",
    "UNAM",
    "Ingeniería",
    "12345678",
    8, // academic
    5, // sports
    3, // student
  ],
});
```

**Eventos:**
- `StudentAdded(address indexed studentAddress, string name, string university)`

---

### **Obtener Perfil de Estudiante**

**Función:** `getStudent(address studentAddress)`

**Ejemplo:**
```typescript
const { data: student } = useScaffoldReadContract({
  contractName: "StudentRegistry",
  functionName: "getStudent",
  args: [address],
});
```

---

## 🎫 StudentSBT

### **Verificar si Tiene SBT**

**Función:** `hasSBT(address student)`

**Ejemplo:**
```typescript
const { data: hasSBT } = useScaffoldReadContract({
  contractName: "StudentSBT",
  functionName: "hasSBT",
  args: [address],
});
```

---

### **Obtener Poder de Voto**

**Función:** `getVotes(address account)`

**Ejemplo:**
```typescript
const { data: votes } = useScaffoldReadContract({
  contractName: "StudentSBT",
  functionName: "getVotes",
  args: [address],
});
```

---

## 🏛️ UniversityRegistry

### **Obtener Universidad por ID**

**Función:** `getUniversity(string memory universityId)`

**Ejemplo:**
```typescript
const { data: university } = useScaffoldReadContract({
  contractName: "UniversityRegistry",
  functionName: "getUniversity",
  args: ["unam"],
});
```

---

### **Obtener Todas las Universidades Activas**

**Función:** `getActiveUniversityIds()`

**Ejemplo:**
```typescript
const { data: activeIds } = useScaffoldReadContract({
  contractName: "UniversityRegistry",
  functionName: "getActiveUniversityIds",
});
```

---

## 📊 DonationTracker

### **Leer Donaciones de una Universidad**

**Función:** `getTotalDonations(address university)`

**Ejemplo:**
```typescript
const { data: totalDonations } = useScaffoldReadContract({
  contractName: "DonationTracker",
  functionName: "getTotalDonations",
  args: [universityWallet],
});
```

---

### **Leer Yield Distribuido**

**Función:** `getTotalYieldDistributed(address university)`

**Ejemplo:**
```typescript
const { data: totalYield } = useScaffoldReadContract({
  contractName: "DonationTracker",
  functionName: "getTotalYieldDistributed",
  args: [universityWallet],
});
```

---

### **Escuchar Eventos en Tiempo Real**

**Ejemplo:**
```typescript
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";

useScaffoldWatchContractEvent({
  contractName: "DonationTracker",
  eventName: "DonationMade",
  onLogs: (logs) => {
    logs.forEach((log) => {
      console.log("New donation:", log.args);
      // Actualizar UI
      refetchDonations();
    });
  },
});
```

---

## 🗳️ MyGovernor

### **Crear Propuesta**

**Función:** `propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)`

**Ejemplo:**
```typescript
const { writeContractAsync } = useScaffoldWriteContract("MyGovernor");

await writeContractAsync({
  functionName: "propose",
  args: [
    [targetAddress], // targets
    [0n], // values
    [calldata], // calldatas
    "Description of proposal",
  ],
});
```

---

### **Votar en Propuesta**

**Función:** `castVote(uint256 proposalId, uint8 support)`

**Support values:**
- `0` = Against
- `1` = For
- `2` = Abstain

**Ejemplo:**
```typescript
await writeContractAsync({
  functionName: "castVote",
  args: [proposalId, 1], // Vote "For"
});
```

---

## 💡 Mejores Prácticas

1. **Siempre validar off-chain antes de enviar**
2. **Usar helper functions** (`parseUSDC`, `formatUSDC`)
3. **Mostrar estados de carga claros**
4. **Escuchar eventos** para UI reactiva
5. **Manejar errores** con mensajes específicos


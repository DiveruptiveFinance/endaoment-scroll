# 📚 Documentación: Páginas y Contratos - enDAOment

## 🌐 PÁGINAS DISPONIBLES

### 🏠 **Página Principal**
- **URL:** `/` o `https://endaoment-scroll2.vercel.app/`
- **Descripción:** Landing page principal del proyecto
- **Funcionalidad:**
  - Muestra estadísticas del platform (Total Donated, Yield Generated, Students Supported)
  - Botones para elegir rol: "Student" o "Donor"
  - Botón "Donar" que redirige a `/fund/universities`
  - Botón "University" que redirige a `/university/register`
  - Sección de estudiantes destacados
  - Explicación de "How It Works"

---

### 💰 **Donación - Lista de Universidades**
- **URL:** `/fund/universities`
- **Descripción:** Lista todas las universidades disponibles para donar
- **Funcionalidad:**
  - Muestra tarjetas de universidades (UNAM, IBERO, BUAP, UDLAP, ANAHUAC, TEC)
  - Cada tarjeta muestra:
    - Capital recaudado
    - Yield generado
    - Progreso hacia la meta
  - Botón para donar a cada universidad

---

### 💸 **Donación - Formulario de Donación**
- **URL:** `/fund/donate`
- **Descripción:** Página para realizar donaciones a universidades
- **Funcionalidad:**
  - Selección de universidad
  - Input de cantidad a donar (en USDC)
  - Validación de balance suficiente
  - Aprobación de USDC al contrato `LosslessVault`
  - Depósito de fondos en el vault
  - Tracking de transacciones con estados claros (idle, approving, depositing, success, error)

---

### 👨‍🎓 **Estudiante - Registro**
- **URL:** `/student/register`
- **Descripción:** Registro de estudiantes en el sistema
- **Funcionalidad:**
  - Proceso de 3 pasos:
    1. **Información Personal:** Nombre, facultad, carrera, semestre
    2. **Documentos:** Subida de identificación (IPFS mock)
    3. **Confirmación:** Revisión y registro final
  - Registro en contrato `StudentRegistry`
  - Validación de datos antes de enviar a blockchain

---

### 👨‍🎓 **Estudiante - Dashboard**
- **URL:** `/student/dashboard`
- **Descripción:** Panel de control para estudiantes
- **Funcionalidad:**
  - Muestra información del estudiante registrado
  - Estado de registro
  - Información de SBT (Soulbound Token) si está mintado
  - Acceso a otras funcionalidades de estudiante

---

### 💼 **Donante - Dashboard**
- **URL:** `/donor/dashboard`
- **Descripción:** Panel de control para donantes
- **Funcionalidad:**
  - Muestra balance de USDC del usuario
  - Balance depositado en `LosslessVault`
  - Yield generado y disponible
  - Proyecciones de yield (gráficos con Recharts)
  - Botón para retirar principal

---

### 💼 **Donante - Retirar Principal**
- **URL:** `/donor/withdraw`
- **Descripción:** Página para retirar el principal depositado
- **Funcionalidad:**
  - Muestra balance disponible para retiro
  - Input de cantidad a retirar
  - Validación de balance suficiente
  - Retiro desde `LosslessVault`
  - Tracking de transacciones

---

### 🏛️ **Universidad - Registro**
- **URL:** `/university/register`
- **Descripción:** Registro de universidades en el sistema
- **Funcionalidad:**
  - Selección de universidad de una lista
  - Registro en contrato `UniversityRegistry`
  - Asociación de wallet de universidad
  - Validación de que la universidad no esté ya registrada

---

### ⚙️ **Admin - Simular Yield**
- **URL:** `/admin/yield`
- **Descripción:** Panel administrativo para simular generación de yield
- **Funcionalidad:**
  - Simulación de yield desde `MockAavePool` a `LosslessVault`
  - Función `harvestYield()` para transferir yield generado
  - Visualización de yield disponible
  - Solo para administradores

---

### 🔍 **Debug - Contratos**
- **URL:** `/debug`
- **Descripción:** Interfaz de debug para interactuar con contratos
- **Funcionalidad:**
  - Lista todos los contratos desplegados
  - Permite llamar funciones de lectura y escritura
  - Útil para testing y desarrollo

---

### 📊 **Block Explorer**
- **URL:** `/blockexplorer`
- **Descripción:** Explorador de bloques y transacciones
- **Funcionalidad:**
  - Búsqueda de direcciones
  - Visualización de transacciones
  - Detalles de contratos

---

## 🔗 CONTRATOS DISPONIBLES

### 1. **MockUSDC** 
- **Address:** `0xaE742c7414937A43177bD1bF9cDBFCaF1a6E2Ccb`
- **Descripción:** Token ERC20 mock que simula USDC con 6 decimales
- **Funciones principales:**
  - `mint(address to, uint256 amount)`: Mint tokens (solo owner o minters)
  - `faucet()`: Cualquiera puede llamar para obtener 10,000 USDC gratis
  - `transfer(address to, uint256 amount)`: Transferir tokens
  - `approve(address spender, uint256 amount)`: Aprobar gasto
  - `balanceOf(address account)`: Consultar balance
- **Uso:** Token base para todas las transacciones del platform

---

### 2. **MockAavePool**
- **Address:** `0x72b012CacAa2Efd546c445A4F183EF2acaCf9B68`
- **Descripción:** Simula un pool de Aave para generar yield
- **Funciones principales:**
  - `supply(uint256 amount, address onBehalfOf)`: Depositar USDC
  - `withdraw(uint256 amount, address to)`: Retirar USDC
  - `adminAddYield(uint256 amount)`: Agregar yield (solo owner)
  - `getUserSupply(address user)`: Consultar balance depositado
- **Uso:** Genera yield sobre los fondos depositados

---

### 3. **LosslessVault**
- **Address:** (Pendiente de deploy)
- **Descripción:** Vault principal donde se depositan las donaciones
- **Funcionalidad:**
  - Recibe donaciones de USDC
  - Deposita en MockAavePool para generar yield
  - Permite retiro del principal
  - Distribuye yield a través de YieldSplitter
- **Flujo:**
  1. Donante aprueba USDC → LosslessVault
  2. Donante deposita en LosslessVault
  3. LosslessVault deposita en MockAavePool
  4. Yield se genera automáticamente
  5. Yield se distribuye 50/50 (Universidad / DAO Treasury)

---

### 4. **YieldSplitter**
- **Address:** (Pendiente de deploy)
- **Descripción:** Divide el yield 50/50 entre universidad y DAO Treasury
- **Funciones principales:**
  - `splitYield(uint256 amount)`: Divide el yield
  - `distributeToUniversity(uint256 amount)`: Envía a wallet de universidad
  - `distributeToTreasury(uint256 amount)`: Envía a TimelockController (DAO)
- **Uso:** Distribución automática de yield

---

### 5. **StudentRegistry**
- **Address:** `0xb7C7Af8E4c6e13193ee38Ef776D2364d4E9E002C`
- **Descripción:** Registro de estudiantes en el sistema
- **Funciones principales:**
  - `registerStudent(string memory name, string memory faculty, string memory career, uint256 semester, string memory idDocumentHash)`: Registrar estudiante
  - `isStudentRegistered(address student)`: Verificar si está registrado
  - `getStudentInfo(address student)`: Obtener información del estudiante
- **Uso:** Gestión de estudiantes y mint de SBT

---

### 6. **UniversityRegistry**
- **Address:** (Pendiente de deploy)
- **Descripción:** Registro de universidades
- **Funciones principales:**
  - `registerUniversity(string memory universityId, address wallet)`: Registrar universidad
  - `isUniversityRegistered(string memory universityId)`: Verificar registro
  - `getUniversityWallet(string memory universityId)`: Obtener wallet
- **Uso:** Asociar universidades con sus wallets para recibir yield

---

### 7. **DonationTracker**
- **Address:** (Pendiente de deploy)
- **Descripción:** Rastrea donaciones y yield por universidad
- **Funciones principales:**
  - `trackDonation(string memory universityId, uint256 amount)`: Registrar donación
  - `getTotalDonated(string memory universityId)`: Total donado
  - `getTotalYield(string memory universityId)`: Total yield generado
- **Uso:** Estadísticas y tracking de donaciones

---

### 8. **AllocationManager**
- **Address:** `0x9D219b2A64B0E2BA1659E37Bf4C25bA15639B240`
- **Descripción:** Gestiona la distribución de yield a estudiantes
- **Funciones principales:**
  - `createEpoch()`: Crear nuevo epoch de distribución
  - `finalizeEpoch()`: Finalizar epoch y distribuir
  - `registerVault(address vault)`: Registrar vault
- **Uso:** Sistema de epochs para distribución periódica

---

### 9. **TimelockController**
- **Address:** (Pendiente de deploy)
- **Descripción:** Control de tiempo para propuestas de gobernanza
- **Funcionalidad:**
  - Delay de 1 hora para ejecución de propuestas
  - Roles: Proposer (Governor), Executor (abierto), Canceller (Universidad)
- **Uso:** Seguridad en gobernanza DAO

---

## 🔄 FLUJO COMPLETO DEL SISTEMA

### **Flujo de Donación:**
```
1. Usuario va a /fund/universities
2. Selecciona una universidad
3. Va a /fund/donate?university=UNAM
4. Ingresa cantidad a donar
5. Aprueba USDC → LosslessVault (si es necesario)
6. Deposita USDC en LosslessVault
7. LosslessVault deposita en MockAavePool
8. Yield se genera automáticamente (10% APY)
9. Yield se distribuye 50/50 (Universidad / DAO Treasury)
10. DonationTracker registra la donación
```

### **Flujo de Registro de Estudiante:**
```
1. Usuario va a /student/register
2. Completa información personal (Paso 1)
3. Sube documento de identificación (Paso 2 - IPFS)
4. Revisa y confirma (Paso 3)
5. Se registra en StudentRegistry
6. Se mintea SBT (Soulbound Token) si aplica
7. Estudiante puede acceder a /student/dashboard
```

### **Flujo de Yield:**
```
1. Donaciones se depositan en LosslessVault
2. LosslessVault deposita en MockAavePool
3. Admin puede simular yield en /admin/yield
4. Yield se genera (10% APY fijo)
5. YieldSplitter divide 50/50:
   - 50% → Wallet de Universidad
   - 50% → TimelockController (DAO Treasury)
6. AllocationManager distribuye yield a estudiantes cada epoch
```

---

## 💡 CÓMO USAR MockUSDC

### **Obtener USDC Gratis (Faucet):**
```typescript
// Cualquiera puede llamar esta función para obtener 10,000 USDC
const { writeContractAsync } = useScaffoldWriteContract("MockUSDC");
await writeContractAsync({
  functionName: "faucet",
});
```

### **Mint USDC (Solo Owner o Minters):**
```typescript
// Solo el owner o direcciones autorizadas pueden mint
const { writeContractAsync } = useScaffoldWriteContract("MockUSDC");
await writeContractAsync({
  functionName: "mint",
  args: [
    "0x2fa252f1b0b095e1ed6ba6dfdc40abe04d42b5d1", // dirección destino
    "10000000000" // 10,000 USDC (con 6 decimales = 10,000 * 10^6)
  ],
});
```

### **Transferir USDC:**
```typescript
// Transferir desde tu wallet
const { writeContractAsync } = useScaffoldWriteContract("MockUSDC");
await writeContractAsync({
  functionName: "transfer",
  args: [
    "0x2fa252f1b0b095e1ed6ba6dfdc40abe04d42b5d1", // dirección destino
    "10000000000" // 10,000 USDC (con 6 decimales)
  ],
});
```

### **Transferir USDC usando Script (Recomendado para grandes cantidades):**
```bash
# Transferir 10,000,000 USDC a una dirección específica
cd packages/hardhat
npx hardhat run scripts/transfer-usdc.ts --network scrollSepolia

# O con una dirección personalizada:
TARGET_ADDRESS=0x2fa252f1b0b095e1ed6ba6dfdc40abe04d42b5d1 npx hardhat run scripts/transfer-usdc.ts --network scrollSepolia
```

**El script automáticamente:**
- Verifica el balance del deployer
- Si no tiene suficiente, hace mint automáticamente (si es owner/minter)
- Transfiere 10,000,000 USDC a la dirección destino
- Muestra balances antes y después

### **Consultar Balance:**
```typescript
const { data: balance } = useScaffoldReadContract({
  contractName: "MockUSDC",
  functionName: "balanceOf",
  args: ["0x2fa252f1b0b095e1ed6ba6dfdc40abe04d42b5d1"],
});
```

---

## 📝 NOTAS IMPORTANTES

- **Decimales:** MockUSDC usa 6 decimales (como USDC real)
  - 1 USDC = 1,000,000 (en wei)
  - 10,000 USDC = 10,000,000,000 (10,000 * 10^6)

- **Red:** Scroll Sepolia Testnet (Chain ID: 534351)

- **Contratos Pendientes de Deploy:**
  - LosslessVault
  - YieldSplitter
  - TimelockController
  - UniversityRegistry
  - DonationTracker

- **Para Testing:** Usa la función `faucet()` para obtener USDC gratis


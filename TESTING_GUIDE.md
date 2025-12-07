# 🧪 Guía de Testing - EnDAOment Scroll Hackathon

## ✅ Compilación Exitosa

Todos los contratos compilan correctamente:
- ✅ MockAavePool.sol
- ✅ LosslessVault.sol
- ✅ YieldSplitter.sol
- ✅ StudentSBT.sol
- ✅ MyGovernor.sol
- ✅ TimelockController (OpenZeppelin)

---

## 🚀 Cómo Probar el Sistema

### Opción 1: Testing Local (Recomendado para empezar)

#### Paso 1: Iniciar Blockchain Local

```bash
# Terminal 1: Inicia Hardhat Network
yarn chain
```

Esto iniciará una blockchain local en `http://localhost:8545` con cuentas pre-fundeadas.

#### Paso 2: Desplegar Contratos

```bash
# Terminal 2: Desplegar todos los contratos
yarn deploy
```

Esto desplegará los contratos en este orden:
1. MockUSDC
2. MockAavePool
3. TimelockController
4. YieldSplitter
5. StudentSBT
6. MyGovernor
7. LosslessVault

#### Paso 3: Verificar Despliegue

Los contratos desplegados estarán en:
- `packages/hardhat/deployments/localhost/`

### Opción 2: Testing en Scroll Sepolia

#### Paso 1: Configurar Variables de Entorno

Crea `.env` en `packages/hardhat/`:

```bash
# .env
DEPLOYER_PRIVATE_KEY_ENCRYPTED=tu_clave_encriptada
UNIVERSITY_WALLET=0x... # Dirección del multisig (o deployer para test)
ALCHEMY_API_KEY=tu_alchemy_key
```

#### Paso 2: Obtener ETH de Testnet

1. Ve a: https://scroll.io/faucet
2. Conecta tu wallet
3. Solicita ETH de Scroll Sepolia

#### Paso 3: Desplegar a Scroll Sepolia

```bash
yarn deploy --network scrollSepolia
```

#### Paso 4: Verificar en Block Explorer

- **Scroll Sepolia Explorer**: https://sepolia.scrollscan.com/
- Busca las direcciones de tus contratos desplegados

---

## 📝 Script de Testing Manual

### 1. Setup Inicial

```bash
# Compilar
yarn hardhat:compile

# Iniciar blockchain local
yarn chain  # Terminal 1

# Desplegar
yarn deploy  # Terminal 2
```

### 2. Testing con Hardhat Console

```bash
# Abre Hardhat console
yarn hardhat console --network localhost
```

En la consola, puedes interactuar con los contratos:

```javascript
// Obtener contratos
const MockUSDC = await ethers.getContract("MockUSDC");
const MockAavePool = await ethers.getContract("MockAavePool");
const LosslessVault = await ethers.getContract("LosslessVault");
const StudentSBT = await ethers.getContract("StudentSBT");
const YieldSplitter = await ethers.getContract("YieldSplitter");

// Obtener cuentas
const [deployer, donor, student1, student2] = await ethers.getSigners();

// Verificar balances iniciales
console.log("Deployer USDC:", await MockUSDC.balanceOf(deployer.address));
```

### 3. Flujo Completo de Demo

#### A. Registrar Estudiantes y Darles SBT

```javascript
// En Hardhat console
const StudentSBT = await ethers.getContract("StudentSBT");
const [deployer, student1, student2] = await ethers.getSigners();

// Mint SBT a estudiantes
await StudentSBT.mint(student1.address);
await StudentSBT.mint(student2.address);

// Verificar
console.log("Student1 tiene SBT:", await StudentSBT.hasSBT(student1.address));
console.log("Voting power Student1:", await StudentSBT.getVotes(student1.address));
```

#### B. Donante Deposita USDC al Vault

```javascript
const MockUSDC = await ethers.getContract("MockUSDC");
const LosslessVault = await ethers.getContract("LosslessVault");
const [deployer, donor] = await ethers.getSigners();

// Aprobar vault para gastar USDC
const depositAmount = ethers.parseUnits("1000", 6); // 1000 USDC
await MockUSDC.approve(await LosslessVault.getAddress(), depositAmount);

// Depositar
await LosslessVault.deposit(depositAmount, donor.address);

// Verificar
console.log("Vault shares:", await LosslessVault.balanceOf(donor.address));
console.log("Total assets:", await LosslessVault.totalAssets());
```

#### C. Generar Yield (Demo)

```javascript
const MockAavePool = await ethers.getContract("MockAavePool");

// Generar yield instantáneamente (5% = 50 USDC)
const yieldAmount = ethers.parseUnits("50", 6);
await MockAavePool.adminAddYield(yieldAmount);

// Verificar yield disponible
console.log("Yield disponible:", await MockAavePool.getAvailableYield());
```

#### D. Harvest Yield y Split

```javascript
const LosslessVault = await ethers.getContract("LosslessVault");
const YieldSplitter = await ethers.getContract("YieldSplitter");
const MockUSDC = await ethers.getContract("MockUSDC");
const TimelockController = await ethers.getContract("TimelockController");

// Harvest yield (envía al splitter)
await LosslessVault.harvestYield();

// Splitter divide automáticamente 50/50
await YieldSplitter.splitYield();

// Verificar distribución
const universityWallet = await YieldSplitter.universityWallet();
const timelockAddress = await TimelockController.getAddress();

console.log("University balance:", await MockUSDC.balanceOf(universityWallet));
console.log("DAO Treasury balance:", await MockUSDC.balanceOf(timelockAddress));
```

#### E. Testing Governance (Opcional)

```javascript
const MyGovernor = await ethers.getContract("MyGovernor");
const StudentSBT = await ethers.getContract("StudentSBT");
const [deployer, student1] = await ethers.getSigners();

// Crear una propuesta (ejemplo: transferir USDC del Timelock)
const TimelockController = await ethers.getContract("TimelockController");
const MockUSDC = await ethers.getContract("MockUSDC");

// Preparar calldata para transferir USDC
const targets = [await MockUSDC.getAddress()];
const values = [0];
const calldatas = [
  MockUSDC.interface.encodeFunctionData("transfer", [
    student1.address,
    ethers.parseUnits("10", 6)
  ])
];
const description = "Transfer 10 USDC to student1";

// Proponer (solo si tienes SBT)
const proposalTx = await MyGovernor.propose(targets, values, calldatas, description);
const receipt = await proposalTx.wait();
const proposalId = receipt.logs[0].args.proposalId;

console.log("Proposal ID:", proposalId);

// Votar (Student1 vota a favor)
await MyGovernor.connect(student1).castVote(proposalId, 1); // 1 = For

// Esperar que termine el voting period (150 blocks ≈ 5 min en local)
// Luego la propuesta pasa a Timelock
```

---

## 🧪 Tests Automatizados

### Crear Test Básico

Crea `packages/hardhat/test/LosslessVault.test.ts`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("LosslessVault", function () {
  let mockUSDC: any;
  let mockAavePool: any;
  let yieldSplitter: any;
  let losslessVault: any;
  let deployer: any;
  let donor: any;

  beforeEach(async function () {
    [deployer, donor] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();

    // Deploy MockAavePool
    const MockAavePool = await ethers.getContractFactory("MockAavePool");
    mockAavePool = await MockAavePool.deploy(await mockUSDC.getAddress());
    await mockUSDC.addMinter(await mockAavePool.getAddress());

    // Deploy YieldSplitter (necesita TimelockController)
    // ... (completa según tus necesidades)

    // Deploy LosslessVault
    const LosslessVault = await ethers.getContractFactory("LosslessVault");
    losslessVault = await LosslessVault.deploy(
      await mockUSDC.getAddress(),
      "Test Vault",
      "TV",
      await mockAavePool.getAddress(),
      await yieldSplitter.getAddress()
    );
  });

  it("Should deposit and send principal to MockAavePool", async function () {
    const depositAmount = ethers.parseUnits("1000", 6);
    await mockUSDC.approve(await losslessVault.getAddress(), depositAmount);
    await losslessVault.deposit(depositAmount, donor.address);

    const poolBalance = await mockAavePool.getUserSupply(await losslessVault.getAddress());
    expect(poolBalance).to.equal(depositAmount);
  });

  it("Should harvest yield and split 50/50", async function () {
    // ... (completa el test)
  });
});
```

### Ejecutar Tests

```bash
yarn test
```

---

## 🔍 Verificación de Contratos en Scroll Sepolia

Después de desplegar, verifica los contratos:

```bash
# Verificar un contrato
yarn hardhat verify --network scrollSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Ejemplo: Verificar MockAavePool
yarn hardhat verify --network scrollSepolia \
  0x... \
  "0x..." # Dirección de MockUSDC
```

---

## 📊 Checklist de Testing

### Funcionalidad Básica
- [ ] MockUSDC se despliega correctamente
- [ ] MockAavePool acepta deposits
- [ ] MockAavePool genera yield con `adminAddYield()`
- [ ] LosslessVault deposita principal en MockAavePool
- [ ] LosslessVault harvest yield correctamente
- [ ] YieldSplitter divide 50/50 correctamente

### Governance
- [ ] StudentSBT se puede mint a estudiantes
- [ ] StudentSBT es no-transferible (Soulbound)
- [ ] MyGovernor acepta propuestas
- [ ] Estudiantes pueden votar con su SBT
- [ ] Propuestas pasan a Timelock después de votación
- [ ] UniversityWallet puede vetar propuestas

### Edge Cases
- [ ] No se puede depositar 0 USDC
- [ ] No se puede harvest sin yield
- [ ] No se puede transferir SBT
- [ ] No se puede votar sin SBT

---

## 🐛 Troubleshooting

### Error: "Insufficient funds"
- Asegúrate de tener ETH suficiente para gas
- En localhost, las cuentas vienen pre-fundeadas

### Error: "Contract not deployed"
- Verifica que `yarn deploy` se ejecutó correctamente
- Revisa `deployments/localhost/` para direcciones

### Error: "Nonce too high"
- Resetea la blockchain local: `yarn chain` (nuevo terminal)

### Error: "Transaction reverted"
- Revisa los logs de Hardhat para el motivo
- Verifica que tienes permisos (owner, minter, etc.)

---

## 📚 Recursos

- **Hardhat Docs**: https://hardhat.org/docs
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts
- **Scroll Docs**: https://docs.scroll.io
- **Scroll Sepolia Explorer**: https://sepolia.scrollscan.com

---

## 🎬 Demo Script Completo

Para una demo rápida, ejecuta estos comandos en Hardhat console:

```javascript
// 1. Setup
const MockUSDC = await ethers.getContract("MockUSDC");
const MockAavePool = await ethers.getContract("MockAavePool");
const LosslessVault = await ethers.getContract("LosslessVault");
const YieldSplitter = await ethers.getContract("YieldSplitter");
const StudentSBT = await ethers.getContract("StudentSBT");
const [deployer, donor, student1] = await ethers.getSigners();

// 2. Registrar estudiante
await StudentSBT.mint(student1.address);
console.log("✅ Estudiante registrado");

// 3. Donante deposita
await MockUSDC.approve(await LosslessVault.getAddress(), ethers.parseUnits("1000", 6));
await LosslessVault.deposit(ethers.parseUnits("1000", 6), donor.address);
console.log("✅ Depósito realizado");

// 4. Generar yield
await MockAavePool.adminAddYield(ethers.parseUnits("50", 6));
console.log("✅ Yield generado");

// 5. Harvest y split
await LosslessVault.harvestYield();
await YieldSplitter.splitYield();
console.log("✅ Yield distribuido 50/50");

// 6. Verificar
const university = await YieldSplitter.universityWallet();
const dao = await YieldSplitter.timelockController();
console.log("University:", await MockUSDC.balanceOf(university));
console.log("DAO:", await MockUSDC.balanceOf(dao));
```

---

**¡Listo para probar! 🚀**

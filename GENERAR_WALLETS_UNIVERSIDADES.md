# 🔑 Generar Wallets para Universidades (MVP)

## 🎯 Objetivo
Generar wallets internamente para universidades con acceso a las llaves privadas, para poder usarlas en demos y ver los fondos depositados.

---

## 🔧 Método 1: Generar con Hardhat (Recomendado)

### **Paso 1: Crear Script de Generación**

Crear archivo: `packages/hardhat/scripts/generate-university-wallets.ts`

```typescript
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const universities = [
    { name: "UNAM", id: "unam" },
    { name: "IBERO", id: "ibero" },
    { name: "BUAP", id: "buap" },
    { name: "UDLAP", id: "udlap" },
    { name: "ANAHUAC", id: "anahuac" },
    { name: "TEC", id: "tec" },
  ];

  const wallets: Array<{
    name: string;
    id: string;
    address: string;
    privateKey: string;
  }> = [];

  console.log("🏛️  Generating University Wallets...\n");

  for (const uni of universities) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      name: uni.name,
      id: uni.id,
      address: wallet.address,
      privateKey: wallet.privateKey,
    });

    console.log(`✅ ${uni.name}:`);
    console.log(`   Address:    ${wallet.address}`);
    console.log(`   PrivateKey: ${wallet.privateKey}\n`);
  }

  // Guardar en archivo JSON (NO COMMITEAR A GIT)
  const outputPath = path.join(__dirname, "../.university-wallets.json");
  fs.writeFileSync(outputPath, JSON.stringify(wallets, null, 2));
  console.log(`\n💾 Wallets saved to: ${outputPath}`);
  console.log("⚠️  WARNING: This file contains private keys. DO NOT commit to git!");

  // También crear archivo de ejemplo sin private keys
  const publicWallets = wallets.map(({ name, id, address }) => ({
    name,
    id,
    address,
  }));
  const publicPath = path.join(__dirname, "../university-wallets-public.json");
  fs.writeFileSync(publicPath, JSON.stringify(publicWallets, null, 2));
  console.log(`📋 Public addresses saved to: ${publicPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### **Paso 2: Ejecutar Script**

```bash
cd packages/hardhat
npx hardhat run scripts/generate-university-wallets.ts
```

### **Paso 3: Agregar a .gitignore**

```bash
# En packages/hardhat/.gitignore
.university-wallets.json
```

---

## 🔧 Método 2: Usar Mnemonic (Alternativa)

Si prefieres usar un mnemonic para generar todas las wallets:

```typescript
import { ethers } from "ethers";

const mnemonic = "tu mnemonic phrase aqui...";
const universities = ["UNAM", "IBERO", "BUAP", "UDLAP", "ANAHUAC", "TEC"];

const wallets = universities.map((name, index) => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`);
  return {
    name,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
});
```

---

## 📋 Estructura del Archivo Generado

```json
[
  {
    "name": "UNAM",
    "id": "unam",
    "address": "0x...",
    "privateKey": "0x..."
  },
  {
    "name": "IBERO",
    "id": "ibero",
    "address": "0x...",
    "privateKey": "0x..."
  },
  // ... etc
]
```

---

## 🔐 Seguridad

1. **NO COMMITEAR** el archivo con private keys
2. **Guardar en lugar seguro** (solo para desarrollo/demos)
3. **Usar variables de entorno** en producción
4. **Rotar wallets** antes de producción

---

## 🎯 Uso en Deployment

Modificar `06_deploy_yield_splitter.ts` para usar estas wallets:

```typescript
import * as fs from "fs";
import * as path from "path";

const walletsPath = path.join(__dirname, "../.university-wallets.json");
const wallets = JSON.parse(fs.readFileSync(walletsPath, "utf-8"));

const unamWallet = wallets.find((w: any) => w.id === "unam");
// Usar unamWallet.address como universityWallet
```

---

## ✅ Checklist

- [ ] Generar wallets
- [ ] Guardar en `.university-wallets.json`
- [ ] Agregar a `.gitignore`
- [ ] Usar en deployment scripts
- [ ] Documentar en README


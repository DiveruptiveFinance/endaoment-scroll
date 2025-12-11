# 🔑 Wallets Generadas para Universidades

## ⚠️ IMPORTANTE: PRIVATE KEYS
Estas private keys son solo para desarrollo/demos. **NO compartir públicamente.**

---

## 📋 WALLETS POR UNIVERSIDAD

### 1. **UNAM**
- **Address:** `0x791DC44d843870dEE8832bF9801F0DCbdb1D0618`
- **Private Key:** `0x6e0c97538bcc3e9b1ba9966c82413510e1bba85d3402b9957bf7b701a9082e3c`

### 2. **IBERO**
- **Address:** `0x904A9868954044925758D4a483Ae126BE884e934`
- **Private Key:** `0x09250f0da1097cf3b91e85c782993cbc2d19507598dbf9d7f2b25f4805ce9efc`

### 3. **BUAP**
- **Address:** `0x6c40b6c7835401BA249b36e4F0eFb62B8ABfc310`
- **Private Key:** `0x3564f7c8d90582f778b2e7e961fda712419a079d90e5d29d1a0c02082a6c6132`

### 4. **UDLAP**
- **Address:** `0x0699A33d04D1400a1922Ae80D6e3306E4932063b`
- **Private Key:** `0x4f71ff76e510b265ed4733297883ff26682d4ba3303bd14acd2a7b0805207e31`

### 5. **ANAHUAC**
- **Address:** `0x5B2cE48D1d74E6d2040b40246501B9d601fb4b82`
- **Private Key:** `0x4014e3b1735d510cd27f96b93b1e6424ed329eece7d3ceff53776c6c7ca7df5c`

### 6. **TEC de Monterrey**
- **Address:** `0x357B924B9f549B4C6a9DB212a24E615d175E336D`
- **Private Key:** `0x3810fab24ba1f9450645d9f2d06f12864c817af57d544fc2e6e10a27207b21c0`

---

## 🔐 Cómo Usar en Demos

### **Opción 1: Importar en MetaMask**
1. Abrir MetaMask
2. Click en "Import Account"
3. Pegar Private Key
4. Nombrar como "UNAM", "IBERO", etc.

### **Opción 2: Usar en Código**
```typescript
import { Wallet } from "ethers";

const unamWallet = new Wallet("0x6e0c97538bcc3e9b1ba9966c82413510e1bba85d3402b9957bf7b701a9082e3c");
```

---

## 📝 Notas
- Estas wallets se usarán en el deployment script
- Se configurarán en YieldSplitter para recibir el 50% del yield
- Para producción, usar wallets multisig reales




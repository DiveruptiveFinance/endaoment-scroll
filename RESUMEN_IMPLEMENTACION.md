# 📋 RESUMEN DE IMPLEMENTACIÓN - MVP EnDAOment

## ✅ DECISIONES CONFIRMADAS

1. **UniversityRegistry:** ✅ Crear contrato nuevo
2. **StudentRegistry:** ✅ Modificar para función pública `registerStudent()`
3. **Perfil Donante:** ✅ localStorage + IPFS para foto
4. **APY:** ✅ **10% fijo** (simulado por MockAavePool)
5. **Gastos Yield:** ✅ Mock data (50% ops, 20% becas, 30% DAO)

---

## 🏛️ UNIVERSIDADES CONFIRMADAS

**Orden de visualización:**
1. UNAM
2. IBERO
3. BUAP
4. UDLAP
5. ANAHUAC
6. TEC de Monterrey

**Logos:** Guardar en `packages/nextjs/public/universities/` con nombres:
- `unam.png`, `ibero.png`, `buap.png`, `udlap.png`, `anahuac.png`, `tec.png`

---

## 🔑 GENERACIÓN DE WALLETS

**Script creado:** `packages/hardhat/scripts/generate-university-wallets.ts`

**Para ejecutar:**
```bash
cd packages/hardhat
npx hardhat run scripts/generate-university-wallets.ts
```

**Resultado:**
- `.university-wallets.json` - Contiene private keys (NO commitear)
- `university-wallets-public.json` - Solo addresses (safe to commit)

**Uso:**
- Importar en deployment scripts
- Usar addresses para configurar YieldSplitter
- Usar private keys para conectar wallets en demos

---

## 📊 APY: 10% FIJO

**Configuración:**
- APY fijo: **10% anual**
- Simulado por `MockAavePool.adminAddYield()`
- Cálculo de proyecciones: `yield = principal * 0.10 * (días / 365)`

**Períodos de proyección:**
- Diario: `principal * 0.10 * (1 / 365)`
- Semanal: `principal * 0.10 * (7 / 365)`
- Mensual: `principal * 0.10 * (30 / 365)`
- Trimestral: `principal * 0.10 * (90 / 365)`
- Anual: `principal * 0.10`

---

## 🎯 ORDEN DE IMPLEMENTACIÓN

### **Fase 1: Preparación (AHORA)**
- [x] Script para generar wallets
- [ ] Guardar logos de universidades
- [ ] Generar wallets ejecutando script
- [ ] Modificar contratos (StudentRegistry, crear UniversityRegistry)

### **Fase 2: Contratos (Backend)**
- [ ] Modificar StudentRegistry
- [ ] Crear UniversityRegistry
- [ ] Actualizar deployment scripts
- [ ] Desplegar en Scroll Sepolia

### **Fase 3: Fund/Donate (Core)**
- [ ] Crear `/fund` con tabs
- [ ] Crear `/fund/universities` con tarjetas
- [ ] Crear `/fund/initiatives` (Coming Soon)
- [ ] Crear `/fund/donate` con LosslessVault

### **Fase 4: Dashboards**
- [ ] Crear `/donor/dashboard`
- [ ] Mejorar `/student/dashboard`
- [ ] Crear `/university/dashboard`

### **Fase 5: Student Flow**
- [ ] Crear `/student/register` con cuestionario
- [ ] Integrar StudentRegistry + StudentSBT mint
- [ ] Calcular poder de voto

### **Fase 6: Admin & Yield**
- [ ] Crear `/admin/yield`
- [ ] Integrar MockAavePool.adminAddYield
- [ ] Integrar LosslessVault.harvestYield

### **Fase 7: Governance**
- [ ] Crear `/governance/proposals`
- [ ] Integrar MyGovernor
- [ ] Mostrar propuestas en Timelock

---

## 💡 SUGERENCIAS IMPLEMENTADAS

### **1. Eventos Estructurados**
- Usar `useScaffoldWatchContractEvent` para UI reactiva
- Leer eventos `Deposit`, `YieldSplit`, `ProposalCreated`, etc.

### **2. Validaciones Dobles**
- Off-chain antes de enviar (mejor UX)
- On-chain en contratos (seguridad)

### **3. Estados de Carga Claros**
- `idle` → `approving` → `depositing` → `success` / `error`
- Mostrar mensajes específicos en cada estado

### **4. Helper Functions**
- `parseUSDC()` y `formatUSDC()` para manejo consistente de decimals
- `calculateProjection()` para proyecciones off-chain

### **5. Metadata Off-Chain**
- IPFS para fotos de perfil
- Contrato de referencia para hashes (futuro)

---

## 🔐 SEGURIDAD

### **Wallets de Universidades:**
- ✅ Generadas localmente
- ✅ Private keys en `.university-wallets.json` (gitignored)
- ✅ Solo addresses públicas en repo
- ⚠️ **NO COMMITEAR** archivo con private keys

### **Locking de Wallets:**
- UniversityRegistry tendrá función `lockWallet()`
- Solo owner puede lock
- Una vez locked, no se puede cambiar en MVP

---

## 📝 PRÓXIMOS PASOS INMEDIATOS

1. **Ejecutar script de wallets:**
   ```bash
   cd packages/hardhat
   npx hardhat run scripts/generate-university-wallets.ts
   ```

2. **Guardar logos:**
   - Subir logos a `packages/nextjs/public/universities/`
   - O indicarme y los guardo yo

3. **Modificar contratos:**
   - StudentRegistry: agregar `registerStudent()` pública
   - Crear UniversityRegistry
   - Actualizar deployment scripts

4. **Desplegar:**
   - Desplegar contratos actualizados
   - Configurar wallets de universidades

5. **Implementar frontend:**
   - Empezar con Fund/Donate (core)
   - Luego dashboards
   - Finalmente features avanzadas

---

## ❓ ¿QUÉ SIGUE?

**Opciones:**
1. **Generar wallets ahora** (ejecutar script)
2. **Guardar logos** (necesito que los subas o los guardo yo)
3. **Modificar contratos** (StudentRegistry, crear UniversityRegistry)
4. **Empezar con frontend** (Fund/Donate primero)

**¿Con cuál empezamos?**


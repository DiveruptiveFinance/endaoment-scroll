# Epic 4 Quick Start Guide

## Files Modified/Created

### New Pages Created
```
✨ /app/vault/create/page.tsx         - Whale deposit flow (1000+ USDC)
✨ /app/students/page.tsx              - Student discovery with filters
✨ /app/student/create/page.tsx        - Student registration form
```

### Pages Updated
```
📝 /app/page.tsx                       - Added event listeners
📝 /app/dashboard/page.tsx             - Real contract data, event history
📝 /app/allocate/page.tsx              - Real epoch & allocation logic
```

### Components Updated
```
📝 /components/vault/VaultCard.tsx     - Real vault stats from contract
📝 /components/vault/JoinVaultModal.tsx - Real deposit flow with USDC
```

### New Hooks
```
✨ /hooks/endaoment/useVaultEvents.ts  - Real-time event subscriptions
```

---

## Quick Test Flow

### 1. Start Hardhat Node
```bash
cd packages/hardhat
npx hardhat node
```

### 2. Deploy Contracts (if needed)
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Start Frontend
```bash
cd packages/nextjs
npm run dev
```

### 4. Open App
```
http://localhost:3000
```

### 5. Mint USDC (in hardhat console)
```javascript
const usdc = await ethers.getContractAt("MockUSDC", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
await usdc.mint("YOUR_ADDRESS", ethers.parseUnits("5000", 6))
```

---

## User Flows Cheatsheet

### 🐋 Whale Flow
```
1. http://localhost:3000/vault/create
2. Enter 1000+ USDC
3. Approve USDC → Deposit
4. View dashboard
```

### 💰 Retail Flow
```
1. http://localhost:3000
2. Click "Join Vault" on VaultCard
3. Enter 10+ USDC
4. Approve USDC → Deposit
5. View dashboard
```

### 🎓 Student Flow
```
1. http://localhost:3000/student/create
2. Fill registration form
3. Submit transaction
4. Browse at /students
```

### 🗳️ Allocation Flow
```
1. http://localhost:3000/allocate
2. Adjust sliders to 100%
3. Submit allocation
4. View confirmation
```

### 📊 Dashboard Flow
```
1. http://localhost:3000/dashboard
2. See position, yield, history
3. Click "Allocate Yield"
```

---

## Contract Addresses (Localhost)

```typescript
MockUSDC:          0x5FbDB2315678afecb367f032d93F642f64180aa3
StudentRegistry:   0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
AllocationManager: 0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e
EndaomentVault:    0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82
```

These are hardcoded in the frontend where needed.

---

## Key Patterns Used

### Read from Contract
```typescript
const { data: balance } = useScaffoldReadContract({
  contractName: "MockUSDC",
  functionName: "balanceOf",
  args: [address],
});
```

### Write to Contract
```typescript
const { writeContractAsync } = useScaffoldWriteContract("EndaomentVault");
await writeContractAsync({
  functionName: "deposit",
  args: [amount, receiver],
});
```

### Event History
```typescript
const { data: events } = useScaffoldEventHistory({
  contractName: "EndaomentVault",
  eventName: "Deposit",
  fromBlock: 0n,
  filters: { sender: address },
});
```

### Real-Time Events
```typescript
useScaffoldEventSubscriber({
  contractName: "EndaomentVault",
  eventName: "Deposit",
  listener: logs => console.log("New deposit:", logs),
});
```

---

## Debugging Tips

### Check Contract Reads
- Open DevTools → Network tab
- Filter by "localhost:8545"
- See all RPC calls

### Check Events
- Open DevTools → Console
- Events are logged in real-time
- Format: "New deposit:", "Votes allocated:", etc.

### Check Transaction Status
- Loading states shown during transactions
- Success screens after completion
- Errors logged to console

### Check Wallet State
- Dashboard shows "Connect wallet" if not connected
- Dashboard shows "No deposits" if no shares
- Balance checks prevent invalid transactions

---

## Common Issues & Solutions

### Issue: "Insufficient balance"
**Solution**: Mint more USDC to test address

### Issue: "Transaction rejected"
**Solution**: User rejected in MetaMask, can retry

### Issue: "Cannot read contract"
**Solution**: Ensure hardhat node is running and contracts deployed

### Issue: "Events not showing"
**Solution**: Check console for logs, may need to trigger event again

### Issue: "Dashboard shows 0"
**Solution**: Verify wallet connected and has deposits

---

## Next Steps

1. **Test All Flows**: Use TESTING_CHECKLIST.md
2. **Add Yield Generation**: Epic 5 - Integrate Aave
3. **Add Polish**: Toast notifications, better loading states
4. **Deploy to Testnet**: Base Sepolia or similar
5. **E2E Testing**: Playwright or Cypress tests

---

## Important Notes

- **Mock Data**: Student profiles use mock data for rich UI, addresses from contract
- **Single Vault**: One deployed vault, whale deposit goes to it (not factory)
- **ERC-4626**: Standard vault interface for shares and assets
- **Event Logging**: Currently console only, ready for toast notifications
- **Decimals**: USDC=6, Shares=18, be consistent
- **Transaction UX**: Two-step flow (approve + action) with status indicators

---

## Resources

- **Full Summary**: See EPIC4_IMPLEMENTATION_SUMMARY.md
- **Test Checklist**: See TESTING_CHECKLIST.md
- **Scaffold-ETH Docs**: https://docs.scaffoldeth.io
- **ERC-4626 Spec**: https://eips.ethereum.org/EIPS/eip-4626

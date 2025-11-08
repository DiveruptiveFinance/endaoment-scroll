# Epic 4 Testing Checklist

## Prerequisites
- [ ] Local hardhat node running
- [ ] Contracts deployed to localhost
- [ ] Frontend running on http://localhost:3000
- [ ] MetaMask connected to localhost:8545
- [ ] Test accounts funded with ETH

## Setup Test Data

### Mint USDC to Test Accounts
```bash
# In hardhat console or script
const usdc = await ethers.getContractAt("MockUSDC", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
await usdc.mint(whaleAddress, ethers.parseUnits("5000", 6))  # 5000 USDC for whale
await usdc.mint(retailAddress, ethers.parseUnits("100", 6))  # 100 USDC for retail
```

---

## 🐋 Whale Flow Testing

### Test 1: Whale Deposit
- [ ] Navigate to `/vault/create`
- [ ] Connect wallet with whale account
- [ ] See USDC balance displayed correctly
- [ ] Enter 1000 USDC
- [ ] Click "Deposit to Vault"
- [ ] Approve USDC transaction (Step 1/2)
- [ ] Deposit to vault transaction (Step 2/2)
- [ ] See success screen
- [ ] Auto-redirect to `/dashboard`
- [ ] Dashboard shows 1000 USDC position
- [ ] Shares and voting power displayed

**Expected Results**:
- Two transactions signed
- Dashboard shows ~1000 shares
- Voting power ~100% (if first depositor)
- Transaction appears in history table

---

## 💰 Retail Flow Testing

### Test 2: Retail Marketplace Browsing
- [ ] Navigate to `/` (homepage)
- [ ] See VaultCard with real vault stats
- [ ] Total capital shows whale deposit
- [ ] Participant count shows 1
- [ ] APY shows 5%

### Test 3: Retail Deposit
- [ ] Switch to retail account in MetaMask
- [ ] Click "Join Vault" on VaultCard
- [ ] Modal opens with deposit form
- [ ] Enter 50 USDC
- [ ] See projected shares (~50)
- [ ] See projected voting power
- [ ] Balance shows 100 USDC
- [ ] Click "Deposit"
- [ ] Approve USDC (if needed)
- [ ] Deposit to vault
- [ ] Modal closes
- [ ] Redirect to `/dashboard`
- [ ] Dashboard shows 50 USDC position
- [ ] Voting power < whale's power

**Expected Results**:
- VaultCard updates: 1050 total capital, 2 participants
- Dashboard shows proportional voting power
- Transaction history shows deposit

---

## 🎓 Student Flow Testing

### Test 4: Student Registration
- [ ] Navigate to `/student/create`
- [ ] Connect wallet with student account
- [ ] Fill form:
  - Name: "Test Student"
  - University: "Test University"
  - Field: "Test PhD"
  - Bio: (at least 50 characters)
- [ ] Submit button enabled when form valid
- [ ] Click "Register"
- [ ] Sign transaction
- [ ] See success screen
- [ ] Auto-redirect to homepage

**Expected Results**:
- Transaction succeeds
- Student address added to StudentRegistry
- Console shows StudentRegistered event

### Test 5: Student Discovery
- [ ] Navigate to `/students`
- [ ] See contract stats: 1 registered on-chain
- [ ] See 8 mock students for demo
- [ ] Filter by category (undergraduate/masters/phd)
- [ ] Click "View Profile" on any student
- [ ] Navigate to student detail page

**Expected Results**:
- All filters work correctly
- Student cards show funding progress
- Links navigate properly

---

## 🗳️ Allocation Flow Testing

### Test 6: Allocation Voting (as Whale)
- [ ] Switch to whale account
- [ ] Navigate to `/allocate`
- [ ] See current epoch number
- [ ] See available yield amount
- [ ] See voting power (should be high)
- [ ] See list of 8 students
- [ ] Adjust sliders for students
- [ ] Progress bar shows total %
- [ ] Total must equal 100%
- [ ] Button disabled until 100%
- [ ] Submit allocation
- [ ] Sign transaction
- [ ] See success screen
- [ ] Navigate to dashboard

**Expected Results**:
- Transaction succeeds
- Console shows VotesAllocated event
- Each student shows their % and $ amount
- Success screen shows epoch number

### Test 7: Allocation Voting (as Retail)
- [ ] Switch to retail account
- [ ] Navigate to `/allocate`
- [ ] See lower voting power than whale
- [ ] Adjust sliders differently
- [ ] Submit allocation
- [ ] Transaction succeeds

**Expected Results**:
- Retail allocations recorded separately
- Console shows second VotesAllocated event

---

## 📊 Dashboard Testing

### Test 8: Whale Dashboard
- [ ] Switch to whale account
- [ ] Navigate to `/dashboard`
- [ ] See "Your Vault" card with:
  - Vault name
  - Position value (~1000 USDC)
  - Shares (~1000)
  - Voting power (high %)
  - Yield earned (if any)
- [ ] See stats row:
  - Total donated
  - Yield generated
  - Students supported
- [ ] See transaction history table
- [ ] Each transaction shows:
  - Block number
  - Type (Deposit)
  - Amount
  - Shares
  - Transaction hash link

**Expected Results**:
- All values accurate to contract state
- Links work (may 404 on localhost)
- "Allocate Yield" button navigates to `/allocate`

### Test 9: Retail Dashboard
- [ ] Switch to retail account
- [ ] Navigate to `/dashboard`
- [ ] See position (~50 USDC)
- [ ] See lower voting power
- [ ] See transaction history

### Test 10: Empty Dashboard
- [ ] Switch to account with no deposits
- [ ] Navigate to `/dashboard`
- [ ] See "You haven't joined a vault yet!" alert
- [ ] Click "Explore Vaults" button
- [ ] Navigate to homepage

**Expected Results**:
- Graceful empty state
- CTA buttons work

---

## 🔔 Event Listener Testing

### Test 11: Real-Time Updates
- [ ] Open browser console (F12)
- [ ] Navigate to `/dashboard`
- [ ] In another browser tab, make a deposit
- [ ] Check console for "New deposit:" log
- [ ] Navigate to `/`
- [ ] Register a student in another tab
- [ ] Check console for "Student registered:" log

**Expected Results**:
- All events logged to console
- Event data includes transaction details
- Multiple events can be monitored simultaneously

### Test 12: Allocation Events
- [ ] Open console on `/dashboard`
- [ ] Submit allocation in another tab
- [ ] Check for "Votes allocated:" log
- [ ] Verify event includes:
  - User address
  - Vault address
  - Student addresses array
  - Vote amounts array
  - Epoch number

---

## 🔗 Contract Integration Validation

### Test 13: Read Operations
- [ ] Open browser dev tools → Network tab
- [ ] Navigate to `/dashboard`
- [ ] Observe contract read calls
- [ ] Verify calls to:
  - `balanceOf()`
  - `convertToAssets()`
  - `getAccruedYield()`
  - `totalSupply()`
  - `getVaultStats()`

### Test 14: Write Operations
- [ ] Make deposit transaction
- [ ] Check MetaMask transaction details
- [ ] Verify function name is correct
- [ ] Verify args are properly encoded
- [ ] Transaction succeeds on-chain

### Test 15: Event History
- [ ] Check `useScaffoldEventHistory` works
- [ ] Events from past blocks loaded
- [ ] Filtering by sender works
- [ ] Event args parsed correctly

---

## 🚨 Error Handling Testing

### Test 16: Insufficient Balance
- [ ] Try to deposit more than balance
- [ ] Button should be disabled
- [ ] No transaction attempted

### Test 17: Disconnected Wallet
- [ ] Disconnect MetaMask
- [ ] Try to access `/dashboard`
- [ ] See "Please connect wallet" message
- [ ] Buttons disabled appropriately

### Test 18: Transaction Rejection
- [ ] Start deposit transaction
- [ ] Reject in MetaMask
- [ ] Loading state clears
- [ ] Can retry transaction
- [ ] No success screen shown

### Test 19: Invalid Allocation
- [ ] Navigate to `/allocate`
- [ ] Set total to 99% (not 100%)
- [ ] Submit button disabled
- [ ] Shows "Allocate 100% to Continue"

---

## 📱 Responsive Testing

### Test 20: Mobile View
- [ ] Resize browser to mobile width
- [ ] Check homepage layout
- [ ] Check dashboard layout
- [ ] Check allocation page
- [ ] All buttons accessible
- [ ] No horizontal scroll
- [ ] Modals work on mobile

---

## Performance Checks

### Test 21: Load Times
- [ ] Homepage loads < 2s
- [ ] Dashboard loads < 3s
- [ ] Contract reads don't block UI
- [ ] Loading states shown appropriately

### Test 22: Re-renders
- [ ] Dashboard doesn't flash on updates
- [ ] Event listeners don't cause lag
- [ ] Forms are responsive

---

## Regression Testing

### Test 23: Existing Features Still Work
- [ ] Student cards on homepage work
- [ ] Navigation between pages works
- [ ] Header connect button works
- [ ] Footer links work
- [ ] Theme switcher works (if present)

---

## Final Validation

### Test 24: Complete User Journey (Whale)
1. [ ] Mint USDC
2. [ ] Create vault deposit (1000 USDC)
3. [ ] View dashboard
4. [ ] Navigate to allocate
5. [ ] Submit allocation
6. [ ] Return to dashboard
7. [ ] See updated stats

### Test 25: Complete User Journey (Retail)
1. [ ] Mint USDC
2. [ ] Browse marketplace
3. [ ] Join vault (50 USDC)
4. [ ] View dashboard
5. [ ] Allocate yield
6. [ ] View history

### Test 26: Complete User Journey (Student)
1. [ ] Register profile
2. [ ] View in discovery page
3. [ ] Check address in StudentRegistry
4. [ ] Receive allocations (when implemented)

---

## Test Results Summary

| Category | Tests Passed | Tests Failed | Notes |
|----------|--------------|--------------|-------|
| Whale Flow | ___ / 1 | ___ | |
| Retail Flow | ___ / 2 | ___ | |
| Student Flow | ___ / 2 | ___ | |
| Allocation | ___ / 2 | ___ | |
| Dashboard | ___ / 3 | ___ | |
| Events | ___ / 2 | ___ | |
| Integration | ___ / 3 | ___ | |
| Errors | ___ / 4 | ___ | |
| UI/UX | ___ / 1 | ___ | |
| Performance | ___ / 2 | ___ | |
| Regression | ___ / 1 | ___ | |
| E2E | ___ / 3 | ___ | |

**Total**: ___ / 26

---

## Known Issues / TODOs

- [ ] Transaction history uses Etherscan links (should be localhost explorer)
- [ ] Students supported count always shows 0 (needs allocation tracking)
- [ ] No toast notifications yet (console logs only)
- [ ] Student profiles show mock data (need to read contract metadata)
- [ ] Yield distribution not yet implemented (Epic 5)
- [ ] No withdraw functionality (ERC-4626 redeem)

---

## Success Criteria

**Epic 4 is considered complete when**:
- [ ] All 26 tests pass
- [ ] All user flows work end-to-end
- [ ] No blocking bugs
- [ ] Contract integration is stable
- [ ] Event listeners work reliably
- [ ] Dashboard shows accurate data

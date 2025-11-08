# Endaoment Testing Guide

## Prerequisites

You should have three terminal windows open:

### Terminal 1: Local Blockchain
```bash
yarn chain
```
Keep this running - you'll see transaction logs here.

### Terminal 2: Deploy Contracts
```bash
cd packages/hardhat
yarn deploy --reset
```
This deploys all contracts to localhost. You should see:
- ✅ MockUSDC deployed
- ✅ StudentRegistry deployed (with 8 test students)
- ✅ AllocationManager deployed
- ✅ EndaomentVault deployed

### Terminal 3: Frontend
```bash
yarn start
```
Open http://localhost:3000

## Getting Test Funds

### Option 1: Use MockUSDC Faucet (Easiest)

The MockUSDC contract has a `faucet()` function that gives you 10,000 USDC.

**Via Frontend:**
1. Go to "Debug Contracts" page (in navbar)
2. Find "MockUSDC" contract
3. Click `faucet()` function
4. Click "Send" - you'll get 10,000 USDC instantly

**Via Hardhat Console:**
```bash
# In packages/hardhat directory
npx hardhat console --network localhost

# Then run:
const usdc = await ethers.getContractAt("MockUSDC", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
await usdc.faucet()
```

### Option 2: Transfer from Deployer

The deployer account has lots of USDC. You can transfer from it.

## Testing Flows

### 🐋 Whale Flow (Large Donor: $1000+)

**Step 1: Get 10,000 USDC**
- Use faucet method above
- Verify balance in "Debug Contracts" page → MockUSDC → `balanceOf` → enter your address

**Step 2: Create Vault**
- Navigate to `/vault/create` or click "Create Vault" button
- Enter vault details:
  - Name: "Climate Research Fund"
  - Description: "Supporting climate change research"
  - Min deposit: 1000 USDC
- Enter deposit amount: 1000+ USDC
- Click "Create & Deposit"
- **Two transactions will pop up:**
  1. Approve USDC spending
  2. Deposit to vault
- Confirm both transactions in MetaMask

**Step 3: Verify Vault Creation**
- Check "Debug Contracts" → EndaomentVault → `totalAssets()` (should show your deposit)
- Check your dashboard at `/dashboard` (should show your shares)

**Step 4: Allocate Votes**
- Navigate to `/allocate`
- You'll see 8 test students
- Distribute 100 points across students (e.g., 25, 25, 25, 25)
- Click "Submit Allocation"
- Confirm transaction

**Expected Results:**
- ✅ Vault created with 1000+ USDC
- ✅ You own shares in vault
- ✅ Votes allocated to students
- ✅ Dashboard shows your position

### 💰 Retail Flow (Small Donor: $10+)

**Step 1: Get 100 USDC**
- Use faucet method (gives 10,000 USDC)

**Step 2: Browse Vaults**
- Go to homepage `/`
- You should see the vault created by whale (or create your own)
- Click "View Details" on any vault

**Step 3: Join Vault**
- Click "Join Vault" button
- Enter deposit amount: 50 USDC (minimum is 10)
- Click "Deposit"
- **Two transactions:**
  1. Approve USDC
  2. Deposit to vault
- Confirm both

**Step 4: Allocate Votes**
- Go to `/allocate`
- Distribute your voting power across students
- Submit allocation

**Step 5: View Dashboard**
- Go to `/dashboard`
- See your:
  - Total shares
  - Asset value
  - Estimated yield
  - Transaction history

**Expected Results:**
- ✅ Successfully deposited 50 USDC
- ✅ Received vault shares proportional to deposit
- ✅ Can allocate votes
- ✅ Dashboard shows position

### 🎓 Student Flow (Beneficiary)

**Step 1: Create Profile**
- Navigate to `/student/create`
- Fill out form:
  - Name: "Alice Johnson"
  - University: "MIT"
  - Field of Study: "Computer Science"
  - Research Focus: "AI Safety"
  - Bio: "Researching alignment..."
- Click "Register"
- Confirm transaction

**Step 2: Verify Registration**
- Check "Debug Contracts" → StudentRegistry → `getActiveStudents()`
- Your address should appear in the list
- Check `students(your_address)` to see your profile data

**Step 3: View Profile** (Future feature)
- Currently no dedicated student profile page
- But your profile is registered on-chain

**Step 4: Receive Funding**
- When donors allocate votes to you
- At epoch end, AllocationManager distributes yield
- Your share = (your votes / total votes) * 75% of yield

**Expected Results:**
- ✅ Student profile created on-chain
- ✅ Appears in active students list
- ✅ Can receive funding allocations

## Testing Allocation & Yield Distribution

### Current Epoch Status

**Check Current Epoch:**
```
Debug Contracts → AllocationManager → getCurrentEpoch()
```
Returns:
- `id`: Current epoch number
- `startTime`: Epoch start timestamp
- `endTime`: Epoch end timestamp (30 days from start)
- `isFinalized`: false (until epoch ends)

### Simulate Epoch End (For Testing)

To test yield distribution without waiting 30 days:

**Method 1: Fast-forward time in Hardhat**
```bash
# In Hardhat console
await network.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]) // 30 days
await network.provider.send("evm_mine") // Mine a block
```

**Method 2: Manually finalize (if you're the owner)**
```
Debug Contracts → AllocationManager → finalizeEpoch()
```

### Check Yield Distribution

After epoch finalization:
```
Debug Contracts → AllocationManager → getStudentAllocation(epochId, studentAddress)
```

This shows how much yield each student should receive.

## Debugging Tips

### Check Contract State

**Vault Info:**
```
EndaomentVault:
- totalAssets() → Total USDC deposited
- totalSupply() → Total shares issued
- balanceOf(address) → Your share balance
- convertToAssets(shares) → Your USDC value
```

**Student Registry:**
```
StudentRegistry:
- getActiveStudents() → All registered students
- students(address) → Student details
- getStudentCount() → Total students
```

**Allocation Manager:**
```
AllocationManager:
- getCurrentEpoch() → Current epoch details
- getUserVotes(epochId, userAddress) → Your total votes
- getStudentVotes(epochId, studentAddress) → Votes for student
```

### Common Issues

**Issue: "Insufficient allowance"**
- Solution: Click "Approve" before depositing
- The approve transaction must be confirmed first

**Issue: "Below minimum deposit"**
- Solution: Whale vaults need 1000+ USDC, retail needs 10+ USDC
- Check vault's `minDeposit()` value

**Issue: "No USDC balance"**
- Solution: Use faucet() function in MockUSDC contract
- Or check Debug Contracts to verify your balance

**Issue: "Transaction failed"**
- Check Terminal 1 (yarn chain) for error messages
- Common causes:
  - Insufficient gas
  - Contract revert (check require statements)
  - Wrong function arguments

### View Transaction History

**On Frontend:**
- Dashboard page shows your deposit/withdrawal history
- Uses `useScaffoldEventHistory` to fetch past events

**On Debug Contracts:**
- Click "Events" tab on any contract
- See all emitted events with parameters

## Testing Scenarios

### Scenario 1: Single Whale, Multiple Students
1. Whale creates vault with 5000 USDC
2. Whale allocates: 50 points to Alice, 30 to Bob, 20 to Carol
3. Fast-forward 30 days
4. Finalize epoch
5. Check student allocations: Alice gets 50%, Bob 30%, Carol 20% of student yield

### Scenario 2: Multiple Donors, One Student
1. Whale deposits 2000 USDC
2. Retail1 deposits 100 USDC
3. Retail2 deposits 50 USDC
4. All allocate 100% votes to Alice
5. Alice should get 75% of total yield from all three

### Scenario 3: Mixed Allocations
1. Whale deposits 3000 USDC, allocates: 70 Alice, 30 Bob
2. Retail deposits 200 USDC, allocates: 50 Alice, 50 Bob
3. Fast-forward and finalize
4. Check: Alice and Bob get weighted average based on donor deposits

## Next Steps After Testing

Once you've verified all flows work:

1. **Fix any bugs you find** - note them down
2. **Test edge cases**:
   - Zero allocations
   - Partial allocations (not adding to 100)
   - Multiple epochs
3. **Deploy to testnet** (Epic 5):
   - Base Sepolia
   - Real testnet USDC
   - Public testing

## Quick Test Commands

```bash
# Start everything
yarn chain          # Terminal 1
yarn deploy --reset # Terminal 2 (in packages/hardhat)
yarn start          # Terminal 3

# Get test funds
# Go to Debug Contracts → MockUSDC → faucet() → Send

# Test whale flow
# Go to /vault/create → deposit 1000 USDC

# Test retail flow
# Go to / → join existing vault → deposit 50 USDC

# Test student flow
# Go to /student/create → register as student

# Test allocation
# Go to /allocate → distribute 100 points → submit
```

## Helpful Links

- Homepage (Marketplace): http://localhost:3000
- Create Vault: http://localhost:3000/vault/create
- Allocate Votes: http://localhost:3000/allocate
- Dashboard: http://localhost:3000/dashboard
- Student Registration: http://localhost:3000/student/create
- Debug Contracts: http://localhost:3000/debug (built-in Scaffold-ETH page)

## Video Walkthrough (To Record)

Once testing is complete, we should record:
1. 🐋 Whale creating vault and depositing
2. 💰 Retail joining vault
3. 🎓 Student registering
4. 📊 Allocation voting
5. 💰 Epoch finalization and yield distribution

---

**Need Help?** Check the terminal running `yarn chain` for transaction logs and error messages.

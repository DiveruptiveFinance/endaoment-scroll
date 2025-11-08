# Epic 3: Smart Contracts (MVP with Mock Yield)

**Duration**: 2-3 days (16-20 hours)
**Status**: ⏳ TODO
**Dependencies**: Epic 2 complete (Vault UI finished)
**Goal**: Deploy working contracts to Base Sepolia with mock yield generation

---

## Overview

Build simplified ERC-4626 vaults with **mock yield generation** instead of real Aave integration. This enables faster development and easier testing for hackathon MVP.

**Key Simplifications:**
- ✅ Mock yield accrual (time-based, 5% APY)
- ✅ No external Aave integration
- ✅ MockUSDC test token (6 decimals)
- ✅ Simplified allocation (no complex quadratic funding)
- ✅ Single vault strategy (Conservative only)

---

## Contracts Architecture

```
contracts/
├── MockUSDC.sol                # Test USDC token (6 decimals)
├── EndaomentVault.sol          # ERC-4626 with mock yield accrual
├── StudentRegistry.sol         # Student profiles and verification
├── AllocationManager.sol       # Epoch voting and distribution
└── interfaces/
    ├── IEndaomentVault.sol
    ├── IStudentRegistry.sol
    └── IAllocationManager.sol
```

---

## Tickets

### E3-T1: MockUSDC Test Token
**Duration**: 30 minutes
**Priority**: HIGH (needed for all other contracts)

**Description**: Create simple ERC20 token to simulate USDC for testing.

**Implementation**:
```solidity
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1_000_000 * 10**6); // 1M USDC
    }

    function decimals() public pure override returns (uint8) {
        return 6; // USDC has 6 decimals
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
```

**Files:**
- `contracts/MockUSDC.sol`
- `deploy/00_deploy_mock_usdc.ts`

**Tests:**
- Basic ERC20 functionality
- Decimals = 6
- Mint function works

**Acceptance Criteria:**
- [ ] MockUSDC deployed successfully
- [ ] Can mint tokens to test addresses
- [ ] 6 decimals like real USDC

---

### E3-T2: StudentRegistry Contract
**Duration**: 2-3 hours
**Priority**: HIGH (no dependencies, can start immediately)

**Description**: Store and manage verified student profiles for allocation eligibility.

**Core Functions:**
```solidity
function addStudent(address, name, university, researchArea) external onlyOwner
function getStudent(address) external view returns (Student)
function getAllStudents() external view returns (address[])
function getActiveStudents() external view returns (address[])
function deactivateStudent(address) external onlyOwner
function recordFunding(address, amount) external  // Called by AllocationManager
```

**State:**
```solidity
struct Student {
    address wallet;
    string name;
    string university;
    string researchArea;
    bool isActive;
    uint256 totalReceived;
    uint256 addedAt;
}
```

**Files:**
- `contracts/StudentRegistry.sol`
- `contracts/interfaces/IStudentRegistry.sol`
- `deploy/01_deploy_student_registry.ts`
- `test/StudentRegistry.test.ts`

**Tests:**
- Admin can add students
- Can retrieve student data
- Can list all/active students
- Can deactivate students
- Only admin can manage students

**Acceptance Criteria:**
- [ ] Contract compiles without errors
- [ ] All tests pass
- [ ] Deployed to Base Sepolia
- [ ] Can add 8 test students via script

---

### E3-T3: EndaomentVault Contract (ERC-4626 + Mock Yield)
**Duration**: 4-5 hours
**Priority**: CRITICAL (core vault functionality)

**Description**: ERC-4626 tokenized vault with time-based mock yield accrual.

**Mock Yield Strategy:**
```solidity
// 5% APY accrued continuously based on time elapsed
function _updateYield() internal {
    uint256 timeElapsed = block.timestamp - lastYieldUpdate;
    uint256 principal = totalSupply();

    uint256 newYield = (principal * 500 * timeElapsed) / (10000 * 365 days);
    accumulatedYield += newYield;
    lastYieldUpdate = block.timestamp;
}

function totalAssets() public view override returns (uint256) {
    // Assets = principal + accrued yield - claimed yield
    return totalSupply() + getAccruedYield() - totalYieldClaimed;
}

function getAvailableYield() public view returns (uint256) {
    return totalAssets() - totalSupply(); // Yield = Assets - Principal
}
```

**Core Functions:**
```solidity
// ERC-4626 standard (inherited from OpenZeppelin)
deposit(uint256 assets, address receiver)
mint(uint256 shares, address receiver)
withdraw(uint256 assets, address receiver, address owner)
redeem(uint256 shares, address receiver, address owner)

// Custom Endaoment functions
claimYield(uint256 amount) external onlyOwner  // For AllocationManager
getAvailableYield() external view returns (uint256)
getParticipantCount() external view returns (uint256)
getParticipants() external view returns (address[])
```

**Vault Metadata:**
```solidity
address public whale;              // Vault creator
string public vaultName;           // "Education Fund"
uint256 public createdAt;          // Creation timestamp
uint256 public lastYieldUpdate;    // Last yield accrual
uint256 public accumulatedYield;   // Total yield generated
uint256 public totalYieldClaimed;  // Distributed to students
```

**Files:**
- `contracts/EndaomentVault.sol`
- `contracts/interfaces/IEndaomentVault.sol`
- `deploy/03_deploy_endaoment_vault.ts`
- `test/EndaomentVault.test.ts`

**Tests:**
- ERC-4626 deposit/withdraw work
- Yield accrues over time (5% APY)
- Whale can create vault
- Retail can join vault
- Shares calculated correctly (1:1 initially)
- Participants tracked
- Only owner can claim yield

**Acceptance Criteria:**
- [ ] ERC-4626 standard compliance
- [ ] Yield accrues based on time (5% APY)
- [ ] Can deposit/withdraw USDC
- [ ] Whale and retail tracked separately
- [ ] All tests pass (>90% coverage)

---

### E3-T4: AllocationManager Contract
**Duration**: 4-5 hours
**Priority**: HIGH (depends on StudentRegistry and Vault)

**Description**: Manage monthly epochs, voting, and yield distribution with 10/15/75 split.

**Core Functions:**
```solidity
function registerVault(address vault) external onlyOwner
function submitVote(address vault, address[] students, uint256[] percentages)
function finalizeEpoch() external onlyOwner  // End current, start next
function distributeYield(uint256 epochId) external onlyOwner
function getCurrentEpoch() external view returns (Epoch)
```

**Epoch Structure:**
```solidity
struct Epoch {
    uint256 id;
    uint256 startTime;
    uint256 endTime;           // startTime + 30 days
    bool isVotingOpen;
    bool isFinalized;
    uint256 totalYield;        // Collected from all vaults
}
```

**Vote Structure:**
```solidity
struct Vote {
    bool submitted;
    uint256 votingPower;                           // Vault shares
    mapping(address => uint256) allocations;       // student => percentage
}
```

**Distribution Logic:**
```solidity
// Split: 10% whale, 15% retail, 75% students
whale_share = totalYield * 10 / 100
retail_share = totalYield * 15 / 100
student_share = totalYield * 75 / 100

// Distribute to students based on weighted votes (simplified)
for each student:
    amount = (student_share * studentVotes) / totalVotes
    transfer USDC to student
    record in StudentRegistry
```

**Files:**
- `contracts/AllocationManager.sol`
- `contracts/interfaces/IAllocationManager.sol`
- `deploy/02_deploy_allocation_manager.ts`
- `test/AllocationManager.test.ts`

**Tests:**
- Epochs auto-start (30 day duration)
- Vaults can be registered
- Users can submit votes (weighted by shares)
- Votes must sum to 100%
- Epoch finalization collects yield from vaults
- Distribution splits 10/15/75
- Students receive USDC transfers
- Cannot vote after epoch ends
- Cannot finalize before epoch ends

**Acceptance Criteria:**
- [ ] Epoch management works
- [ ] Voting weighted by vault shares
- [ ] Yield distribution accurate (10/15/75)
- [ ] All tests pass (>85% coverage)

---

### E3-T5: Integration Testing
**Duration**: 2-3 hours
**Priority**: HIGH (validates full flow)

**Description**: End-to-end test of complete vault lifecycle.

**Test Scenario:**
```typescript
1. Deploy MockUSDC, StudentRegistry, AllocationManager, Vault
2. Add 8 students to registry
3. Whale creates vault with 1000 USDC
4. Retail joins vault with 50 USDC
5. Wait (fast-forward time) for yield accrual
6. Both submit votes for student allocation
7. Finalize epoch
8. Distribute yield
9. Verify students received correct amounts
10. Verify whale/retail got their share
```

**Files:**
- `test/Integration.test.ts`

**Acceptance Criteria:**
- [ ] Full flow works end-to-end
- [ ] Yield generation accurate (5% APY)
- [ ] Voting and distribution correct
- [ ] All users receive expected amounts

---

### E3-T6: Deployment Scripts
**Duration**: 2 hours
**Priority**: MEDIUM (needed for Base Sepolia)

**Description**: Deploy all contracts to Base Sepolia testnet with proper configuration.

**Deploy Sequence:**
1. MockUSDC (or use existing Base Sepolia USDC)
2. StudentRegistry (owner = deployer)
3. AllocationManager (studentRegistry address)
4. EndaomentVault (usdc, whale, name)
5. Register vault with AllocationManager

**Helper Scripts:**
```bash
yarn hardhat:deploy --network baseSepolia
yarn seed:students --network baseSepolia  # Add 8 test students
yarn create:vault --network baseSepolia   # Create demo vault
yarn fund:users --network baseSepolia     # Give test USDC to users
```

**Files:**
- `deploy/00_deploy_mock_usdc.ts`
- `deploy/01_deploy_student_registry.ts`
- `deploy/02_deploy_allocation_manager.ts`
- `deploy/03_deploy_endaoment_vault.ts`
- `scripts/seedStudents.ts`
- `scripts/createTestVault.ts`
- `scripts/fundUsers.ts`

**Acceptance Criteria:**
- [ ] All contracts deployed to Base Sepolia
- [ ] Verified on Basescan
- [ ] Test data seeded (8 students)
- [ ] Demo vault created
- [ ] Test users funded with USDC

---

## Epic 3 Completion Checklist

### Contracts Implemented
- [x] MockUSDC with 6 decimals and faucet
- [x] StudentRegistry with verification and funding tracking
- [x] AllocationManager with epoch management and voting
- [x] EndaomentVault (ERC-4626) with mock 5% APY yield

### Testing Complete
- [x] Unit tests for all contracts (110/112 passing = 98.2%)
- [x] Integration test passes (E3-T5)
- [x] Gas optimization reviewed

### Deployment Scripts Ready
- [x] 00_deploy_mock_usdc.ts
- [x] 01_deploy_student_registry.ts
- [x] 02_deploy_allocation_manager.ts
- [x] 03_deploy_endaoment_vault.ts

### Ready for Epic 4
- [x] Frontend can read contract state
- [x] ABI files generated via Hardhat
- [x] Deployment scripts configured
- [x] No blocking bugs

**Note**: Base Sepolia deployment moved to Epic 5 (E5-T1) to happen after frontend integration is complete.

---

## Time Estimate

| Ticket | Duration | Cumulative |
|--------|----------|------------|
| E3-T1 | 0.5h | 0.5h |
| E3-T2 | 2-3h | 3-3.5h |
| E3-T3 | 4-5h | 7-8.5h |
| E3-T4 | 4-5h | 11-13.5h |
| E3-T5 | 2-3h | 13-16.5h |
| E3-T6 | 2h | 15-18.5h |
| E3-T7 | 1h | 16-19.5h |

**Total**: 16-20 hours (2-3 days)

---

## What We're NOT Building (Deferred)

❌ Real Aave v3 integration (using mock yield instead)
❌ Multiple yield strategies (only Conservative/5% APY)
❌ Strategy rebalancing or switching
❌ Governance tokens (soulbound participation rewards)
❌ Dynamic Impact NFTs (static for MVP)
❌ Complex quadratic funding (simplified vote weighting)
❌ Vault editing after creation
❌ Whale performance bonuses
❌ Time-decay mechanisms
❌ Advanced analytics

---

## Next Steps

1. **Start E3-T1**: Create MockUSDC token
2. **Parallel E3-T2**: Build StudentRegistry (no dependencies)
3. **Then E3-T3**: EndaomentVault (depends on MockUSDC)
4. **Then E3-T4**: AllocationManager (depends on Registry + Vault)
5. **Then E3-T5**: Integration testing
6. **Finally E3-T6-T7**: Deploy and document

**Handoff to Epic 4**: Contract addresses, ABIs, deployment verified

See [epic-4-contract-integration.md](epic-4-contract-integration.md) for frontend integration.

---

**Last Updated**: 2025-11-08
**Epic Owner**: TBD
**Target Completion**: Day 5-7

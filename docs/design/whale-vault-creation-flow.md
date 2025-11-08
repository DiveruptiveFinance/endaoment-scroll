# Whale Vault Creation Flow - Complete Design

## Overview

Complete user flow design for whale vault creation, addressing all identified gaps and edge cases from brainstorming analysis.

## Original Proposal

**User's Initial Flow**:
1. Flow start - choose between users: whale/retail/student
2. Whale selects strategy and creates vault (ERC-4626 deposit)
3. Whale receives Impact NFT

## Identified Gaps & Enhancements

### 1. Vault Configuration Parameters

**Missing from original proposal**: Vault metadata and governance settings

**Required Parameters**:
- **Vault Name**: User-friendly identifier (e.g., "Education Impact Vault")
- **Description**: Mission statement, why retail should join (max 500 chars)
- **Initial Deposit**: Whale capital commitment (1000+ USDC minimum)
- **Strategy Selection**: Conservative (MVP), Balanced/Aggressive (coming soon)
- **Minimum Retail Deposit**: Configurable floor (default 10 USDC, can set higher)
- **Fundraising Target**: Optional goal (e.g., "5000 USDC total")
- **Fundraising Deadline**: Time limit or open-ended
- **Cover Image**: Vault visual in marketplace (optional, default template)

**Optional Advanced Parameters** (Post-MVP):
- Maximum participants cap
- Whale voting weight multiplier
- Student pre-selection list
- Custom allocation frequency

### 2. Multi-Step Wizard Structure

**Problem**: Single-step flow too complex, high error rate

**Solution**: 6-step wizard with progress indicator

#### Step 1: Choose Role
**Route**: `/` or `/start`

**UI**:
```
┌─────────────────────────────────────────┐
│   Welcome to Endaoment                  │
│   Choose your role:                     │
│                                         │
│   🐋 Whale                              │
│   Create a vault and lead impact        │
│   [Create Vault →]                      │
│                                         │
│   💰 Retail Donor                       │
│   Join existing vaults                  │
│   [Explore Vaults →]                    │
│                                         │
│   🎓 Student                            │
│   Receive funding for education         │
│   [Create Profile →] (Coming Soon)      │
└─────────────────────────────────────────┘
```

#### Step 2: Select Strategy
**Route**: `/vault/create/strategy`

**UI**:
```
┌─────────────────────────────────────────┐
│   Create Your Vault - Step 1 of 5      │
│   ═══╗                                  │
│      ║                                  │
│                                         │
│   Choose Yield Strategy:                │
│                                         │
│   [🛡️ Conservative Stablecoin]         │
│   ✓ Selected                            │
│   4-6% APY • Low Risk • Aave USDC       │
│   Recommended for first-time whales     │
│                                         │
│   [⚖️ Balanced Optimizer]               │
│   Coming Soon                           │
│   7-10% APY • Medium Risk               │
│                                         │
│   [🚀 Aggressive Multi-Protocol]        │
│   Coming Soon                           │
│   12-18% APY • High Risk                │
│                                         │
│   [← Back]              [Continue →]    │
└─────────────────────────────────────────┘
```

**Validation**: At least one strategy selected (Conservative auto-selected for MVP)

#### Step 3: Configure Vault
**Route**: `/vault/create/configure`

**UI**:
```
┌─────────────────────────────────────────┐
│   Create Your Vault - Step 2 of 5      │
│   ═══╦═══╗                              │
│      ║   ║                              │
│                                         │
│   Vault Details:                        │
│                                         │
│   Vault Name *                          │
│   [                                   ] │
│   e.g., "Education Impact Vault"        │
│                                         │
│   Description *                         │
│   [                                   ] │
│   [                                   ] │
│   Why should donors join your vault?    │
│                                         │
│   Initial Deposit (USDC) *              │
│   [1000                              ]  │
│   Minimum: 1000 USDC                    │
│   Your balance: 5000 USDC               │
│                                         │
│   Min Retail Deposit (USDC)             │
│   [10                                ]  │
│   Default: 10 USDC                      │
│                                         │
│   [← Back]              [Continue →]    │
└─────────────────────────────────────────┘
```

**Validation**:
- Vault name required (3-50 chars)
- Description required (10-500 chars)
- Initial deposit >= 1000 USDC
- User balance >= initial deposit
- Min retail deposit >= 10 USDC

#### Step 4: Review & Confirm
**Route**: `/vault/create/review`

**UI**:
```
┌─────────────────────────────────────────┐
│   Create Your Vault - Step 3 of 5      │
│   ═══╦═══╦═══╗                          │
│      ║   ║   ║                          │
│                                         │
│   Review Your Vault:                    │
│                                         │
│   📋 Name                                │
│   Education Impact Vault                │
│                                         │
│   📝 Description                         │
│   Supporting students in computer       │
│   science to build the future...        │
│                                         │
│   🛡️ Strategy                            │
│   Conservative Stablecoin (5% APY)      │
│                                         │
│   💰 Initial Deposit                     │
│   1000 USDC                             │
│                                         │
│   👥 Min Retail Deposit                  │
│   10 USDC                               │
│                                         │
│   ⚠️ You will need to approve two       │
│   transactions: USDC approval + vault   │
│   deposit                               │
│                                         │
│   [← Back]         [Create Vault →]     │
└─────────────────────────────────────────┘
```

#### Step 5: Execute Transactions
**Route**: `/vault/create/execute`

**Transaction Flow**:

**5a. Approve USDC**
```
┌─────────────────────────────────────────┐
│   Create Your Vault - Step 4 of 5      │
│   ═══╦═══╦═══╦═══╗                      │
│      ║   ║   ║   ║                      │
│                                         │
│   Transaction 1 of 2                    │
│   Approve USDC                          │
│                                         │
│   🔄 Waiting for wallet confirmation... │
│                                         │
│   Please approve the vault contract to  │
│   spend 1000 USDC from your wallet.     │
│                                         │
│   Estimated gas: ~0.0001 ETH            │
│                                         │
│   [Pending...]                          │
└─────────────────────────────────────────┘
```

**5b. Deposit to Vault**
```
┌─────────────────────────────────────────┐
│   Create Your Vault - Step 4 of 5      │
│   ═══╦═══╦═══╦═══╗                      │
│      ║   ║   ║   ║                      │
│                                         │
│   Transaction 2 of 2                    │
│   Deposit to Vault                      │
│                                         │
│   ✅ USDC Approved                       │
│   🔄 Depositing and minting vault...    │
│                                         │
│   Please confirm the deposit            │
│   transaction in your wallet.           │
│                                         │
│   Estimated gas: ~0.0005 ETH            │
│                                         │
│   [Pending...]                          │
└─────────────────────────────────────────┘
```

**Error Handling**:
- User rejects TX → "Transaction cancelled. [Try Again]"
- Insufficient balance → "Insufficient USDC balance. [Adjust Amount]"
- TX fails → "Transaction failed: [error]. [Retry] [Get Help]"
- Network timeout → "Network congested. [Retry with Higher Gas]"

**MVP Implementation**: Mock both transactions with 2-second delays each

#### Step 6: Success & Impact NFT
**Route**: `/vault/create/success`

**UI**:
```
┌─────────────────────────────────────────┐
│   Create Your Vault - Step 5 of 5      │
│   ═══╦═══╦═══╦═══╦═══╗                  │
│      ║   ║   ║   ║   ║                  │
│                                         │
│   ✅ Vault Created Successfully!         │
│                                         │
│   ┌───────────────────────────┐         │
│   │  [Impact NFT Image]       │         │
│   │                           │         │
│   │  Endaoment Whale #1       │         │
│   │  Education Impact Vault   │         │
│   │                           │         │
│   │  🛡️ Conservative Strategy  │         │
│   │  💰 1000 USDC Initial     │         │
│   │  📅 Created Nov 7, 2025   │         │
│   └───────────────────────────┘         │
│                                         │
│   Your vault is now live and visible    │
│   in the marketplace!                   │
│                                         │
│   [View My Vault Dashboard →]           │
│   [Share on Farcaster] [Invite Donors]  │
└─────────────────────────────────────────┘
```

**Auto-Actions**:
- Vault created in database with status "active"
- Impact NFT minted and associated with whale address
- Vault appears in marketplace (`/vaults`)
- Whale redirected to vault dashboard (`/vault/[id]`)

### 3. Transaction Implementation Details

#### MVP Mock Transaction Flow
```typescript
// utils/mockTransactions.ts

export async function mockApproveUSDC(
  vaultAddress: string,
  amount: number
): Promise<{ success: boolean; txHash: string }> {
  // Simulate 2-second wallet confirmation + network confirmation
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    success: true,
    txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
  };
}

export async function mockDepositToVault(
  vaultId: string,
  amount: number,
  whaleAddress: string
): Promise<{
  success: boolean;
  txHash: string;
  vaultShares: number;
  nftTokenId: number;
}> {
  // Simulate 2-second wallet confirmation + network confirmation
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    success: true,
    txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    vaultShares: amount, // 1:1 for first deposit
    nftTokenId: Date.now(), // Unique NFT ID
  };
}
```

#### Future Real Transaction Flow (Post-MVP)
```typescript
// contracts/interactions/vaultFactory.ts

import { writeContract, waitForTransaction } from 'wagmi/actions';

export async function createVault(
  strategyId: string,
  metadata: VaultMetadata,
  initialDeposit: bigint
): Promise<VaultCreationResult> {
  // 1. Approve USDC
  const approveHash = await writeContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [VAULT_FACTORY_ADDRESS, initialDeposit],
  });

  await waitForTransaction({ hash: approveHash });

  // 2. Create vault + deposit
  const createHash = await writeContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VAULT_FACTORY_ABI,
    functionName: 'createVault',
    args: [strategyId, metadata, initialDeposit],
  });

  const receipt = await waitForTransaction({ hash: createHash });

  // 3. Parse events for vault address and NFT token ID
  const vaultCreatedEvent = parseEventLogs({
    abi: VAULT_FACTORY_ABI,
    logs: receipt.logs,
    eventName: 'VaultCreated',
  })[0];

  return {
    vaultAddress: vaultCreatedEvent.args.vaultAddress,
    nftTokenId: vaultCreatedEvent.args.nftTokenId,
    txHash: createHash,
  };
}
```

### 4. Impact NFT Specification

#### NFT Metadata (ERC-721)
```json
{
  "name": "Endaoment Whale Vault #1",
  "description": "Proof of vault creation for Education Impact Vault. This NFT represents ownership and management rights for a yield-generating vault supporting students in computer science.",
  "image": "ipfs://QmXxx.../whale-nft-1.png",
  "external_url": "https://endaoment.app/vault/vault-1",
  "attributes": [
    {
      "trait_type": "Vault ID",
      "value": "vault-1"
    },
    {
      "trait_type": "Strategy",
      "value": "Conservative Stablecoin"
    },
    {
      "trait_type": "Initial Deposit",
      "value": "1000 USDC",
      "display_type": "number"
    },
    {
      "trait_type": "Created Date",
      "value": 1730937600,
      "display_type": "date"
    },
    {
      "trait_type": "Whale Address",
      "value": "0x1234...5678"
    },
    {
      "trait_type": "Risk Level",
      "value": "Low"
    }
  ]
}
```

#### NFT Image Design (Static SVG)
```svg
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>

  <!-- Whale emoji -->
  <text x="200" y="120" font-size="80" text-anchor="middle">🐋</text>

  <!-- Vault Name -->
  <text x="200" y="180" font-size="24" font-weight="bold"
        text-anchor="middle" fill="white">
    Education Impact Vault
  </text>

  <!-- Strategy Badge -->
  <text x="200" y="220" font-size="18" text-anchor="middle" fill="white">
    🛡️ Conservative Strategy
  </text>

  <!-- Initial Deposit -->
  <text x="200" y="260" font-size="20" text-anchor="middle" fill="white">
    💰 1000 USDC
  </text>

  <!-- Creation Date -->
  <text x="200" y="290" font-size="16" text-anchor="middle" fill="white">
    📅 Nov 7, 2025
  </text>

  <!-- Whale Address -->
  <text x="200" y="320" font-size="14" text-anchor="middle" fill="white">
    0x1234...5678
  </text>

  <!-- Endaoment Branding -->
  <text x="200" y="360" font-size="16" text-anchor="middle" fill="white">
    Endaoment
  </text>
</svg>
```

**MVP Implementation**: Generate SVG dynamically on server, serve via API endpoint

#### NFT Utility & Access Control
- **Vault Management**: Only NFT holder can access `/vault/[id]/manage`
- **Settings Updates**: Only NFT holder can edit vault parameters
- **Capital Withdrawal**: Only NFT holder can initiate withdrawals
- **Social Proof**: Display NFT in Farcaster frames, Twitter cards
- **Future Utility**: Governance rights, platform fee discounts, whale events

### 5. Post-Creation Whale Dashboard

#### Vault Management Page
**Route**: `/vault/[id]/manage` (Whale-only, requires Impact NFT)

**Sections**:

**Overview**:
```
┌─────────────────────────────────────────┐
│   Education Impact Vault                │
│   Whale Dashboard                       │
│                                         │
│   💰 Total Capital                       │
│   $5,000 (Your: $1,000 + Retail: $4,000)│
│                                         │
│   📈 Yield Generated                     │
│   $25.50 (5.0% APY)                     │
│                                         │
│   👥 Participants                        │
│   12 retail donors                      │
│                                         │
│   🗳️ Next Allocation                     │
│   7 days, 14 hours remaining            │
│                                         │
│   [Invite Donors] [Vote on Allocation]  │
└─────────────────────────────────────────┘
```

**Invite Retail Donors**:
- Generate shareable link: `https://endaoment.app/vault/vault-1?ref=whale`
- Farcaster frame with vault preview
- Direct wallet invite (enter addresses)
- QR code for in-person sharing

**Allocation Voting**:
- Current allocation if already voted
- Remaining yield to allocate
- Student selection interface (same as retail, but whale-only view until retail joins)

**Performance Analytics**:
- Yield history chart (last 30 days)
- APY performance vs target
- Capital growth timeline
- Participant acquisition funnel

**Vault Settings** (MVP: View only, editing post-hackathon):
- View vault metadata
- See minimum retail deposit
- Check strategy details
- "Edit" button disabled with "Coming Soon" tooltip

### 6. Edge Cases & Validation

#### Case 1: No Retail Donors Join
**Scenario**: Whale creates vault, 30 days pass, no retail joins

**Solution**:
- Vault remains active, functions as "solo vault"
- Whale can allocate yield to students independently
- Whale incentives (leverage multiplier) inactive until retail joins
- Whale can add more capital anytime
- Option to "close" vault and withdraw if desired

#### Case 2: Insufficient Balance
**Scenario**: User tries to deposit more than wallet balance

**Prevention**:
- Balance check in Step 3 (Configure Vault)
- Real-time balance display
- Max button auto-fills available balance
- Error message if amount exceeds balance

#### Case 3: Network Congestion
**Scenario**: Transaction pending for >1 minute

**Handling**:
- Show "Transaction pending..." with spinner
- Option to "Speed Up" with higher gas (post-MVP)
- Timeout after 5 minutes → "Retry" button
- Link to Basescan to check transaction status

#### Case 4: Wallet Disconnects Mid-Flow
**Scenario**: User disconnects wallet during Step 3-5

**Handling**:
- Save form state to localStorage
- Show "Wallet disconnected" banner
- "Reconnect Wallet" button
- Restore form state on reconnection

#### Case 5: User Exits Before Completion
**Scenario**: User closes tab during vault creation

**Handling**:
- Save draft to localStorage (steps 1-4)
- On return, show "Resume vault creation?" modal
- Option to continue or start fresh
- Drafts expire after 24 hours

### 7. Student Integration

#### MVP Approach: Pre-Seeded Students
- Use existing `STUDENTS` mock data from Epic 1
- No student onboarding flow required for hackathon
- All whales and retail see same 3 students to allocate to
- Students displayed with existing StudentCard component

#### Post-MVP: Student Onboarding Flow
**Route**: `/student/register`

**Steps**:
1. **Identity**: Farcaster login required
2. **Profile**: Name, institution, field of study
3. **Project**: Funding need, goal, milestones
4. **Verification**: Document upload (proof of enrollment)
5. **Review**: Pending → Verified by platform
6. **Active**: Eligible for allocation votes

**Student Dashboard** (`/student/dashboard`):
- Funding received history
- Current funders (vault list)
- Impact reporting interface
- Thank donors functionality

### 8. Complete Flow Summary

#### Whale Journey (MVP)
```
1. Landing (/)
   → Choose "Whale" role

2. Strategy Selection (/vault/create/strategy)
   → Select "Conservative Stablecoin" (auto-selected)
   → Click "Continue"

3. Configure Vault (/vault/create/configure)
   → Enter vault name: "Education Impact Vault"
   → Enter description: "Supporting CS students..."
   → Enter initial deposit: 1000 USDC
   → Set min retail deposit: 10 USDC (default)
   → Click "Continue"

4. Review (/vault/create/review)
   → Verify all details
   → Click "Create Vault"

5. Execute Transactions (/vault/create/execute)
   → Mock Approve USDC (2s delay)
   → Mock Deposit to Vault (2s delay)
   → Automatic: Mint Impact NFT

6. Success (/vault/create/success)
   → View Impact NFT
   → Click "View My Vault Dashboard"

7. Vault Dashboard (/vault/[id]/manage)
   → See vault stats
   → Invite retail donors
   → Vote on allocation (if epoch active)

8. Marketplace (/vaults)
   → Vault now visible to retail donors
   → Retail can browse and join
```

#### Retail Journey (Simplified)
```
1. Landing (/)
   → Choose "Retail Donor" role

2. Marketplace (/vaults)
   → Browse vault cards
   → Click "Education Impact Vault"

3. Vault Detail (/vault/vault-1)
   → Review whale, strategy, performance
   → Click "Join Vault"

4. Deposit Modal
   → Enter amount: 50 USDC
   → Click "Confirm"

5. Execute Transactions
   → Mock Approve + Deposit (4s total)

6. Success
   → Redirect to Dashboard (/dashboard)
   → See vault membership, yield tracking
```

## Implementation Checklist

### Phase 1: Data & Utils (Epic 2)
- [ ] Create `data/vaultTemplates.ts` with vault metadata types
- [ ] Implement `utils/mockTransactions.ts` with approve + deposit mocks
- [ ] Implement `utils/nftGenerator.ts` with SVG generation
- [ ] Add vault state management (Context or Zustand)

### Phase 2: Wizard Components (Epic 2-3)
- [ ] Create `/vault/create/strategy` page with StrategySelector
- [ ] Create `/vault/create/configure` page with VaultConfigForm
- [ ] Create `/vault/create/review` page with ReviewSummary
- [ ] Create `/vault/create/execute` page with TransactionProgress
- [ ] Create `/vault/create/success` page with NFT display

### Phase 3: Whale Dashboard (Epic 3-4)
- [ ] Create `/vault/[id]/manage` page with whale dashboard
- [ ] Implement InviteDonors component with shareable links
- [ ] Implement PerformanceAnalytics component with charts
- [ ] Add vault settings view (editing disabled for MVP)

### Phase 4: Integration (Epic 4)
- [ ] Connect wizard to marketplace (vault appears after creation)
- [ ] Test complete whale → retail flow
- [ ] Validate all edge cases and error handling
- [ ] Add localStorage persistence for drafts

## Success Metrics

- [ ] Whale can create vault in <2 minutes
- [ ] All form validations work correctly
- [ ] Mock transactions complete without errors
- [ ] Impact NFT generates with correct metadata
- [ ] Vault appears in marketplace immediately after creation
- [ ] Whale dashboard shows accurate stats
- [ ] Retail can discover and join vault
- [ ] No console errors during flow
- [ ] Mobile responsive (Farcaster miniapp requirement)

## Open Questions for User

1. **Student Pre-selection**: Should whales be able to limit which students can receive from their vault, or is it always the global pool?

2. **Multiple Vaults**: Can whales create multiple vaults with different strategies, or one vault per whale for MVP?

3. **Vault Naming**: Should vault names be unique across platform, or can multiple whales use same name?

4. **NFT Transferability**: Should Impact NFT be transferable (allowing vault ownership transfer) or soulbound?

5. **Fundraising Mode**: Should vaults have explicit "fundraising" vs "active" phases, or always open for retail?

6. **Whale Incentives**: Should whale rewards start accruing immediately or only after retail joins?

7. **Allocation Timing**: Can whale vote on allocation before retail joins, or must wait for first retail participant?

8. **Capital Withdrawal**: Should whales be able to withdraw capital anytime, at epoch boundaries only, or never (perpetual)?

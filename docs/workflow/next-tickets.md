# Next Tickets to Develop

**Current Status**: Epic 1 nearly complete (5/7 done), ready to start Epic 2
**Last Commit**: `e216e35` - MVP scope defined and restructured

---

## Immediate Priority: Epic 1 Completion

### E1-T7: Responsive Design Polish (2-3h)
**Status**: 🔲 TODO - HIGHEST PRIORITY
**Why**: Finish Epic 1 before starting Epic 2

**Tasks**:
- Test all existing pages on mobile (375px, 768px, 1440px)
- Fix any responsive issues in:
  - Homepage `/`
  - Student detail `/student/[id]`
  - Donation flow `/donate/[id]`
  - Allocation interface `/allocate`
  - Dashboard `/dashboard`
- Ensure touch targets ≥44px
- Verify no horizontal scroll on mobile
- Test forms and sliders on mobile

**Quick Win**: Most pages already use DaisyUI responsive classes, likely only minor fixes needed.

---

## Epic 2: Vault UI (Starting Next)

### Phase 1: Foundation (Days 1-2)

#### E2-T1: Role Selection Landing Page (1-2h) ⭐ START HERE AFTER E1-T7
**Priority**: HIGH - Entry point for entire vault flow
**Status**: 🔲 TODO

**Implementation**:
```typescript
// app/start/page.tsx
// 3 cards: Whale, Retail, Student
// Route whale → /vault/create
// Route retail → /vaults
// Route student → Coming soon message
```

**Dependencies**: None
**Deliverable**: Landing page with 3 role cards + routing

---

#### E2-T2: Whale Vault Creation Wizard (4-5h)
**Priority**: HIGH - Core whale functionality
**Status**: 🔲 TODO
**Dependencies**: E2-T1 (for routing)

**Implementation Breakdown**:

**Step 1: Strategy Selection** (`/vault/create/strategy`)
- Display Conservative strategy card (auto-selected)
- Show Balanced/Aggressive as "Coming Soon"
- Store strategy in form state
- Continue button → Step 2

**Step 2: Configure Vault** (`/vault/create/configure`)
- Vault name input (required, 3-50 chars)
- Vault description textarea (required, 10-500 chars)
- Initial deposit input (required, 1000+ USDC)
- Display user's mock balance
- Validation for all fields
- Continue button → Step 3

**Step 3: Review & Execute** (`/vault/create/review`)
- Summary of all vault details
- Strategy badge display
- Mock transaction flow:
  - "Approve USDC" (2s delay)
  - "Deposit to Vault" (2s delay)
- Success screen with Impact NFT
- Redirect to vault dashboard

**Files to Create**:
- `app/vault/create/strategy/page.tsx`
- `app/vault/create/configure/page.tsx`
- `app/vault/create/review/page.tsx`
- `components/vault/WizardProgress.tsx` (optional)
- `utils/vaultCreation.ts` (form validation)

**Deliverable**: Complete 3-step whale vault creation flow

---

#### E2-T3: Impact NFT Generator (2-3h)
**Priority**: MEDIUM - Whale reward
**Status**: 🔲 TODO
**Dependencies**: E2-T2 (for vault data)

**Implementation**:
```typescript
// utils/nftGenerator.ts
export function generateImpactNFT(vaultData: {
  name: string;
  strategyId: string;
  initialDeposit: number;
  whaleAddress: string;
  createdAt: Date;
}): string {
  // Return SVG string with dynamic data
}

// components/vault/ImpactNFT.tsx
// Display component with metadata
```

**Design Specs** (from whale-vault-creation-flow.md):
- 400x400px SVG
- Gradient background (blue to purple)
- Whale emoji
- Vault name
- Strategy badge
- Initial deposit amount
- Creation date
- Whale address (truncated)

**Deliverable**: NFT generator + display component

---

### Phase 2: Marketplace (Days 2-3)

#### E2-T4: Vault Marketplace Page (3-4h)
**Priority**: HIGH - Retail entry point
**Status**: 🔲 TODO
**Dependencies**: None (can work in parallel with E2-T2)

**Implementation**:
```typescript
// app/vaults/page.tsx
// Display list of VaultCard components
// For MVP: 1 pre-created vault

// components/vault/VaultCard.tsx
// Similar to StudentCard structure
// Show: name, whale, strategy, APY, capital, participants
```

**Mock Data**:
```typescript
// data/mockVaults.ts
export const MOCK_VAULTS: Vault[] = [
  {
    id: "vault-1",
    name: "Education Impact Vault",
    whaleAddress: "0x1234...5678",
    whaleName: "Alice Philanthropist",
    strategyId: "conservative-stablecoin",
    totalCapital: 5000,
    currentAPY: 5.0,
    participantCount: 12,
    // ...
  },
];
```

**Deliverable**: Marketplace page with vault cards

---

#### E2-T5: Vault Detail Page (3-4h)
**Priority**: HIGH - Retail decision point
**Status**: 🔲 TODO
**Dependencies**: E2-T4 (vault data structure)

**Implementation**:
```typescript
// app/vault/[id]/page.tsx
// Sections:
// 1. Vault header (name, whale, strategy)
// 2. Stats cards (capital, APY, participants)
// 3. Strategy details (from yieldStrategies.ts)
// 4. Participant list (mock)
// 5. "Join Vault" CTA button
```

**Deliverable**: Vault detail page with all info

---

#### E2-T6: Retail Join Vault Flow (2-3h)
**Priority**: HIGH - Core retail functionality
**Status**: 🔲 TODO
**Dependencies**: E2-T5 (vault detail page)

**Implementation**:
```typescript
// Modal or separate page for join flow
// 1. Deposit amount input (10+ USDC min)
// 2. Share calculation preview
// 3. Mock transaction (Approve + Deposit)
// 4. Success → Redirect to dashboard
```

**Share Calculation**:
```typescript
// For first deposit: shares = deposit amount (1:1)
// For subsequent: shares = (deposit * totalShares) / totalAssets
```

**Deliverable**: Complete retail join flow

---

### Phase 3: Whale Management (Day 3)

#### E2-T7: Whale Dashboard (3-4h)
**Priority**: MEDIUM - Whale post-creation
**Status**: 🔲 TODO
**Dependencies**: E2-T2, E2-T3 (vault + NFT)

**Implementation**:
```typescript
// app/vault/[id]/manage/page.tsx
// Whale-only view (check if user is vault creator)
// Sections:
// 1. Overview stats (capital, yield, participants)
// 2. Impact NFT display
// 3. Invite donors section (shareable link)
// 4. Performance charts (mock historical data)
// 5. Link to allocation voting
```

**Access Control** (MVP):
```typescript
// Mock check: if userAddress === vault.whaleAddress
// Real check (Epic 5): if user owns Impact NFT
```

**Deliverable**: Whale vault management dashboard

---

## Recommended Development Order

### Week 1: Vault UI Foundation
1. **Day 1 Morning**: E1-T7 (Responsive polish - 2-3h)
2. **Day 1 Afternoon**: E2-T1 (Role selection - 1-2h)
3. **Day 1-2**: E2-T2 (Whale creation wizard - 4-5h)
4. **Day 2**: E2-T3 (Impact NFT - 2-3h)

### Week 1: Marketplace
5. **Day 2-3**: E2-T4 (Vault marketplace - 3-4h)
6. **Day 3**: E2-T5 (Vault detail - 3-4h)
7. **Day 3**: E2-T6 (Retail join - 2-3h)

### Week 1: Polish
8. **Day 3**: E2-T7 (Whale dashboard - 3-4h)

**Total Epic 2 Time**: 18-25 hours (2.5-3 days)

---

## Parallel Work Opportunities

If you have multiple developers, these can be done in parallel:

**Track A** (Whale Flow):
- E2-T1 → E2-T2 → E2-T3 → E2-T7

**Track B** (Retail Flow):
- E2-T4 → E2-T5 → E2-T6

**Track C** (Smart Contracts - Can start anytime):
- E3-T1 (ERC-4626 base)
- E3-T2 (Aave integration)
- E3-T3 (Vault factory)

---

## Quick Start Checklist

Ready to start coding? Here's your immediate action list:

### Today: Complete Epic 1
- [ ] Test all pages on mobile (Chrome DevTools device mode)
- [ ] Fix any responsive issues found
- [ ] Commit: "fix responsive design across all pages"
- [ ] Mark E1-T7 as DONE

### Tomorrow: Start Epic 2
- [ ] Create `app/start/page.tsx` with role selection
- [ ] Create 3 role cards (Whale, Retail, Student)
- [ ] Add routing logic
- [ ] Test navigation
- [ ] Commit: "add role selection landing page"
- [ ] Mark E2-T1 as DONE

### This Week: Vault Creation
- [ ] Implement 3-step wizard (E2-T2)
- [ ] Add Impact NFT generator (E2-T3)
- [ ] Build marketplace (E2-T4)
- [ ] Create vault detail page (E2-T5)
- [ ] Implement retail join flow (E2-T6)
- [ ] Build whale dashboard (E2-T7)

---

## Data Files Needed

Before starting Epic 2, create these data files:

### `data/yieldStrategies.ts` (from design doc)
```typescript
export const YIELD_STRATEGIES: YieldStrategy[] = [
  {
    id: "conservative-stablecoin",
    name: "Conservative Stablecoin",
    description: "Deposit USDC into Aave for stable yields.",
    riskLevel: "low",
    targetAPY: { min: 4, max: 6 },
    currentAPY: 5.0,
    protocols: ["Aave"],
    icon: "🛡️",
    isActive: true,
  },
  // Balanced and Aggressive with isActive: false
];
```

### `data/mockVaults.ts`
```typescript
export const MOCK_VAULTS: Vault[] = [
  {
    id: "vault-1",
    name: "Education Impact Vault",
    whaleAddress: "0x1234...5678",
    whaleName: "Alice Philanthropist",
    strategyId: "conservative-stablecoin",
    totalCapital: 5000,
    whaleCapital: 1000,
    retailCapital: 4000,
    currentAPY: 5.0,
    yieldGenerated: 25.5,
    participantCount: 12,
    createdAt: new Date("2025-10-01"),
    status: "active",
    minRetailDeposit: 10,
  },
];
```

### `types/vault.ts`
```typescript
export interface Vault {
  id: string;
  name: string;
  description?: string;
  whaleAddress: string;
  whaleName: string;
  strategyId: string;
  totalCapital: number;
  whaleCapital: number;
  retailCapital: number;
  currentAPY: number;
  yieldGenerated: number;
  participantCount: number;
  createdAt: Date;
  status: "fundraising" | "active" | "closed";
  minRetailDeposit: number;
}

export interface YieldStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  targetAPY: { min: number; max: number };
  currentAPY: number;
  protocols: string[];
  icon: string;
  isActive: boolean;
}
```

---

## Success Metrics

After completing these tickets, you should have:

✅ Complete whale vault creation flow (3 steps)
✅ Impact NFT generation and display
✅ Vault marketplace for retail browsing
✅ Vault detail page with all info
✅ Retail join vault flow with mock transactions
✅ Whale dashboard for vault management
✅ All pages mobile responsive

**Demo Flow**:
1. Start → Choose "Whale"
2. Create vault (3 steps, 30 seconds)
3. View vault dashboard
4. Start → Choose "Retail"
5. Browse marketplace
6. Join vault (10 seconds)
7. View dashboard with vault membership

**Total Demo Time**: ~2 minutes for complete flow

---

## Questions?

- **Stuck on responsive design?** Check DaisyUI docs for responsive utilities
- **Need vault data structure?** See `types/vault.ts` above
- **Confused about wizard flow?** Reference `docs/design/whale-vault-creation-flow.md`
- **Need NFT design?** See SVG template in vault creation flow doc

Ready to build! 🚀

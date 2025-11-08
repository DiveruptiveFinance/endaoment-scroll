# Frontend Mock: Yield Strategy System

## Overview

Mock implementation of whale vault yield strategies for hackathon MVP. Simulates Octant-style yield donation strategy with 3 curated strategies, defaulting to 1 active strategy/vault for speed.

## Design Goals

1. **Speed**: Hackathon-friendly, minimal complexity
2. **Realism**: Accurate simulation of yield mechanics without smart contracts
3. **Flexibility**: Easy to swap mock for real contracts later
4. **Clarity**: Clear UX for whale strategy selection and retail vault browsing

## Curated Yield Strategies

### Strategy 1: Conservative Stablecoin (Default/MVP)
**Target APY**: 4-6%
**Risk Level**: Low
**Protocols**: Aave USDC lending
**Description**: "Deposit USDC into Aave for stable, predictable yields. Best for risk-averse donors who want consistent impact."

**Mock Mechanics**:
- Fixed 5% APY
- Simulated yield accrual: `yield = principal × 0.05 × (days_elapsed / 365)`
- No impermanent loss
- Instant "deposits" and "withdrawals"

### Strategy 2: Balanced Yield Optimizer
**Target APY**: 7-10%
**Risk Level**: Medium
**Protocols**: Morpho + Aave rebalancing
**Description**: "Automatically rebalances between Morpho and Aave to optimize yields. Moderate risk with higher returns."

**Mock Mechanics**:
- Variable APY (7-10% range, randomized weekly)
- Simulated rebalancing events every 7 days
- Current APY displayed: `base_apy + random(-1%, +2%)`
- Slightly higher gas costs simulated

### Strategy 3: Aggressive Multi-Protocol
**Target APY**: 12-18%
**Risk Level**: High
**Protocols**: Morpho + Compound + Yearn
**Description**: "Deploy capital across multiple DeFi protocols for maximum yield. Higher returns with increased complexity and risk."

**Mock Mechanics**:
- Variable APY (12-18% range, changes daily)
- Simulated protocol allocation: 40% Morpho, 30% Compound, 30% Yearn
- Performance volatility: APY can swing ±3% day-to-day
- "Rebalancing" events show activity

## Data Model

### Strategy Type
```typescript
interface YieldStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  targetAPY: { min: number; max: number };
  currentAPY: number;
  protocols: string[];
  icon: string;
  isActive: boolean; // For MVP, only 1 strategy is active
}
```

### Vault Type (Extended)
```typescript
interface Vault {
  id: string;
  name: string;
  whaleAddress: string;
  whaleName: string;
  strategyId: string; // References YieldStrategy
  totalCapital: number;
  whaleCapital: number;
  retailCapital: number;
  currentAPY: number;
  yieldGenerated: number;
  participantCount: number;
  createdAt: Date;
  status: "fundraising" | "active" | "closed";
  minRetailDeposit: number; // 10 USDC
}
```

### Yield Simulation Type
```typescript
interface YieldSimulation {
  vaultId: string;
  timestamp: Date;
  principal: number;
  apy: number;
  daysElapsed: number;
  yieldAccrued: number;
  whaleReward: number;
  retailRewardPool: number;
  studentAllocation: number;
}
```

## Component Architecture

### 1. StrategySelector Component (Whale Flow)
**Location**: `/app/vault/create/page.tsx`

**Purpose**: Whale selects yield strategy when creating vault

**UI Elements**:
- Strategy cards (3 options) with risk badges
- APY range display with historical chart (mock data)
- Protocol logos and composition breakdown
- "Recommended" badge on Conservative strategy
- Selection highlights active strategy

**Mock Behavior**:
- All 3 strategies displayed
- For MVP: Only Conservative is selectable (others show "Coming Soon")
- On selection: Store `strategyId` in vault creation flow

### 2. VaultCard Component (Retail Flow)
**Location**: `/app/vaults/page.tsx` (marketplace)

**Purpose**: Display vault with strategy info for retail browsing

**UI Elements**:
- Vault name + whale identity
- Strategy badge (Conservative/Balanced/Aggressive)
- Current APY (live mock simulation)
- Capital raised progress bar
- Participant count
- "Join Vault" CTA

**Mock Behavior**:
- APY updates every 10 seconds (simulated tick)
- Progress bar animates as mock participants join
- Strategy badge color-coded by risk level

### 3. YieldDashboard Component (Donor Dashboard)
**Location**: `/app/dashboard/page.tsx`

**Purpose**: Show yield accrual and distribution breakdown

**UI Elements**:
- Total yield generated (animated counter)
- Yield breakdown chart (whale reward, retail reward, student allocation)
- APY history graph (last 30 days)
- Next distribution countdown timer
- "Your Earnings" breakdown by vault

**Mock Behavior**:
- Yield counter increments every second (simulated)
- Chart updates with mock historical data
- Distribution timer counts down to next epoch

### 4. StrategyPerformance Component (Vault Detail)
**Location**: `/app/vault/[id]/page.tsx`

**Purpose**: Detailed strategy performance for specific vault

**UI Elements**:
- Strategy description and protocols
- Live APY ticker
- Protocol allocation pie chart
- Rebalancing history timeline
- Risk metrics (volatility, drawdown)

**Mock Behavior**:
- APY ticker updates with small random variations
- Timeline shows simulated rebalancing events
- Metrics calculated from mock historical data

## Mock Data Structure

### Constants File: `data/yieldStrategies.ts`
```typescript
export const YIELD_STRATEGIES: YieldStrategy[] = [
  {
    id: "conservative-stablecoin",
    name: "Conservative Stablecoin",
    description: "Deposit USDC into Aave for stable, predictable yields.",
    riskLevel: "low",
    targetAPY: { min: 4, max: 6 },
    currentAPY: 5.0,
    protocols: ["Aave"],
    icon: "🛡️",
    isActive: true, // MVP default
  },
  {
    id: "balanced-optimizer",
    name: "Balanced Yield Optimizer",
    description: "Auto-rebalance between Morpho and Aave for optimized yields.",
    riskLevel: "medium",
    targetAPY: { min: 7, max: 10 },
    currentAPY: 8.5,
    protocols: ["Morpho", "Aave"],
    icon: "⚖️",
    isActive: false, // Coming soon
  },
  {
    id: "aggressive-multi",
    name: "Aggressive Multi-Protocol",
    description: "Deploy across multiple DeFi protocols for maximum yield.",
    riskLevel: "high",
    targetAPY: { min: 12, max: 18 },
    currentAPY: 15.2,
    protocols: ["Morpho", "Compound", "Yearn"],
    icon: "🚀",
    isActive: false, // Coming soon
  },
];

export const MOCK_VAULT: Vault = {
  id: "vault-1",
  name: "Education Impact Vault",
  whaleAddress: "0x1234...5678",
  whaleName: "Alice Philanthropist",
  strategyId: "conservative-stablecoin",
  totalCapital: 5000,
  whaleCapital: 1000,
  retailCapital: 4000,
  currentAPY: 5.0,
  yieldGenerated: 25.5, // Simulated since creation
  participantCount: 12,
  createdAt: new Date("2025-10-01"),
  status: "active",
  minRetailDeposit: 10,
};
```

### Utility: `utils/yieldSimulator.ts`
```typescript
/**
 * Simulate yield accrual for a vault
 */
export function calculateYieldAccrued(
  principal: number,
  apy: number,
  daysElapsed: number
): number {
  return principal * (apy / 100) * (daysElapsed / 365);
}

/**
 * Get current APY with simulated volatility
 */
export function getCurrentAPY(
  strategy: YieldStrategy,
  timestamp: Date = new Date()
): number {
  const { targetAPY, riskLevel } = strategy;
  const baseAPY = (targetAPY.min + targetAPY.max) / 2;

  // Simulate volatility based on risk level
  const volatility = {
    low: 0.2,    // ±0.2%
    medium: 1.0, // ±1.0%
    high: 3.0,   // ±3.0%
  }[riskLevel];

  // Deterministic randomness based on timestamp (day-level)
  const daysSinceEpoch = Math.floor(timestamp.getTime() / (1000 * 60 * 60 * 24));
  const seed = daysSinceEpoch * 12345;
  const random = (Math.sin(seed) + 1) / 2; // 0 to 1

  const variation = (random - 0.5) * 2 * volatility;
  return Math.max(targetAPY.min, Math.min(targetAPY.max, baseAPY + variation));
}

/**
 * Calculate yield distribution breakdown
 */
export function calculateYieldDistribution(totalYield: number): {
  whaleReward: number;
  retailRewardPool: number;
  studentAllocation: number;
} {
  const whaleReward = totalYield * 0.10; // 10% base
  const retailRewardPool = totalYield * 0.15; // 15%
  const studentAllocation = totalYield * 0.75; // 75%

  return { whaleReward, retailRewardPool, studentAllocation };
}

/**
 * Simulate historical APY data for charts
 */
export function generateHistoricalAPY(
  strategy: YieldStrategy,
  days: number = 30
): Array<{ date: Date; apy: number }> {
  const history: Array<{ date: Date; apy: number }> = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const apy = getCurrentAPY(strategy, date);
    history.push({ date, apy });
  }

  return history;
}

/**
 * Simulate rebalancing events for timeline
 */
export function generateRebalancingEvents(
  strategyId: string,
  days: number = 30
): Array<{ date: Date; fromProtocol: string; toProtocol: string; reason: string }> {
  if (strategyId === "conservative-stablecoin") {
    return []; // No rebalancing for conservative strategy
  }

  const events = [];
  const now = new Date();

  // Generate event every 7 days for balanced, 3 days for aggressive
  const frequency = strategyId === "balanced-optimizer" ? 7 : 3;

  for (let i = frequency; i <= days; i += frequency) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    events.push({
      date,
      fromProtocol: "Aave",
      toProtocol: "Morpho",
      reason: "Higher APY detected on Morpho",
    });
  }

  return events.reverse();
}
```

## User Flows

### Whale Flow: Create Vault with Strategy Selection

1. **Navigate to Create Vault** (`/vault/create`)
2. **Select Strategy** (StrategySelector component)
   - View 3 strategy cards
   - Conservative highlighted as "Recommended"
   - Balanced and Aggressive show "Coming Soon" badge
   - Click Conservative to select
3. **Configure Vault**
   - Enter vault name
   - Set initial deposit (1000+ USDC)
   - Review strategy details
4. **Confirm Creation**
   - Mock transaction (2-second delay)
   - Vault created with `strategyId: "conservative-stablecoin"`
   - Redirect to vault detail page

### Retail Flow: Browse and Join Vault

1. **Navigate to Vault Marketplace** (`/vaults`)
2. **Browse Vaults** (VaultCard components)
   - See multiple vaults (MVP: 1 active vault)
   - Each card shows strategy badge, APY, capital raised
   - APY updates live (every 10 seconds)
3. **Select Vault**
   - Click "View Details" on vault card
   - Navigate to `/vault/[id]`
4. **Review Vault Details** (StrategyPerformance component)
   - See whale info, strategy details, performance charts
   - View protocol allocation and rebalancing history
5. **Join Vault**
   - Click "Join Vault" button
   - Enter deposit amount (10+ USDC)
   - Mock transaction (2-second delay)
   - Receive vault shares, redirect to dashboard

### Donor Flow: Monitor Yield

1. **Navigate to Dashboard** (`/dashboard`)
2. **View Yield Metrics** (YieldDashboard component)
   - See total yield generated (animated counter)
   - View breakdown chart (whale/retail/student allocation)
   - Check APY history graph
   - See countdown to next distribution
3. **Drill Down by Vault**
   - Click vault name to see vault-specific performance
   - Navigate to `/vault/[id]` for detailed analytics

## Technical Implementation Notes

### State Management
- Use React Context or Zustand for global vault state
- Store selected strategy in vault creation flow
- Update APY values every 10 seconds with `setInterval`

### Animation
- Use Framer Motion for yield counter animations
- Animate progress bars with CSS transitions
- APY ticker uses smooth number transitions

### Data Refresh
- Mock "live" updates with `setInterval` hooks
- Simulate yield accrual with timestamp calculations
- Regenerate APY on each tick using `getCurrentAPY()`

### Hardcoded Assumptions (MVP)
- Only 1 vault exists (pre-created by whale)
- Only Conservative strategy is active
- No actual blockchain transactions
- Yield accrues linearly (no compounding simulation)
- All users see same APY (no personalized rates)

## Future Enhancements (Post-MVP)

1. **Multiple Active Strategies**: Enable Balanced and Aggressive
2. **Multiple Vaults**: Allow whales to create multiple vaults
3. **Strategy Comparison Tool**: Side-by-side strategy analysis
4. **Custom Strategy Builder**: Whale defines protocol allocations
5. **Real-time Gas Estimation**: Show gas costs for each strategy
6. **Historical Performance**: Real on-chain data from Base
7. **Risk Metrics Dashboard**: Sharpe ratio, max drawdown, volatility
8. **Auto-rebalancing Notifications**: Alert users to rebalancing events

## File Structure

```
packages/nextjs/
├── data/
│   ├── yieldStrategies.ts      # Strategy definitions
│   └── mockVaults.ts            # Mock vault data
├── utils/
│   └── yieldSimulator.ts        # Yield calculation utilities
├── components/
│   ├── vault/
│   │   ├── StrategySelector.tsx
│   │   ├── VaultCard.tsx
│   │   ├── StrategyPerformance.tsx
│   │   └── YieldDashboard.tsx
├── app/
│   ├── vault/
│   │   ├── create/
│   │   │   └── page.tsx         # Whale: Create vault + strategy selection
│   │   └── [id]/
│   │       └── page.tsx         # Vault detail + strategy performance
│   ├── vaults/
│   │   └── page.tsx             # Retail: Browse vaults marketplace
│   └── dashboard/
│       └── page.tsx             # Yield dashboard
```

## Success Criteria

- [x] 3 curated strategies defined with realistic parameters
- [x] MVP defaults to Conservative strategy only
- [x] Yield simulation matches Octant-style mechanics
- [x] Clear UX for whale strategy selection
- [x] Retail can browse vaults with strategy info
- [x] Dashboard shows live yield accrual (mocked)
- [x] Easy to swap mock for real contracts (interface abstraction)

## Next Steps

1. Implement `data/yieldStrategies.ts` and `utils/yieldSimulator.ts`
2. Create StrategySelector component for whale vault creation
3. Update VaultCard to display strategy info
4. Build YieldDashboard with animated metrics
5. Add StrategyPerformance component to vault detail page
6. Test yield accrual simulation with various time periods
7. Validate APY calculations match expected ranges

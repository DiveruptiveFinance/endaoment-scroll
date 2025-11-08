# Whale Vault Architecture

## Overview

Two-tier philanthropic model enabling "whale" philanthropists to create yield-generating vaults that retail donors can join, amplifying collective impact through pooled capital and quadratic funding allocation.

## Problem Statement

**Whale Challenge**: Philanthropists want to maximize impact but individual donations have limited reach. They need mechanisms to incentivize additional giving and multiply their influence.

**Retail Challenge**: Small donors want meaningful impact but individually generate minimal yield. They lack access to sophisticated yield strategies and direct student relationships.

**Solution**: Whales act as "lead investors" creating vaults with significant capital. Retail donors join these vaults, gaining access to better yields and amplified impact through combined resources.

## System Architecture

### Components

#### 1. Vault System (ERC-4626)
- **Vault Contract**: Standard ERC-4626 tokenized vault
- **Whale Role**: Creator who deposits 10k+ USDC minimum
- **Retail Role**: Co-investor who deposits 100+ USDC minimum
- **Shares**: Proportional ownership of vault capital
- **Yield Strategy**: Automated deployment to Aave, Morpho, other protocols

#### 2. Token Mechanics (Hybrid Model)

**Vault Shares (Transferable)**:
- Standard ERC-4626 shares
- Represent capital contribution
- Can exit at epoch boundaries
- Used for yield distribution

**Governance Tokens (Soulbound)**:
- Non-transferable, earned through participation
- 1 token per voting round participation
- Decay mechanism (lose 10% if skip 2 consecutive rounds)
- Multiplier for voting power

**Impact NFTs (Soulbound)**:
- Proof of contribution milestones
- Unlock perks (student updates, whale networking events)
- Purely reputational, no governance weight

**Voting Power Formula**:
```
voting_power = sqrt(vault_shares) × governance_token_multiplier
```

#### 3. Vault Lifecycle

**Phase 1: Creation**
- Whale deposits minimum capital (10k+ USDC)
- Vault NFT minted (represents vault ownership)
- Listed in public "Vaults" marketplace
- Whale sets parameters (target APY, strategy risk level)

**Phase 2: Fundraising**
- Retail donors browse vault marketplace
- Join vault with smaller amounts (100+ USDC)
- Receive vault shares (ERC-4626 tokens)
- Earn initial governance tokens

**Phase 3: Yield Generation**
- Combined capital deployed to yield strategies
- Automated rebalancing based on vault parameters
- Continuous yield accrual throughout epoch

**Phase 4: Allocation (Monthly)**
- Vault members vote on student allocation
- Weighted by voting power formula
- Quadratic funding applied across all vaults
- Results finalized on-chain

**Phase 5: Distribution**
- Yield distributed to students
- Rewards distributed to vault members
- Impact reports generated
- New epoch begins

### Yield Distribution Model

```
total_yield = vault_capital × APY × epoch_duration

whale_reward = base_allocation (10%) + performance_bonus
  where performance_bonus = max(0, (actual_APY - target_APY) × 0.5)

retail_reward_pool = total_yield × 0.15
retail_reward_individual = (user_shares / total_shares) × retail_reward_pool

student_allocation = total_yield - whale_reward - retail_reward_pool
```

### Governance Scope

**In-Scope (Vault Level)**:
- Student allocation votes
- Yield strategy selection (conservative vs aggressive)
- Vault parameters (minimum deposit, target APY)
- Student verification (if vault is student-specific)

**Out-of-Scope (Platform Level)**:
- Platform fee changes
- Smart contract upgrades
- Whale removal/slashing
- Global quadratic funding parameters

## Incentive Alignment

### Whale Incentives
1. **Financial**: 10-20% yield premium + performance bonuses
2. **Impact**: Multiply giving through retail co-investment (10x leverage potential)
3. **Status**: Vault NFT ownership, recognition in platform
4. **Network**: Access to other whales, student networking events
5. **Control**: Set vault strategy, influence allocation

### Retail Incentives
1. **Financial**: Higher yields than individual strategies (larger capital pool)
2. **Impact**: Participate in quadratic funding (amplified donations)
3. **Access**: Join whale-curated vaults, get student updates
4. **Governance**: Vote on allocations, earn governance tokens
5. **Community**: Connect with like-minded donors

### Student Benefits
1. **Capital**: Access to significant funding from pooled vaults
2. **Stability**: Perpetual funding model (principal stays invested)
3. **Validation**: Multiple donors supporting their work
4. **Network**: Connect with philanthropists and other students
5. **Transparency**: Public allocation results, community trust

## Technical Comparison

### vs Octant V2
- **Similar**: Staking rewards allocated via voting
- **Different**: Two-tier model (whales + retail), vault-based, Base chain

### vs Gitcoin
- **Similar**: Quadratic funding for public goods
- **Different**: Perpetual yield model, whale-led vaults, focused on education

### vs Traditional Endowments
- **Similar**: Principal preservation, yield distribution
- **Different**: Decentralized governance, transparent allocation, crypto-native

## Risk Mitigation

### Whale Risks
- **Exit Risk**: Lock period (1 epoch minimum) before withdrawal
- **Governance Attack**: Soulbound governance tokens prevent vote buying
- **Reputation Risk**: Public vault performance, community feedback

### Retail Risks
- **Smart Contract Risk**: Audited contracts, insurance integration
- **Impermanent Loss**: Stable yield strategies only (no liquidity provision)
- **Whale Abandonment**: Vault continues with retail governance if whale exits

### Platform Risks
- **Yield Strategy Failure**: Diversified protocols, circuit breakers
- **Quadratic Funding Gaming**: Sybil resistance (Farcaster identity)
- **Regulatory**: Educational focus (not investment product), proper disclaimers

## Implementation Roadmap

### Epic 2: Base Miniapp Migration
- Focus on Farcaster integration (whale/retail identity)
- Prepare for vault marketplace UI

### Epic 3: Smart Contracts
- **Core Contracts**:
  - VaultFactory.sol (create whale vaults)
  - EndaomentVault.sol (ERC-4626 + governance)
  - GovernanceToken.sol (soulbound participation rewards)
  - AllocationManager.sol (quadratic funding logic)
  - YieldStrategy.sol (Aave/Morpho integration)

### Epic 4: Vault Marketplace
- **Whale Flow**: Create vault → set parameters → invite retail
- **Retail Flow**: Browse vaults → join → track performance
- **UI Components**: VaultCard, VaultDetail, JoinVaultModal

### Epic 5: Allocation Mechanism
- **Voting Interface**: Student selection, percentage allocation
- **Quadratic Funding**: Cross-vault calculation
- **Results Dashboard**: Impact visualization, student updates

### Epic 6: Rewards & Analytics
- **Token Distribution**: Vault shares, governance tokens, impact NFTs
- **Dashboard**: Yield tracking, allocation history, impact metrics
- **Whale Tools**: Vault management, performance analytics

## Success Metrics

### Quantitative
- Number of whale vaults created
- Total capital in vaults (TVL)
- Retail participation rate (co-investors per vault)
- Average yield generated per epoch
- Student funding amounts (total and per student)

### Qualitative
- Whale satisfaction (NPS, retention)
- Retail donor feedback (UX, impact perception)
- Student outcomes (funding utilization, progress reports)
- Community engagement (voting participation, referrals)

## Next Steps

1. Review architecture with stakeholders
2. Update Epic 2-6 tickets to reflect vault-centric design
3. Begin smart contract development (VaultFactory, EndaomentVault)
4. Design vault marketplace wireframes
5. Define quadratic funding parameters

## Open Questions

1. Should whales be able to create multiple vaults with different strategies?
2. What's the minimum viable vault size (capital + retail participants)?
3. How do we prevent whale front-running of allocation votes?
4. Should governance tokens have time-decay or activity-decay?
5. What student verification is required before listing on platform?

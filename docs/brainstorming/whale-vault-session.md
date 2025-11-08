# Whale Vault Brainstorming Session

**Date**: 2025-11-07
**Participants**: User, Claude (brainstorming mode)
**Duration**: 10 sequential thoughts
**Status**: Analysis complete, architecture documented

## Session Goal

Design a philanthropic flow for "whale" donors who want to maximize impact by creating vaults that retail donors can join, amplifying collective giving through pooled capital and yield generation.

## Key Insights

### 1. Two-Tier Model Design
**Problem**: Individual philanthropy has limited reach.
**Solution**: Whales act as "lead investors" creating vaults, retail donors join as co-investors.
**Outcome**: 10x leverage potential (whale 10k + retail 90k = 100k vault).

### 2. Incentive Structures

**Whale Incentives**:
- Financial: 10-20% yield premium + performance bonuses
- Impact: Multiply influence through retail participation
- Status: Vault NFT ownership, platform recognition
- Network: Connect with other philanthropists
- Control: Set vault strategy, curate allocations

**Retail Incentives**:
- Financial: Higher yields (larger capital pool)
- Impact: Amplified donations via quadratic funding
- Access: Join whale-curated vaults
- Governance: Vote on student allocations
- Community: Connect with mission-aligned donors

### 3. Token Mechanics (Hybrid Model)

**Transferable (ERC-4626 Shares)**:
- Represent capital contribution
- Enable liquidity at epoch boundaries
- Determine yield distribution

**Soulbound (Governance Tokens)**:
- Earned through participation (voting, referrals)
- Prevent vote buying and speculation
- Decay if inactive (10% loss per 2 skipped rounds)

**Soulbound (Impact NFTs)**:
- Proof of contribution milestones
- Unlock perks (student updates, events)
- Purely reputational

**Voting Power Formula**:
```
voting_power = sqrt(vault_shares) × governance_token_multiplier
```

### 4. Vault Lifecycle

1. **Creation**: Whale deposits 10k+ USDC → vault NFT minted
2. **Fundraising**: Retail joins with 100+ USDC → receives shares
3. **Yield Generation**: Capital deployed to Aave/Morpho
4. **Allocation**: Monthly voting on student funding (quadratic)
5. **Distribution**: Yield to students, rewards to vault members

### 5. Yield Distribution Model

```
total_yield = vault_capital × APY × epoch_duration

whale_reward = 10% base + performance_bonus
retail_reward_pool = 15% of total_yield
student_allocation = remaining 75% via quadratic funding
```

## Comparison to Existing Models

### vs Octant V2
- **Similar**: Staking rewards allocated via community voting
- **Different**: Two-tier whale/retail model, vault-based architecture

### vs Gitcoin
- **Similar**: Quadratic funding for public goods
- **Different**: Perpetual yield model, whale-led vaults, education focus

### vs Traditional Endowments
- **Similar**: Principal preservation, yield distribution
- **Different**: Decentralized governance, transparent on-chain allocation

## Critical Decisions Made

### Decision 1: Hybrid Token Model
**Options**: Pure transferable vs pure soulbound vs hybrid
**Choice**: Hybrid (transferable shares + soulbound governance)
**Rationale**: Balances capital liquidity with governance authenticity

### Decision 2: Quadratic Funding Scope
**Options**: Platform-wide vs vault-specific
**Choice**: Cross-vault quadratic funding
**Rationale**: Amplifies smaller vaults, prevents whale dominance

### Decision 3: Whale Minimum Capital
**Options**: 5k, 10k, 25k, 50k USDC
**Choice**: 10k USDC
**Rationale**: Significant enough for impact, accessible for many philanthropists

### Decision 4: Governance Scope
**Options**: Full DAO vs limited vault governance
**Choice**: Limited to vault parameters and student allocation
**Rationale**: Reduces attack surface, focuses on core mission

## Implementation Impact

### Epic 2: Base Miniapp Migration
- Focus on Farcaster identity (whale/retail verification)
- Design vault marketplace UI patterns

### Epic 3: Smart Contracts
- **New Contracts**: VaultFactory, EndaomentVault (ERC-4626), GovernanceToken (soulbound), AllocationManager (quadratic funding)
- **Complexity**: High (multi-token system, yield routing, governance)
- **Audit Priority**: Critical (handles funds)

### Epic 4: Vault Marketplace
- **Whale Flow**: Create vault → set parameters → invite retail
- **Retail Flow**: Browse vaults → join → track performance
- **UI Complexity**: Medium (vault discovery, joining UX)

### Epic 5: Allocation Mechanism
- **Voting Interface**: Student selection with quadratic funding preview
- **Cross-Vault Logic**: Calculate allocation across all vaults
- **Gas Optimization**: Batch operations, off-chain aggregation

### Epic 6: Rewards & Analytics
- **Token Distribution**: Automated vault share, governance token, impact NFT minting
- **Dashboard**: Whale vault management, retail performance tracking
- **Impact Reporting**: Student progress, yield efficiency, community stats

## Open Questions for User

1. **Whale Vault Limits**: Should whales create multiple vaults with different strategies, or one vault per whale?

2. **Minimum Vault Size**: What's the minimum viable vault (capital + participants)?

3. **Front-Running Prevention**: How do we prevent whales from front-running allocation votes?

4. **Token Decay Mechanism**: Should governance tokens decay by time or activity?

5. **Student Verification**: What verification is required before students can receive funding?

6. **Exit Strategy**: Should there be a lockup period for whales, or allow instant exit?

7. **Performance Bonuses**: Should whales earn bonuses for exceeding target APY, or just base allocation?

8. **Retail Minimums**: Is 100 USDC the right minimum for retail participation?

## Next Steps

- [ ] Review architecture document (`docs/architecture/whale-vaults.md`)
- [ ] Update Epic 2-6 tickets to reflect vault-centric design
- [ ] Begin smart contract design (VaultFactory, EndaomentVault)
- [ ] Create wireframes for vault marketplace
- [ ] Define quadratic funding parameters (matching pool, coefficients)
- [ ] Resolve open questions above

## Resources

- **Architecture Doc**: `docs/architecture/whale-vaults.md`
- **Related Epics**: Epic 2 (Miniapp), Epic 3 (Contracts), Epic 4 (Marketplace), Epic 5 (Allocation), Epic 6 (Rewards)
- **Technical References**: ERC-4626 standard, Octant V2, Gitcoin Grants, Aave/Morpho yield strategies

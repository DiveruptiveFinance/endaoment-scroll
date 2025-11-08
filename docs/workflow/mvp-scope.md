# MVP Scope - Hackathon Focus

**Goal**: Ship working demo with whale vaults + basic yield strategy in remaining time

## Core MVP Features

### 1. Whale Vault Creation (Simplified)
- **Landing page**: Choose role (whale/retail/student)
- **Whale flow**: 3-step wizard (not 6)
  - Step 1: Select Conservative strategy (auto-selected, no choice)
  - Step 2: Enter vault name + initial deposit (1000+ USDC)
  - Step 3: Confirm → Mock transaction (2s) → Success
- **Impact NFT**: Static SVG, basic metadata, displayed on success
- **No**: Fundraising goals, cover images, advanced config

### 2. Basic ERC-4626 Vault (No Octant Fork)
- **Contract**: Simple ERC-4626 implementation
- **Strategy**: Direct Aave USDC deposit (no rebalancing)
- **Yield**: Fetch Aave APY, calculate yield linearly
- **No**: Morpho, Compound, strategy switching, rebalancing

### 3. Retail Donor Flow
- **Marketplace**: Browse vaults (1 pre-created vault for demo)
- **Join vault**: Enter amount (10+ USDC) → Mock transaction → Receive shares
- **No**: Advanced filtering, multiple vaults, vault comparison

### 4. Allocation Voting (Existing Epic 1 Work)
- **Use existing** `/allocate` page with slider interface
- **Modification**: Weight votes by vault shares (not equal weight)
- **Distribution**: Mock quadratic funding calculation
- **No**: Real on-chain voting, complex QF math validation

### 5. Dashboard (Existing Epic 1 Work)
- **Extend existing** `/dashboard` with vault-specific stats
- **Add**: Vault membership card, yield earned per vault
- **No**: Advanced analytics, APY history charts

## Epic Restructure for MVP

### Epic 1: Frontend Prototype (CURRENT - Almost Done)
**Status**: 85% complete (5/7 tickets done)
**Remaining**:
- ✅ E1-T3: Student detail - DONE
- ✅ E1-T4: Donation flow - DONE (but needs vault integration)
- ✅ E1-T5: Allocation - DONE (but needs weighted voting)
- ✅ E1-T6: Dashboard - DONE (but needs vault stats)
- 🔲 E1-T7: Responsive polish - TODO

**Adjustments**:
- Keep allocation and dashboard as-is for now
- Will extend in Epic 5 for vault integration

### Epic 2: Vault UI (NEW - Replaces Miniapp Migration)
**Duration**: 2-3 days
**Goal**: Whale vault creation flow + retail marketplace

**Tickets**:
1. **E2-T1**: Role selection landing page (1-2h)
   - 3 role cards: Whale, Retail, Student
   - Route to appropriate flows

2. **E2-T2**: Whale vault creation wizard (4-5h)
   - Step 1: Strategy selection (Conservative auto-selected)
   - Step 2: Configure vault (name + deposit)
   - Step 3: Review & execute (mock transaction)
   - Success screen with Impact NFT display

3. **E2-T3**: Impact NFT generator (2-3h)
   - SVG template with dynamic data
   - Metadata JSON structure
   - Display component

4. **E2-T4**: Vault marketplace page (3-4h)
   - VaultCard component (similar to StudentCard)
   - List view of available vaults
   - Filter by strategy (future: disabled for MVP)

5. **E2-T5**: Vault detail page (3-4h)
   - Vault info + whale profile
   - Strategy details + current APY (mocked)
   - Participant list
   - "Join Vault" CTA

6. **E2-T6**: Retail join vault flow (2-3h)
   - Deposit amount input
   - Share calculation preview
   - Mock transaction
   - Success → Dashboard

7. **E2-T7**: Whale dashboard (3-4h)
   - Vault management view
   - Stats: capital, yield, participants
   - Invite link generation
   - Allocation voting access

**Total**: 18-25 hours (2-3 days)

### Epic 3: Basic ERC-4626 Contract (NEW - Replaces Epic 4)
**Duration**: 2-3 days
**Goal**: Deployable vault contract with Aave integration

**Tickets**:
1. **E3-T1**: ERC-4626 vault base contract (4-5h)
   - Inherit OpenZeppelin ERC4626
   - Deposit/withdraw functions
   - Share calculation
   - Basic tests

2. **E3-T2**: Aave strategy integration (4-5h)
   - Aave v3 Pool interface
   - Supply USDC to Aave
   - Fetch APY from Aave
   - Accrue yield calculations

3. **E3-T3**: Vault factory contract (3-4h)
   - Create new vault instances
   - Track all vaults
   - Strategy assignment

4. **E3-T4**: Impact NFT contract (2-3h)
   - ERC-721 for whale NFTs
   - Mint on vault creation
   - Static metadata

5. **E3-T5**: Deploy to Base Sepolia (2-3h)
   - Deploy all contracts
   - Verify on Basescan
   - Test deposits/withdrawals

6. **E3-T6**: Contract tests (3-4h)
   - Unit tests for vault
   - Integration tests with Aave
   - Edge case coverage

**Total**: 18-24 hours (2-3 days)

### Epic 4: Farcaster Miniapp (MOVED - Previously Epic 2)
**Duration**: 1-2 days
**Goal**: Make it work in Farcaster frames

**Tickets**:
1. **E4-T1**: Add MiniKit provider (1h)
   - Install @coinbase/onchainkit
   - Wrap app with provider
   - Test wallet connection

2. **E4-T2**: Miniapp manifest (1h)
   - Create miniapp.json
   - Configure Base network
   - Set app metadata

3. **E4-T3**: Test in Farcaster (2-3h)
   - Deploy preview build
   - Test in Farcaster desktop/mobile
   - Fix any frame issues

4. **E4-T4**: Social sharing frames (2-3h)
   - Create vault share frame
   - Create donation share frame
   - Test frame rendering

**Total**: 6-8 hours (1-2 days)

### Epic 5: Contract Integration (UPDATED)
**Duration**: 2-3 days
**Goal**: Connect frontend to real contracts

**Tickets**:
1. **E5-T1**: Wallet connection (wagmi) (2-3h)
   - Replace mock wallet with real
   - Connect to Base Sepolia
   - Handle network switching

2. **E5-T2**: Vault creation transactions (3-4h)
   - Real USDC approve
   - Real vault deposit
   - Transaction status tracking
   - Error handling

3. **E5-T3**: Retail join transactions (2-3h)
   - Real deposit flow
   - Share receipt
   - Update UI with real balances

4. **E5-T4**: Read vault state (2-3h)
   - Fetch vault data from contract
   - Display real APY from Aave
   - Show real participant counts

5. **E5-T5**: Dashboard integration (2-3h)
   - Fetch user's vault memberships
   - Calculate real yield earned
   - Display real allocation history

6. **E5-T6**: Update allocation voting (3-4h)
   - Weight votes by vault shares
   - Implement quadratic funding (simple version)
   - Submit allocation on-chain

**Total**: 14-20 hours (2-3 days)

### Epic 6: Polish & Launch (SAME)
**Duration**: 1-2 days
**Goal**: Demo-ready, deployed, submitted

**Tickets**:
1. E6-T1: Bug fixes and edge cases (3-4h)
2. E6-T2: Mobile responsive final pass (2-3h)
3. E6-T3: Production deployment (2h)
4. E6-T4: Demo video recording (2h)
5. E6-T5: Hackathon submission (1h)

**Total**: 10-12 hours (1-2 days)

## New Timeline (10-12 days)

| Day | Epic | Focus |
|-----|------|-------|
| 1-2 | Epic 1 | ✅ Frontend prototype (almost done) |
| 3-5 | Epic 2 | Vault UI (whale + retail flows) |
| 6-8 | Epic 3 | Smart contracts (ERC-4626 + Aave) |
| 8-9 | Epic 4 | Farcaster miniapp integration |
| 10-12 | Epic 5 | Contract integration (replace mocks) |
| 13-14 | Epic 6 | Polish & launch |

**Total**: 14 days realistic, 10 days aggressive

## What We're Cutting

### Removed Features
- ❌ Multiple yield strategies (Balanced, Aggressive)
- ❌ Strategy rebalancing and switching
- ❌ Morpho, Compound, Yearn integrations
- ❌ Governance tokens (soulbound rewards)
- ❌ Dynamic Impact NFTs
- ❌ Vault editing after creation
- ❌ Fundraising goals and deadlines
- ❌ Advanced vault parameters
- ❌ Complex quadratic funding validation
- ❌ Real-time APY updates
- ❌ Historical performance charts
- ❌ Rebalancing event timelines
- ❌ Student onboarding flow

### Simplified to MVP
- ✂️ Vault creation: 6 steps → 3 steps
- ✂️ Strategies: 3 options → 1 (Conservative only)
- ✂️ NFT: Dynamic → Static SVG
- ✂️ Allocation: Complex QF → Simple weighted voting
- ✂️ Yield: Multiple protocols → Aave only
- ✂️ Dashboard: Advanced analytics → Basic stats

### Keeping Essential
- ✅ Whale vault creation with deposits
- ✅ Retail joins vaults with real shares
- ✅ Basic ERC-4626 standard
- ✅ Aave yield generation
- ✅ Allocation voting with weights
- ✅ Impact NFT (static)
- ✅ Farcaster miniapp
- ✅ Base chain deployment
- ✅ Student funding distribution

## Success Criteria (MVP)

### Must Have
- [ ] Whale can create vault with 1000 USDC
- [ ] Retail can join vault with 10 USDC
- [ ] Vaults accumulate yield from Aave
- [ ] Users can vote on student allocation
- [ ] Votes weighted by vault shares
- [ ] Impact NFT minted on vault creation
- [ ] Works in Farcaster frame
- [ ] Deployed on Base Sepolia
- [ ] Demo-able end-to-end flow

### Nice to Have (If Time)
- [ ] Multiple vaults in marketplace
- [ ] Whale can invite retail via link
- [ ] Share vault on Farcaster
- [ ] Mobile fully polished
- [ ] APY displayed from real Aave data

### Excluded (Post-Hackathon)
- Multiple strategies
- Dynamic NFTs
- Governance tokens
- Complex QF math
- Student onboarding
- Vault editing
- Historical analytics

## Implementation Priority

### Week 1 (Current)
1. ✅ Complete Epic 1 remaining tickets (1 day)
2. Build vault UI (Epic 2) (2-3 days)

### Week 2
3. Deploy contracts (Epic 3) (2-3 days)
4. Add Farcaster support (Epic 4) (1-2 days)
5. Integrate contracts (Epic 5) (2-3 days)

### Final Push
6. Polish and launch (Epic 6) (1-2 days)
7. Buffer for bugs and demo prep (1 day)

## Next Immediate Actions

1. **Finish Epic 1** (E1-T7 responsive polish)
2. **Update epic files** to reflect new structure
3. **Start Epic 2** with role selection page
4. **Prepare contract architecture** for Epic 3

## Files to Update

- [ ] `docs/workflow/entry.md` - Update epic overview table
- [ ] `docs/workflow/epic-2-*.md` - Rename and restructure
- [ ] `docs/workflow/epic-3-*.md` - New contract epic
- [ ] `docs/workflow/epic-4-*.md` - Move Farcaster here
- [ ] `docs/workflow/epic-5-*.md` - Update integration scope
- [ ] Create new detailed tickets for Epic 2 and Epic 3

// App constants and configuration

// Contract addresses (placeholder for now, will be updated after deployment)
export const CONTRACTS = {
  ENDAOMENT_VAULT: "0x0000000000000000000000000000000000000000", // MultistrategyVault
  ALLOCATION_MECHANISM: "0x0000000000000000000000000000000000000000", // AllocationMechanism
  BENEFICIARY_REGISTRY: "0x0000000000000000000000000000000000000000", // BeneficiaryRegistry
  YIELD_DISTRIBUTOR: "0x0000000000000000000000000000000000000000", // YieldDistributor
} as const;

// Supported tokens
export const TOKENS = {
  USDC: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  ETH: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Native ETH
    symbol: "ETH",
    decimals: 18,
    name: "Ethereum",
  },
  MXNe: {
    address: "0x0000000000000000000000000000000000000000", // MXNe placeholder
    symbol: "MXNe",
    decimals: 18,
    name: "MXNe",
  },
  BRL1: {
    address: "0x0000000000000000000000000000000000000000", // BRL1 placeholder
    symbol: "BRL1",
    decimals: 18,
    name: "BRL1",
  },
} as const;

// Epoch configuration
export const EPOCH_CONFIG = {
  DURATION_DAYS: 30,
  VOTING_WINDOW_DAYS: 7,
} as const;

// Current epoch (mock data for frontend demo)
export const CURRENT_EPOCH = {
  id: 5,
  startDate: new Date("2025-01-01"),
  endDate: new Date("2025-01-31"),
  votingEndDate: new Date("2025-01-08"),
  totalYield: 12500, // USD
  isActive: true,
  isVotingOpen: true,
} as const;

// App metadata for Farcaster Miniapp manifest
export const APP_METADATA = {
  name: "Endaoment",
  shortName: "Endaoment",
  description: "Fund students through DeFi yield. The future of educational endowments.",
  tagline: "Transform donations into perpetual scholarships",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://endaoment.app",
  iconUrl: "/icon.png",
  splashImageUrl: "/splash.png",
  splashBackgroundColor: "#1a1a2e",
  primaryCategory: "finance",
  tags: ["education", "defi", "impact", "scholarships", "yield"],
  ogImageUrl: "/og-image.png",
} as const;

// Feature flags for progressive development
export const FEATURES = {
  ENABLE_DONATIONS: true, // Core donation flow
  ENABLE_ALLOCATION: true, // Epoch voting/allocation
  ENABLE_CLAIMS: false, // Student claiming (future)
  ENABLE_FARCASTER_FRAMES: true, // Social sharing frames
  ENABLE_NOTIFICATIONS: false, // Push notifications (future)
  SHOW_YIELD_BREAKDOWN: true, // Show yield from different strategies
  MOCK_WALLET_BALANCE: true, // Mock wallet data for demo without real funds
} as const;

// UI Configuration
export const UI_CONFIG = {
  STUDENTS_PER_PAGE: 8,
  MIN_DONATION_USD: 1,
  DEFAULT_DONATION_AMOUNTS: [25, 50, 100, 250],
  PROGRESS_BAR_COLORS: {
    low: "#ef4444", // red-500 - less than 25%
    medium: "#f59e0b", // amber-500 - 25-75%
    high: "#10b981", // green-500 - more than 75%
  },
  CATEGORY_COLORS: {
    undergraduate: "#3b82f6", // blue-500
    masters: "#8b5cf6", // violet-500
    phd: "#ec4899", // pink-500
    postdoc: "#14b8a6", // teal-500
    research: "#f59e0b", // amber-500
  },
} as const;

// Social/Sharing templates
export const SHARE_TEMPLATES = {
  DONATED: (amount: number, studentName: string) =>
    `I just donated $${amount} to support ${studentName}'s education through @Endaoment! 🎓✨\n\nTheir donation earns DeFi yield → funds students forever.\n\nJoin me:`,
  ALLOCATED: (yieldAmount: number, studentCount: number) =>
    `I just allocated $${yieldAmount} in yield to ${studentCount} students through @Endaoment! 🚀\n\nMy donations keep giving. Check it out:`,
  MILESTONE: (totalDonated: number) =>
    `🎉 Milestone! I've now donated $${totalDonated} to educational impact through @Endaoment.\n\nDeFi yield → perpetual scholarships. It's the future of giving:`,
} as const;

// Mock donation history for demo
export const MOCK_DONATION_HISTORY = [
  { id: "1", studentId: "1", amount: 100, timestamp: new Date("2024-12-15"), txHash: "0xabc123..." },
  { id: "2", studentId: "3", amount: 50, timestamp: new Date("2024-12-20"), txHash: "0xdef456..." },
  { id: "3", studentId: "2", amount: 75, timestamp: new Date("2025-01-02"), txHash: "0xghi789..." },
] as const;

// Impact statistics (mock for demo)
export const PLATFORM_STATS = {
  totalDonated: 45678,
  totalYieldGenerated: 3421,
  studentsSupported: 8,
  activeDonors: 127,
  currentEpoch: 5,
} as const;

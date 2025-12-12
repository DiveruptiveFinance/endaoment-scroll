import { formatUnits, parseUnits } from "viem";

/**
 * USDC has 6 decimals
 */
export const USDC_DECIMALS = 6;

/**
 * Fixed APY for MVP: 10% annual
 */
export const FIXED_APY = 0.1; // 10%

/**
 * Parse USDC amount from string to bigint
 * @param amount Amount as string (e.g., "1000.50")
 * @returns Amount as bigint with 6 decimals
 */
export function parseUSDC(amount: string): bigint {
  return parseUnits(amount, USDC_DECIMALS);
}

/**
 * Format USDC amount from bigint to string with 2 decimals
 * @param amount Amount as bigint
 * @returns Formatted string with 2 decimals (e.g., "1000.50")
 */
export function formatUSDC(amount: bigint | undefined | null): string {
  if (!amount) return "0.00";
  const formatted = formatUnits(amount, USDC_DECIMALS);
  return parseFloat(formatted).toFixed(2);
}

/**
 * Format USDC amount with thousands separator
 * @param amount Amount as bigint
 * @returns Formatted string with commas and 2 decimals (e.g., "1,000.50")
 */
export function formatUSDCWithCommas(amount: bigint | undefined | null): string {
  if (!amount) return "0.00";
  const formatted = formatUSDC(amount);
  return parseFloat(formatted).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculate yield projection
 * @param principal Principal amount in USDC
 * @param apy APY as decimal (default 0.10 for 10%)
 * @param days Number of days
 * @returns Yield amount in USDC
 */
export function calculateYield(principal: number, days: number, apy: number = FIXED_APY): number {
  return principal * apy * (days / 365);
}

/**
 * Calculate yield projections for different periods
 * @param principal Principal amount in USDC
 * @param apy APY as decimal (default 0.10 for 10%)
 * @returns Object with projections for daily, weekly, monthly, quarterly, and yearly
 */
export function calculateProjections(principal: number, apy: number = FIXED_APY) {
  return {
    daily: {
      yield: calculateYield(principal, 1, apy),
      total: principal + calculateYield(principal, 1, apy),
      period: "Daily",
      days: 1,
    },
    weekly: {
      yield: calculateYield(principal, 7, apy),
      total: principal + calculateYield(principal, 7, apy),
      period: "Weekly",
      days: 7,
    },
    monthly: {
      yield: calculateYield(principal, 30, apy),
      total: principal + calculateYield(principal, 30, apy),
      period: "Monthly",
      days: 30,
    },
    quarterly: {
      yield: calculateYield(principal, 90, apy),
      total: principal + calculateYield(principal, 90, apy),
      period: "Quarterly",
      days: 90,
    },
    yearly: {
      yield: calculateYield(principal, 365, apy),
      total: principal + calculateYield(principal, 365, apy),
      period: "Yearly",
      days: 365,
    },
  };
}

/**
 * Calculate voting power based on achievements
 * @param academicAchievements Number of academic achievements (0-10)
 * @param sportsAchievements Number of sports achievements (0-10)
 * @param studentAchievements Number of student achievements (0-10)
 * @returns Voting power (base 1 + bonuses, max 4)
 */
export function calculateVotingPower(
  academicAchievements: number,
  sportsAchievements: number,
  studentAchievements: number,
): number {
  const base = 1; // Base vote if has SBT
  const academicBonus = academicAchievements * 0.1;
  const sportsBonus = sportsAchievements * 0.1;
  const studentBonus = studentAchievements * 0.1;

  const total = base + academicBonus + sportsBonus + studentBonus;
  return Math.min(total, 4); // Max 4 votes
}

/**
 * Validate donation amount (off-chain validation)
 * @param amount Amount to donate
 * @param balance Available balance
 * @returns Object with isValid and error message
 */
export function validateDonation(amount: bigint, balance: bigint): { isValid: boolean; error?: string } {
  if (amount <= 0n) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }

  if (amount > balance) {
    return { isValid: false, error: "Insufficient balance" };
  }

  // Minimum donation: $10 USDC
  const minimumDonation = parseUSDC("10");
  if (amount < minimumDonation) {
    return { isValid: false, error: "Minimum donation is $10 USDC" };
  }

  return { isValid: true };
}

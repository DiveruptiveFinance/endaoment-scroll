import { Vault, VaultMembership } from "~~/types/vault";

export const MOCK_VAULT: Vault = {
  id: "vault-1",
  name: "Education Fund",
  whaleAddress: "0xWhale123",
  whaleName: "Alice",
  totalCapital: 5000,
  currentAPY: 5.0,
  participantCount: 12,
  createdAt: new Date("2025-10-01"),
};

export const MOCK_MEMBERSHIP: VaultMembership = {
  vaultId: "vault-1",
  userAddress: "0xUser456",
  shares: 50,
  depositAmount: 50,
  yieldEarned: 0.25,
};

/**
 * Get user's vault membership
 */
export function getUserVaultMembership(userAddress: string): VaultMembership | null {
  // Mock: return membership if address matches
  return userAddress === MOCK_MEMBERSHIP.userAddress ? MOCK_MEMBERSHIP : null;
}

/**
 * Get all available vaults
 */
export function getAllVaults(): Vault[] {
  return [MOCK_VAULT];
}

/**
 * Get vault by ID
 */
export function getVaultById(id: string): Vault | null {
  return id === MOCK_VAULT.id ? MOCK_VAULT : null;
}

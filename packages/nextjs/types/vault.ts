export interface Vault {
  id: string;
  name: string;
  whaleAddress: string;
  whaleName: string;
  totalCapital: number;
  currentAPY: number;
  participantCount: number;
  createdAt: Date;
}

export interface VaultMembership {
  vaultId: string;
  userAddress: string;
  shares: number;
  depositAmount: number;
  yieldEarned: number;
}

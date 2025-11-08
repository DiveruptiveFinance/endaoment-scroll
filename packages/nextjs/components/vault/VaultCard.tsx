"use client";

import { useState } from "react";
import { PrimaryButton } from "../ui/PrimaryButton";
import { JoinVaultModal } from "./JoinVaultModal";
import { Box, TrendingUp, Users } from "lucide-react";
import { formatUnits } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Vault } from "~~/types/vault";

interface VaultCardProps {
  vault: Vault;
}

export function VaultCard({ vault }: VaultCardProps) {
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Read real vault data from contract
  const { data: vaultStats } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "getVaultStats",
  });

  const { data: whaleAddress } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "whale",
  });

  const { data: vaultName } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "vaultName",
  });

  // Calculate values from contract data
  const totalCapital = vaultStats ? Number(formatUnits(vaultStats[0], 6)) : vault.totalCapital;
  const participantCount = vaultStats ? Number(vaultStats[3]) : vault.participantCount;
  const displayName = vaultName || vault.name;
  const displayWhale = whaleAddress ? `${whaleAddress.slice(0, 6)}...${whaleAddress.slice(-4)}` : vault.whaleAddress;

  return (
    <>
      <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#0052FF]/10 flex items-center justify-center flex-shrink-0">
            <Box className="w-5 h-5 text-[#0052FF]" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h3 className="text-[20px] font-bold text-[#0052FF] mb-1">{displayName}</h3>
            <p className="text-[13px] text-[#1A1A1A]/70">by {displayWhale}</p>
          </div>
        </div>

        {/* Strategy */}
        <p className="text-[16px] text-[#1A1A1A]/70 mb-4">{vault.strategy}</p>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-[16px] text-[#1A1A1A]">
            <TrendingUp className="w-4 h-4 text-[#0052FF]" strokeWidth={2} />
            <span className="font-semibold">{vault.currentAPY}% APY</span>
          </div>
          <div className="flex items-center gap-2 text-[16px] text-[#1A1A1A]">
            <Users className="w-4 h-4 text-[#1A1A1A]/70" strokeWidth={2} />
            <span className="text-[#1A1A1A]/70">{participantCount} donors</span>
          </div>
        </div>

        {/* TVL */}
        <div className="mb-6 pb-6 border-b border-[#F2F4F7]">
          <div className="text-[13px] text-[#1A1A1A]/70 mb-1">Total Value Locked</div>
          <div className="text-[28px] font-bold text-[#0A0F1C]">${totalCapital.toLocaleString()}</div>
        </div>

        {/* CTA Button */}
        <PrimaryButton variant="primary" size="md" className="w-full" onClick={() => setShowJoinModal(true)}>
          Join Vault
        </PrimaryButton>
      </div>

      {showJoinModal && <JoinVaultModal vault={vault} onClose={() => setShowJoinModal(false)} />}
    </>
  );
}

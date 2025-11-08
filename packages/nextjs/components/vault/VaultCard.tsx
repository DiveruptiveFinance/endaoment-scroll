"use client";

import { useState } from "react";
import { JoinVaultModal } from "./JoinVaultModal";
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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">🐋 {displayName}</h2>
          <p className="text-sm text-base-content/70">by {displayWhale}</p>

          <div className="flex gap-2 my-2">
            <span className="badge badge-lg">🛡️ Conservative</span>
            <span className="badge badge-success badge-lg">{vault.currentAPY}% APY</span>
          </div>

          <div className="stats stats-vertical shadow mt-4">
            <div className="stat">
              <div className="stat-title">Pooled Capital</div>
              <div className="stat-value text-2xl">${totalCapital.toLocaleString()}</div>
              <div className="stat-desc">Combined from all donors</div>
            </div>
            <div className="stat">
              <div className="stat-title">Donors</div>
              <div className="stat-value text-2xl">{participantCount}</div>
              <div className="stat-desc">Active participants</div>
            </div>
          </div>

          <button className="btn btn-primary btn-lg btn-block mt-4" onClick={() => setShowJoinModal(true)}>
            Join Vault →
          </button>
        </div>
      </div>

      {showJoinModal && <JoinVaultModal vault={vault} onClose={() => setShowJoinModal(false)} />}
    </>
  );
}

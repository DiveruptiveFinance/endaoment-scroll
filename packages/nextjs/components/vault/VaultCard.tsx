"use client";

import { useState } from "react";
import { JoinVaultModal } from "./JoinVaultModal";
import { Vault } from "~~/types/vault";

interface VaultCardProps {
  vault: Vault;
}

export function VaultCard({ vault }: VaultCardProps) {
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">🐋 {vault.name}</h2>
          <p className="text-sm text-base-content/70">
            by {vault.whaleName} ({vault.whaleAddress})
          </p>

          <div className="flex gap-2 my-2">
            <span className="badge badge-lg">🛡️ Conservative</span>
            <span className="badge badge-success badge-lg">{vault.currentAPY}% APY</span>
          </div>

          <div className="stats stats-vertical shadow mt-4">
            <div className="stat">
              <div className="stat-title">Pooled Capital</div>
              <div className="stat-value text-2xl">${vault.totalCapital.toLocaleString()}</div>
              <div className="stat-desc">Combined from all donors</div>
            </div>
            <div className="stat">
              <div className="stat-title">Donors</div>
              <div className="stat-value text-2xl">{vault.participantCount}</div>
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

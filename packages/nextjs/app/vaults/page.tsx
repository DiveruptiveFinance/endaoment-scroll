"use client";

import { VaultCard } from "~~/components/vault/VaultCard";
import { getAllVaults } from "~~/data/mockVaults";

export default function VaultsPage() {
  const vaults = getAllVaults();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Available Vaults</h1>
        <p className="text-base-content/70">
          Join a vault to pool capital and amplify your impact through shared yield allocation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaults.map(vault => (
          <VaultCard key={vault.id} vault={vault} />
        ))}
      </div>

      {vaults.length === 0 && (
        <div className="alert alert-info">
          <span>No vaults available yet. Be the first to create one!</span>
        </div>
      )}
    </div>
  );
}

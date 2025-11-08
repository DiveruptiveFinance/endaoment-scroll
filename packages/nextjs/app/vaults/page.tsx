"use client";

import { VaultCard } from "~~/components/vault/VaultCard";
import { getAllVaults } from "~~/data/mockVaults";

export default function VaultsPage() {
  const vaults = getAllVaults();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-4">Available Vaults</h1>
          <p className="text-[16px] text-[#1A1A1A]/70 max-w-2xl">
            Join a vault to pool capital and amplify your impact through shared yield allocation
          </p>
        </div>

        {/* Vaults Grid */}
        {vaults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaults.map(vault => (
              <VaultCard key={vault.id} vault={vault} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <p className="text-[16px] text-[#1A1A1A]/70">No vaults available yet. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { formatUSDCWithCommas, parseUSDC } from "~~/utils/format";
import { TransactionState, getTransactionMessage, isLoadingState } from "~~/utils/transactionStates";

export default function AdminYieldPage() {
  const { address } = useAccount();
  const [yieldAmount, setYieldAmount] = useState<string>("1000");
  const [txState, setTxState] = useState<TransactionState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Read MockAavePool info
  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "MockAavePool",
    functionName: "totalSupply",
  });

  const { data: availableYield } = useScaffoldReadContract({
    contractName: "MockAavePool",
    functionName: "getAvailableYield",
  });

  const { data: totalAssets } = useScaffoldReadContract({
    contractName: "MockAavePool",
    functionName: "getTotalAssets",
  });

  const { writeContractAsync: addYield } = useScaffoldWriteContract("MockAavePool");
  const { writeContractAsync: harvestYield } = useScaffoldWriteContract("LosslessVault");

  const handleAddYield = async () => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    const amountBigInt = parseUSDC(yieldAmount);
    if (amountBigInt <= 0n) {
      setError("Amount must be greater than 0");
      return;
    }

    setError(null);
    setTxState("depositing");

    try {
      await addYield({
        functionName: "adminAddYield",
        args: [amountBigInt],
      });

      setTxState("success");
      setTimeout(() => setTxState("idle"), 2000);
    } catch (err: any) {
      console.error("Add yield failed:", err);
      setError(err.message || "Transaction failed");
      setTxState("error");
    }
  };

  const handleHarvestYield = async () => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    setError(null);
    setTxState("harvesting");

    try {
      await harvestYield({
        functionName: "harvestYield",
      });

      setTxState("success");
      setTimeout(() => setTxState("idle"), 2000);
    } catch (err: any) {
      console.error("Harvest yield failed:", err);
      setError(err.message || "Transaction failed");
      setTxState("error");
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Admin Panel</h2>
            <p className="text-[16px] text-[#1A1A1A]/70">Please connect your wallet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-8">Yield Management (Admin)</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Total Supply (Principal)</div>
            <div className="text-[24px] font-bold text-[#0A0F1C]">${formatUSDCWithCommas(totalSupply || 0n)}</div>
          </div>
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Available Yield</div>
            <div className="text-[24px] font-bold text-[#5CE27F]">${formatUSDCWithCommas(availableYield || 0n)}</div>
          </div>
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Total Assets</div>
            <div className="text-[24px] font-bold text-[#0052FF]">${formatUSDCWithCommas(totalAssets || 0n)}</div>
          </div>
        </div>

        {/* Add Yield */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
          <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Simulate Yield Generation</h2>
          <p className="text-[14px] text-[#1A1A1A]/70 mb-4">
            Add yield to MockAavePool for demo purposes. This simulates profit generation.
          </p>
          <div className="flex gap-4">
            <input
              type="number"
              value={yieldAmount}
              onChange={e => setYieldAmount(e.target.value)}
              placeholder="1000"
              className="flex-1 px-4 py-3 rounded-[6px] border border-[#F2F4F7] focus:border-[#0052FF] focus:outline-none"
            />
            <PrimaryButton onClick={handleAddYield} disabled={isLoadingState(txState)}>
              Add Yield
            </PrimaryButton>
          </div>
        </div>

        {/* Harvest Yield */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
          <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Harvest & Split Yield</h2>
          <p className="text-[14px] text-[#1A1A1A]/70 mb-4">
            Harvest available yield from MockAavePool and split it 50/50 between University and DAO.
          </p>
          <PrimaryButton
            onClick={handleHarvestYield}
            disabled={isLoadingState(txState) || (availableYield || 0n) === 0n}
          >
            {isLoadingState(txState) ? getTransactionMessage(txState) : "Harvest & Split Yield"}
          </PrimaryButton>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#FF5B5B]/10 border border-[#FF5B5B] rounded-[6px] p-4">
            <p className="text-[14px] text-[#FF5B5B]">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoadingState(txState) && (
          <div className="bg-[#0052FF]/10 border border-[#0052FF] rounded-[6px] p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0052FF] mx-auto mb-2"></div>
            <p className="text-[14px] text-[#0052FF]">{getTransactionMessage(txState)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

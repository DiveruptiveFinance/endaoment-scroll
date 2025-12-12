"use client";

import { useState } from "react";
import { Droplet } from "lucide-react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TransactionState, getTransactionMessage, isLoadingState } from "~~/utils/transactionStates";

export function FloatingFaucetButton() {
  const { address, isConnected } = useAccount();
  const [txState, setTxState] = useState<TransactionState>("idle");
  const { writeContractAsync: faucet } = useScaffoldWriteContract("MockUSDC");

  const handleFaucet = async () => {
    if (!isConnected || !address) {
      return;
    }

    setTxState("depositing");
    try {
      await faucet({
        functionName: "faucet",
      });
      setTxState("success");
      setTimeout(() => setTxState("idle"), 2000);
    } catch (error: any) {
      console.error("Faucet failed:", error);
      setTxState("error");
      setTimeout(() => setTxState("idle"), 3000);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <button
      onClick={handleFaucet}
      disabled={isLoadingState(txState)}
      className="fixed bottom-6 left-6 z-50 bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Get 10,000 USDC from faucet"
    >
      <Droplet className="w-5 h-5" />
      {isLoadingState(txState) ? (
        <span className="text-[14px] font-semibold">{getTransactionMessage(txState)}</span>
      ) : txState === "success" ? (
        <span className="text-[14px] font-semibold">✓ Got USDC!</span>
      ) : (
        <span className="text-[14px] font-semibold">Faucet</span>
      )}
    </button>
  );
}

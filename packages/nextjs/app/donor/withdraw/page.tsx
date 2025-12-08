"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { formatUSDCWithCommas, parseUSDC, validateDonation } from "~~/utils/format";
import { TransactionState, getTransactionMessage, isLoadingState } from "~~/utils/transactionStates";

export default function WithdrawPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [amount, setAmount] = useState<string>("");
  const [txState, setTxState] = useState<TransactionState>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read user's shares
  const { data: userShares } = useScaffoldReadContract({
    contractName: "LosslessVault",
    functionName: "balanceOf",
    args: [address],
  });

  // Read assets (principal)
  const { data: userAssets } = useScaffoldReadContract({
    contractName: "LosslessVault",
    functionName: "convertToAssets",
    args: [userShares || 0n],
  });

  const { writeContractAsync: withdrawFromVault } = useScaffoldWriteContract("LosslessVault");

  const availablePrincipal = userAssets || 0n;
  const formattedPrincipal = formatUSDCWithCommas(availablePrincipal);

  const handleWithdraw = async () => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    const amountBigInt = amount ? parseUSDC(amount) : availablePrincipal;

    // Validate
    const validation = validateDonation(amountBigInt, availablePrincipal);
    if (!validation.isValid) {
      setError(validation.error || "Invalid withdrawal amount");
      return;
    }

    setError(null);
    setTxState("withdrawing");

    try {
      const tx = await withdrawFromVault({
        functionName: "withdraw",
        args: [amountBigInt, address, address], // assets, receiver, owner
      });

      setTxHash(tx || null);
      setTxState("success");

      setTimeout(() => {
        router.push("/donor/dashboard");
      }, 3000);
    } catch (err: any) {
      console.error("Withdrawal failed:", err);
      setError(err.message || "Transaction failed");
      setTxState("error");
    }
  };

  if (txState === "success" && txHash) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Withdrawal Successful!</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              You withdrew ${amount || formatUSDCWithCommas(availablePrincipal)} USDC
            </p>
            <a
              href={`https://sepolia.scrollscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0052FF] hover:text-[#0040CC] transition-colors"
            >
              View on Scroll Sepolia Scanner →
            </a>
            <p className="text-[14px] text-[#1A1A1A]/50 mt-4">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-8">Withdraw Principal</h1>

        {/* Available Principal */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
          <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Available Principal</div>
          <div className="text-[32px] font-bold text-[#0A0F1C]">${formattedPrincipal} USDC</div>
          <div className="text-[12px] text-[#1A1A1A]/60 mt-1">Your principal is always safe</div>
        </div>

        {/* Amount Input */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
          <label className="block text-[14px] font-semibold text-[#0A0F1C] mb-2">Withdrawal Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder={formattedPrincipal}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] focus:border-[#0052FF] focus:outline-none mb-4"
          />
          <button
            onClick={() => setAmount(formatUSDCWithCommas(availablePrincipal).replace(/,/g, ""))}
            className="text-[14px] text-[#0052FF] hover:text-[#0040CC] transition-colors"
          >
            Withdraw All
          </button>
        </div>

        {/* Info */}
        <div className="bg-[#F2F4F7] rounded-[6px] p-4 mb-6">
          <p className="text-[14px] text-[#1A1A1A]/70">
            💡 You can withdraw your principal at any time. Only the yield is donated to education.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#FF5B5B]/10 border border-[#FF5B5B] rounded-[6px] p-4 mb-6">
            <p className="text-[14px] text-[#FF5B5B]">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoadingState(txState) && (
          <div className="bg-[#0052FF]/10 border border-[#0052FF] rounded-[6px] p-4 mb-6 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0052FF] mx-auto mb-2"></div>
            <p className="text-[14px] text-[#0052FF]">{getTransactionMessage(txState)}</p>
          </div>
        )}

        {/* Withdraw Button */}
        <PrimaryButton
          size="lg"
          className="w-full"
          onClick={handleWithdraw}
          disabled={isLoadingState(txState) || !address || availablePrincipal === 0n}
        >
          {!address
            ? "Connect Wallet"
            : availablePrincipal === 0n
              ? "No Principal to Withdraw"
              : isLoadingState(txState)
                ? getTransactionMessage(txState)
                : `Withdraw $${amount || formattedPrincipal} USDC`}
        </PrimaryButton>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { getUniversityById } from "~~/data/universities";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { formatUSDC, formatUSDCWithCommas, parseUSDC, validateDonation } from "~~/utils/format";
import { TransactionState, getTransactionMessage, isLoadingState } from "~~/utils/transactionStates";

export const dynamic = "force-dynamic";

export default function DonatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const universityId = searchParams.get("university");

  const [amount, setAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [txState, setTxState] = useState<TransactionState>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const university = universityId ? getUniversityById(universityId) : null;

  // Read USDC balance
  const { data: usdcBalance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "balanceOf",
    args: [address],
  });

  // Read LosslessVault address
  const { data: vaultInfo } = useScaffoldReadContract({
    contractName: "LosslessVault",
    functionName: "asset",
  });

  // Read current allowance
  const { data: currentAllowance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "allowance",
    args: [address, vaultInfo],
  });

  const { writeContractAsync: approveUSDC } = useScaffoldWriteContract("MockUSDC");
  const { writeContractAsync: depositToVault } = useScaffoldWriteContract("LosslessVault");

  const balance = usdcBalance || 0n;
  const formattedBalance = formatUSDCWithCommas(balance);

  const quickAmounts = [10000, 50000, 100000];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setAmount("");
  };

  const selectedAmount = amount ? parseFloat(amount) : customAmount ? parseFloat(customAmount) : 0;
  const amountBigInt = selectedAmount > 0 ? parseUSDC(selectedAmount.toString()) : 0n;
  const needsApproval = currentAllowance ? currentAllowance < amountBigInt : true;

  const handleDonate = async () => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    // Off-chain validation
    const validation = validateDonation(amountBigInt, balance);
    if (!validation.isValid) {
      setError(validation.error || "Invalid donation amount");
      return;
    }

    setError(null);
    setTxState("checking-allowance");

    try {
      // Step 1: Approve if needed
      if (needsApproval) {
        setTxState("approving");
        await approveUSDC({
          functionName: "approve",
          args: [vaultInfo, amountBigInt],
        });
      }

      // Step 2: Deposit to LosslessVault
      setTxState("depositing");
      const tx = await depositToVault({
        functionName: "deposit",
        args: [amountBigInt, address],
      });

      setTxHash(tx);
      setTxState("success");

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/donor/dashboard");
      }, 3000);
    } catch (err: any) {
      console.error("Donation failed:", err);
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
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Donation Successful!</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              You donated ${selectedAmount.toLocaleString()} USDC to {university?.shortName || "the vault"}
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-4">Make a Donation</h1>
          {university && (
            <p className="text-[16px] text-[#1A1A1A]/70">
              Funding: <span className="font-semibold">{university.shortName}</span>
            </p>
          )}
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
          <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Available Balance</div>
          <div className="text-[32px] font-bold text-[#0A0F1C]">${formattedBalance} USDC</div>
        </div>

        {/* Amount Selection */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
          <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Select Amount</h2>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {quickAmounts.map(value => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className={`px-4 py-3 rounded-[6px] border-2 transition-all ${
                  amount === value.toString()
                    ? "border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF] font-semibold"
                    : "border-[#F2F4F7] hover:border-[#0052FF]/50"
                }`}
              >
                ${value.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="block text-[14px] font-semibold text-[#0A0F1C] mb-2">Or enter custom amount</label>
            <input
              type="number"
              value={customAmount}
              onChange={e => handleCustomAmount(e.target.value)}
              placeholder="0.00"
              min="10"
              step="0.01"
              className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] focus:border-[#0052FF] focus:outline-none"
            />
            {selectedAmount > 0 && (
              <p className="text-[14px] text-[#1A1A1A]/70 mt-2">
                You will donate: <span className="font-semibold">${selectedAmount.toLocaleString()} USDC</span>
              </p>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-[#F2F4F7] rounded-[6px] p-4 mb-6">
          <p className="text-[14px] text-[#1A1A1A]/70">
            💡 <strong>Lossless Donation:</strong> Your principal stays safe. Only the yield (10% APY) is donated to
            education.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#FF5B5B]/10 border border-[#FF5B5B] rounded-[6px] p-4 mb-6">
            <p className="text-[14px] text-[#FF5B5B]">{error}</p>
          </div>
        )}

        {/* Transaction Status */}
        {isLoadingState(txState) && (
          <div className="bg-[#0052FF]/10 border border-[#0052FF] rounded-[6px] p-4 mb-6 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0052FF] mx-auto mb-2"></div>
            <p className="text-[14px] text-[#0052FF]">{getTransactionMessage(txState)}</p>
          </div>
        )}

        {/* Donate Button */}
        <PrimaryButton
          size="lg"
          className="w-full"
          onClick={handleDonate}
          disabled={isLoadingState(txState) || selectedAmount < 10 || !address}
        >
          {!address
            ? "Connect Wallet"
            : isLoadingState(txState)
              ? getTransactionMessage(txState)
              : `Donate $${selectedAmount > 0 ? selectedAmount.toLocaleString() : "0"} USDC`}
        </PrimaryButton>

        {!address && (
          <p className="text-[14px] text-[#1A1A1A]/70 text-center mt-4">Please connect your wallet to donate</p>
        )}
      </div>
    </div>
  );
}

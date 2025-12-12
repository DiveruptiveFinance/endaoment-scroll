"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { getUniversityById } from "~~/data/universities";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { formatUSDCWithCommas, parseUSDC, validateDonation } from "~~/utils/format";
import { TransactionState, getTransactionMessage, isLoadingState } from "~~/utils/transactionStates";

export const dynamic = "force-dynamic";

function DonateContent() {
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

  // Get vault contract address (try LosslessVault first, fallback to EndaomentVault)
  const { data: losslessVaultInfo } = useDeployedContractInfo("LosslessVault");
  const { data: endaomentVaultInfo } = useDeployedContractInfo("EndaomentVault");
  const vaultAddress = losslessVaultInfo?.address || endaomentVaultInfo?.address;
  const vaultContractName = losslessVaultInfo ? "LosslessVault" : "EndaomentVault";

  // Read current allowance (only if vault is deployed and address is available)
  const { data: currentAllowance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "allowance",
    args: address && vaultAddress ? [address, vaultAddress] : undefined,
  });

  const { writeContractAsync: approveUSDC } = useScaffoldWriteContract("MockUSDC");
  const { writeContractAsync: depositToVault } = useScaffoldWriteContract(vaultContractName as "LosslessVault" | "EndaomentVault");

  // Read total donations for this university (for display in card)
  const { data: totalDonations } = useScaffoldReadContract({
    contractName: "DonationTracker",
    functionName: "getTotalDonations",
    args: university?.wallet ? [university.wallet as `0x${string}`] : undefined,
  });

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
  const needsApproval = vaultAddress && currentAllowance ? currentAllowance < amountBigInt : true;

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
      if (needsApproval && vaultAddress) {
        setTxState("approving");
        await approveUSDC({
          functionName: "approve",
          args: [vaultAddress, amountBigInt],
        });
      }

      // Step 2: Deposit to LosslessVault
      setTxState("depositing");
      const tx = await depositToVault({
        functionName: "deposit",
        args: [amountBigInt, address],
      });

      setTxHash(tx || null);
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* University Card */}
        {university && (
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-8">
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="w-20 h-20 rounded-[6px] bg-[#F8FAFC] border border-[#F2F4F7] flex items-center justify-center flex-shrink-0">
                <span className="text-[32px] font-bold text-[#0052FF]">{university.shortName.charAt(0)}</span>
              </div>

              {/* University Info */}
              <div className="flex-1">
                <h2 className="text-[24px] font-bold text-[#0A0F1C] mb-2">{university.shortName}</h2>
                <p className="text-[14px] text-[#1A1A1A]/70 mb-4">{university.description}</p>

                {/* Funds Secured */}
                <div className="bg-[#F8FAFC] rounded-[6px] p-4">
                  <div className="text-[12px] text-[#1A1A1A]/70 mb-1">Fondos Asegurados en EnDAOment</div>
                  <div className="text-[20px] font-bold text-[#0052FF]">
                    ${formatUSDCWithCommas(totalDonations || 0n)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-8">Donar a {university?.shortName || "Universidad"}</h1>

        {/* Balance Card */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
          <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Available Balance</div>
          <div className="text-[32px] font-bold text-[#0A0F1C]">${formattedBalance} USDC</div>
        </div>

        {/* Amount Selection */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
          <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Selecciona cuanto quieres Donar</h2>
          <p className="text-[14px] text-[#1A1A1A]/70 mb-4">Tu capital se mantiene seguro, solo el yield se distribuye</p>

          {/* Quick Amount Buttons */}
          <div className="flex gap-3 mb-4">
            {quickAmounts.map(value => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className={`px-6 py-3 rounded-[6px] border-2 transition-all font-semibold ${
                  amount === value.toString()
                    ? "border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF]"
                    : "border-[#F2F4F7] hover:border-[#0052FF]/50 text-[#0A0F1C]"
                }`}
              >
                ${(value / 1000).toFixed(0)}K
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="mb-6">
            <label className="block text-[14px] font-semibold text-[#0A0F1C] mb-2">$ Elige</label>
            <input
              type="number"
              value={customAmount}
              onChange={e => handleCustomAmount(e.target.value)}
              placeholder="Ingresa cantidad en USDC"
              className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] focus:border-[#0052FF] focus:outline-none"
            />
          </div>
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

        {/* Error if vault not deployed */}
        {!vaultAddress && (
          <div className="bg-[#FF5B5B]/10 border border-[#FF5B5B] rounded-[6px] p-4 mb-6">
            <p className="text-[14px] text-[#FF5B5B]">
              ⚠️ No hay vault desplegado. Por favor, despliega LosslessVault o EndaomentVault primero.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {needsApproval && vaultAddress && (
            <>
              <PrimaryButton
                onClick={handleDonate}
                disabled={isLoadingState(txState) || selectedAmount <= 0 || !address || !vaultAddress}
                className="w-full"
              >
                {!address
                  ? "Conectar Wallet"
                  : !vaultAddress
                    ? "Vault no desplegado"
                    : isLoadingState(txState) && txState === "approving"
                      ? "Aprobando..."
                      : "① Aprueba Donación"}
              </PrimaryButton>
              {txState === "approving" && (
                <PrimaryButton
                  onClick={handleDonate}
                  disabled={isLoadingState(txState) || selectedAmount <= 0 || !address || !vaultAddress}
                  className="w-full"
                  variant="secondary"
                >
                  {isLoadingState(txState) ? getTransactionMessage(txState) : "② Confirmar"}
                </PrimaryButton>
              )}
            </>
          )}
          {!needsApproval && vaultAddress && (
            <PrimaryButton
              onClick={handleDonate}
              disabled={isLoadingState(txState) || selectedAmount <= 0 || !address || !vaultAddress}
              className="w-full"
            >
              {!address
                ? "Conectar Wallet"
                : !vaultAddress
                  ? "Vault no desplegado"
                  : isLoadingState(txState)
                    ? getTransactionMessage(txState)
                    : "② Confirmar"}
            </PrimaryButton>
          )}
        </div>

        {!address && (
          <p className="text-[14px] text-[#1A1A1A]/70 text-center mt-4">Please connect your wallet to donate</p>
        )}
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <DonateContent />
    </Suspense>
  );
}

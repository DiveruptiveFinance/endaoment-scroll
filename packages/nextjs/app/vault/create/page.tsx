"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreateVaultPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [deposit, setDeposit] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txStatus, setTxStatus] = useState<"idle" | "approving" | "depositing">("idle");

  // Read user's USDC balance
  const { data: usdcBalance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "balanceOf",
    args: [address],
  });

  // Read current allowance
  const { data: currentAllowance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "allowance",
    args: [address, "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82" as `0x${string}`], // EndaomentVault address
  });

  const { writeContractAsync: approveUSDC } = useScaffoldWriteContract("MockUSDC");
  const { writeContractAsync: depositToVault } = useScaffoldWriteContract("EndaomentVault");

  const handleSubmit = async () => {
    if (!address) return;

    setIsLoading(true);
    const depositAmount = parseUnits(deposit.toString(), 6); // USDC has 6 decimals

    try {
      // Step 1: Approve USDC
      setTxStatus("approving");
      await approveUSDC({
        functionName: "approve",
        args: ["0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82" as `0x${string}`, depositAmount],
      });

      // Step 2: Deposit to vault
      setTxStatus("depositing");
      await depositToVault({
        functionName: "deposit",
        args: [depositAmount, address],
      });

      setIsLoading(false);
      setShowSuccess(true);
      setTxStatus("idle");

      // Redirect after showing success
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      console.error("Deposit failed:", error);
      setIsLoading(false);
      setTxStatus("idle");
    }
  };

  const formattedBalance = usdcBalance ? Number(usdcBalance) / 1e6 : 0;
  const depositAmountBigInt = parseUnits(deposit.toString(), 6);
  const needsApproval = currentAllowance ? currentAllowance < depositAmountBigInt : true;

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="card-title text-2xl mb-2">Deposit Successful!</h2>
            <p className="mb-2">You deposited ${deposit} USDC to the vault</p>
            <p className="text-sm text-base-content/60">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">Create Impact Vault</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {!address && (
            <div className="alert alert-warning mb-4">
              <span>Please connect your wallet to deposit</span>
            </div>
          )}

          {/* Strategy (fixed) */}
          <div className="alert alert-info mb-4">
            <div>
              <div className="font-semibold">Strategy: Conservative (5% APY)</div>
              <div className="text-sm">🛡️ Aave USDC Lending - Low Risk</div>
            </div>
          </div>

          {/* Deposit Amount */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-semibold">Your Deposit (USDC) *</span>
            </label>
            <input
              type="number"
              min={1000}
              className="input input-bordered"
              value={deposit}
              onChange={e => setDeposit(Number(e.target.value))}
              disabled={!address}
            />
            <label className="label">
              <span className="label-text-alt">
                Minimum: 1000 USDC • Balance: {formattedBalance.toLocaleString()} USDC
              </span>
            </label>
          </div>

          {/* Approval Status */}
          {needsApproval && address && (
            <div className="alert alert-warning mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm">
                You will need to approve two transactions: USDC approval and vault deposit.
              </span>
            </div>
          )}

          {/* Transaction Status */}
          {isLoading && (
            <div className="alert alert-info mt-4">
              <span className="loading loading-spinner"></span>
              <span>
                {txStatus === "approving" && "Step 1/2: Approving USDC..."}
                {txStatus === "depositing" && "Step 2/2: Depositing to vault..."}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            className={`btn btn-primary btn-lg btn-block mt-6`}
            onClick={handleSubmit}
            disabled={isLoading || !address || deposit < 1000 || formattedBalance < deposit}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                {txStatus === "approving" ? "Approving..." : "Depositing..."}
              </>
            ) : (
              "Deposit to Vault →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

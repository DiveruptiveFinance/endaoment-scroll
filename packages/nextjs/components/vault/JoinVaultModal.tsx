"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Vault } from "~~/types/vault";

interface JoinVaultModalProps {
  vault: Vault;
  onClose: () => void;
}

export function JoinVaultModal({ vault, onClose }: JoinVaultModalProps) {
  const router = useRouter();
  const { address } = useAccount();
  const [amount, setAmount] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
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
    args: [address, "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82" as `0x${string}`],
  });

  const { writeContractAsync: approveUSDC } = useScaffoldWriteContract("MockUSDC");
  const { writeContractAsync: depositToVault } = useScaffoldWriteContract("EndaomentVault");

  const handleJoin = async () => {
    if (!address) return;

    setIsLoading(true);
    const depositAmount = parseUnits(amount.toString(), 6);

    try {
      // Step 1: Approve if needed
      const needsApproval = !currentAllowance || currentAllowance < depositAmount;
      if (needsApproval) {
        setTxStatus("approving");
        await approveUSDC({
          functionName: "approve",
          args: ["0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82" as `0x${string}`, depositAmount],
        });
      }

      // Step 2: Deposit to vault
      setTxStatus("depositing");
      await depositToVault({
        functionName: "deposit",
        args: [depositAmount, address],
      });

      setIsLoading(false);
      setTxStatus("idle");
      onClose();
      router.push("/dashboard");
    } catch (error) {
      console.error("Deposit failed:", error);
      setIsLoading(false);
      setTxStatus("idle");
    }
  };

  const formattedBalance = usdcBalance ? Number(usdcBalance) / 1e6 : 0;
  const shares = amount; // 1:1 for simplicity
  const votingPower = (shares / (vault.totalCapital + amount)) * 100;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Join {vault.name}</h3>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Your Deposit (USDC) *</span>
          </label>
          <input
            type="number"
            min={10}
            className="input input-bordered"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
          />
          <label className="label">
            <span className="label-text-alt">Minimum: 10 USDC • Balance: {formattedBalance.toLocaleString()} USDC</span>
          </label>
        </div>

        <div className="alert alert-info mt-4">
          <div className="text-sm">
            <div className="font-semibold mb-1">You&apos;ll receive:</div>
            <div>• ~{shares} vault shares</div>
            <div>• ~{votingPower.toFixed(2)}% voting power</div>
          </div>
        </div>

        {isLoading && (
          <div className="alert alert-info mt-4">
            <span className="loading loading-spinner"></span>
            <span className="text-sm">
              {txStatus === "approving" && "Step 1/2: Approving USDC..."}
              {txStatus === "depositing" && "Step 2/2: Depositing to vault..."}
            </span>
          </div>
        )}

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
          <span className="text-sm">Your principal is safe. Only yield is distributed to students.</span>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className={`btn btn-primary`}
            onClick={handleJoin}
            disabled={isLoading || amount < 10 || !address || formattedBalance < amount}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                {txStatus === "approving" ? "Approving..." : "Depositing..."}
              </>
            ) : (
              "Deposit →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

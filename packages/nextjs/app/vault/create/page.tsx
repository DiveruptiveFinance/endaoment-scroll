"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateVaultPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [deposit, setDeposit] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    // Mock approve USDC (1s)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock deposit to vault (1s)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    setShowSuccess(true);

    // Redirect after showing success
    setTimeout(() => router.push("/vaults"), 2000);
  };

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="card-title text-2xl mb-2">Vault Created!</h2>
            <p className="mb-2">Your vault &quot;{name}&quot; is now live</p>
            <p className="text-sm text-base-content/60">Redirecting to marketplace...</p>
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
          {/* Strategy (fixed) */}
          <div className="alert alert-info mb-4">
            <div>
              <div className="font-semibold">Strategy: Conservative (5% APY)</div>
              <div className="text-sm">🛡️ Aave USDC Lending - Low Risk</div>
            </div>
          </div>

          {/* Vault Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Vault Name *</span>
            </label>
            <input
              type="text"
              placeholder="Education Fund"
              className="input input-bordered"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={50}
            />
            <label className="label">
              <span className="label-text-alt">3-50 characters</span>
            </label>
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
            />
            <label className="label">
              <span className="label-text-alt">Minimum: 1000 USDC • Balance: 5000 USDC</span>
            </label>
          </div>

          {/* Info Alert */}
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
            <span className="text-sm">You will need to approve two transactions: USDC approval and vault deposit.</span>
          </div>

          {/* Submit */}
          <button
            className={`btn btn-primary btn-lg btn-block mt-6 ${isLoading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={isLoading || !name || name.length < 3 || deposit < 1000}
          >
            {isLoading ? "Creating Vault..." : "Create Vault & Deposit →"}
          </button>
        </div>
      </div>
    </div>
  );
}

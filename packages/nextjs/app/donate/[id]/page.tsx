"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TOKENS, UI_CONFIG } from "~~/data/constants";
import { getStudentById } from "~~/data/students";

export default function DonatePage() {
  const params = useParams();
  const router = useRouter();
  const student = getStudentById(params.id as string);
  const [amount, setAmount] = useState(50);
  const [token, setToken] = useState<string>(TOKENS.USDC.symbol);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>Student not found</span>
        </div>
      </div>
    );
  }

  const handleDonate = () => {
    setIsLoading(true);
    // Mock 2-second transaction delay
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 2000);
  };

  if (showSuccess) {
    const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66);
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="card-title text-2xl mb-2">Donation Successful!</h2>
            <p className="mb-4">
              You donated {amount} {token} to {student.name}&apos;s education
            </p>
            <div className="text-sm text-base-content/60 mb-6">
              Transaction: <code className="text-xs">{mockTxHash.slice(0, 20)}...</code>
            </div>
            <div className="flex gap-4">
              <button className="btn btn-primary" onClick={() => router.push("/dashboard")}>
                View Dashboard
              </button>
              <button className="btn btn-outline" onClick={() => router.push("/")}>
                Fund More Students
              </button>
            </div>
            <div className="divider">Share</div>
            <button className="btn btn-outline btn-sm" disabled>
              Share on Farcaster (Coming in Epic 2)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">Fund {student.name}</h1>

      {/* Student summary */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">{student.field}</h2>
          <p>{student.university}</p>
          <p className="text-sm mt-2">{student.bio}</p>
        </div>
      </div>

      {/* Donation form */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Donation Amount</h2>

          {/* Preset amounts */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {UI_CONFIG.DEFAULT_DONATION_AMOUNTS.map(preset => (
              <button
                key={preset}
                className={`btn ${amount === preset ? "btn-primary" : "btn-outline"}`}
                onClick={() => setAmount(preset)}
              >
                ${preset}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <input
            type="number"
            placeholder="Custom amount"
            className="input input-bordered w-full mb-4"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            min={0}
          />

          {/* Token selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Token</span>
            </label>
            <select className="select select-bordered w-full" value={token} onChange={e => setToken(e.target.value)}>
              <option value={TOKENS.USDC.symbol}>USDC</option>
              <option value={TOKENS.ETH.symbol}>ETH</option>
            </select>
          </div>

          {/* Info */}
          <div className="alert alert-info mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Your principal is safe. Only yield is distributed to students.</span>
          </div>

          {/* Submit */}
          <button
            className={`btn btn-primary btn-lg btn-block mt-4 ${isLoading ? "loading" : ""}`}
            onClick={handleDonate}
            disabled={isLoading || amount <= 0}
          >
            {isLoading ? "Processing..." : `Donate ${amount} ${token}`}
          </button>
        </div>
      </div>
    </div>
  );
}

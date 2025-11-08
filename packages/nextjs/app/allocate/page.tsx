"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function AllocatePage() {
  const router = useRouter();
  const { address } = useAccount();

  // Read current epoch from AllocationManager
  const { data: currentEpoch } = useScaffoldReadContract({
    contractName: "AllocationManager",
    functionName: "getCurrentEpoch",
  });

  // Read all students from StudentRegistry
  const { data: studentAddresses } = useScaffoldReadContract({
    contractName: "StudentRegistry",
    functionName: "getActiveStudents",
  });

  // Read user's vault shares
  const { data: userShares } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "balanceOf",
    args: [address],
  });

  // Read total vault shares
  const { data: totalShares } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "totalSupply",
  });

  // Read available yield
  const { data: availableYield } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "getAvailableYield",
  });

  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { writeContractAsync: allocateVotes } = useScaffoldWriteContract("AllocationManager");

  // Initialize allocations when students load
  useEffect(() => {
    if (studentAddresses && Object.keys(allocations).length === 0) {
      setAllocations(Object.fromEntries((studentAddresses as readonly string[]).map(addr => [addr, 0])));
    }
  }, [studentAddresses, allocations]);

  const totalAllocated = Object.values(allocations).reduce((sum, pct) => sum + pct, 0);
  const remaining = 100 - totalAllocated;

  const votingPower =
    userShares && totalShares && Number(totalShares) > 0 ? (Number(userShares) / Number(totalShares)) * 100 : 0;

  const totalYield = availableYield ? Number(formatUnits(availableYield, 6)) : 0;
  const epochId = currentEpoch ? Number(currentEpoch.id) : 0;
  const epochEndTime = currentEpoch ? Number(currentEpoch.endTime) : Date.now() / 1000 + 86400;
  const isVotingOpen = epochEndTime * 1000 > Date.now();

  const handleSliderChange = (studentAddr: string, value: number) => {
    setAllocations(prev => {
      const othersTotal = Object.entries(prev)
        .filter(([addr]) => addr !== studentAddr)
        .reduce((sum, [, pct]) => sum + pct, 0);

      const maxAllowed = 100 - othersTotal;
      const cappedValue = Math.min(value, maxAllowed);

      return { ...prev, [studentAddr]: cappedValue };
    });
  };

  const handleSubmit = async () => {
    if (!address || !userShares) return;

    setIsLoading(true);

    try {
      // Convert percentages to actual share amounts
      // Contract requires: totalVotes == userShares
      const studentArray = Object.keys(allocations).filter(addr => allocations[addr] > 0);
      const voteArray = studentArray.map(addr => {
        // Calculate vote amount as: (percentage / 100) * userShares
        const percentage = allocations[addr];
        const voteAmount = (BigInt(percentage) * userShares) / 100n;
        return voteAmount;
      });

      await allocateVotes({
        functionName: "allocateVotes",
        args: [
          "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82" as `0x${string}`, // EndaomentVault address
          studentArray as `0x${string}`[],
          voteArray,
        ],
      });

      setIsLoading(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Allocation failed:", error);
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="card-title text-2xl mb-2">Allocation Submitted!</h2>
            <p className="mb-4">Your yield allocation has been recorded for Epoch {epochId}</p>
            <p className="text-sm text-base-content/60 mb-6">Funds will be distributed at the end of the epoch</p>
            <div className="flex gap-4">
              <button className="btn btn-primary" onClick={() => router.push("/dashboard")}>
                View Dashboard
              </button>
              <button className="btn btn-outline" onClick={() => router.push("/")}>
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isVotingOpen) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="alert alert-warning">
          <span>Voting is closed for Epoch {epochId}. Check back next epoch!</span>
        </div>
        <button className="btn btn-ghost mt-4" onClick={() => router.push("/")}>
          ← Back to Homepage
        </button>
      </div>
    );
  }

  if (!studentAddresses || studentAddresses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="alert alert-info">
          <span>Loading students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Allocate Yield - Epoch {epochId}</h1>
      <p className="text-base-content/70 mb-6">
        You have ${totalYield.toLocaleString()} in yield to allocate to students.
      </p>

      {/* Vault Context Banner */}
      <div className="alert alert-info mb-6">
        <div>
          <div className="font-bold">💼 Allocating from: EndaomentVault</div>
          <div className="text-sm">
            Your voting power: {Number(formatUnits(userShares || 0n, 18)).toFixed(2)} shares ({votingPower.toFixed(2)}
            %)
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total Allocated</span>
            <span className={remaining === 0 ? "text-success" : "text-warning"}>{totalAllocated}% / 100%</span>
          </div>
          <progress className="progress progress-primary" value={totalAllocated} max={100}></progress>
          <p className="text-sm text-base-content/60 mt-2">Remaining: {remaining}%</p>
        </div>
      </div>

      {/* Allocation sliders */}
      <div className="space-y-4">
        {((studentAddresses as readonly string[]) || []).map((studentAddr: string, index: number) => {
          const allocation = allocations[studentAddr] || 0;
          const yieldAmount = ((totalYield * allocation) / 100).toFixed(2);

          return (
            <div key={studentAddr} className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold">Student #{index + 1}</h3>
                    <p className="text-sm text-base-content/70">{studentAddr}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{allocation}%</p>
                    <p className="text-sm text-base-content/70">${yieldAmount}</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={allocation}
                  onChange={e => handleSliderChange(studentAddr, Number(e.target.value))}
                  className="range range-primary"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Status */}
      {isLoading && (
        <div className="alert alert-info mt-6">
          <span className="loading loading-spinner"></span>
          <span>Submitting allocation on-chain...</span>
        </div>
      )}

      {/* Submit */}
      <button
        className={`btn btn-primary btn-lg btn-block mt-8`}
        onClick={handleSubmit}
        disabled={totalAllocated !== 100 || isLoading || !address}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner"></span>
            Submitting...
          </>
        ) : totalAllocated === 100 ? (
          "Confirm Allocation"
        ) : (
          "Allocate 100% to Continue"
        )}
      </button>
    </div>
  );
}

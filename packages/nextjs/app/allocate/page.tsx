"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function AllocatePage() {
  const router = useRouter();
  const { address } = useAccount();

  // Get vault contract address dynamically
  const { data: vaultInfo } = useDeployedContractInfo("EndaomentVault");
  const vaultAddress = vaultInfo?.address;

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

  // Read available yield (total vault yield)
  const { data: availableYield } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "getAvailableYield",
  });

  // Read whale address to determine user type
  const { data: whaleAddress } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "whale",
  });

  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [isGeneratingYield, setIsGeneratingYield] = useState(false);

  const { writeContractAsync: allocateVotes } = useScaffoldWriteContract("AllocationManager");
  const { writeContractAsync: simulateYield } = useScaffoldWriteContract("EndaomentVault");

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

  // Calculate user's personal yield based on donor type
  const totalVaultYield = availableYield ? Number(formatUnits(availableYield, 6)) : 0;
  const isWhale = whaleAddress?.toLowerCase() === address?.toLowerCase();
  const userDonorShare = isWhale ? 0.1 : 0.15; // 10% for whale, 15% for retail
  const donorPoolYield = totalVaultYield * userDonorShare;

  // User's share of their donor pool (proportional to their vault shares)
  const userShareRatio =
    userShares && totalShares && Number(totalShares) > 0 ? Number(userShares) / Number(totalShares) : 0;
  const userPersonalYield = donorPoolYield * userShareRatio;
  const epochId = currentEpoch ? Number(currentEpoch.id) : 0;
  const epochEndTime = currentEpoch ? Number(currentEpoch.endTime) : Date.now() / 1000 + 86400;
  const isVotingOpen = epochEndTime * 1000 > Date.now();

  // Calculate expected yield for simulation
  const calculateExpectedYield = (months: number) => {
    if (!totalShares || Number(totalShares) === 0) return 0;
    const principal = Number(formatUnits(totalShares, 18));
    const yieldAmount = (principal * 0.05 * months) / 12; // 5% APY
    return yieldAmount.toFixed(2);
  };

  const handleGenerateYield = async () => {
    if (!address) return;
    setIsGeneratingYield(true);
    try {
      await simulateYield({
        functionName: "simulateYield",
        args: [BigInt(selectedMonths)],
      });
      // Refresh page to show new yield
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Failed to generate yield:", error);
      setIsGeneratingYield(false);
    }
  };

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
      // Contract requires: totalVotes == userShares exactly
      const studentArray = Object.keys(allocations).filter(addr => allocations[addr] > 0);

      // Calculate votes for all but last student, then give remainder to last student
      // This ensures vote total exactly equals userShares (avoiding rounding errors)
      const voteArray: bigint[] = [];
      let remainingShares = userShares;

      studentArray.forEach((addr, index) => {
        if (index === studentArray.length - 1) {
          // Last student gets all remaining shares
          voteArray.push(remainingShares);
        } else {
          // Calculate proportional vote amount
          const percentage = allocations[addr];
          const voteAmount = (BigInt(percentage) * userShares) / 100n;
          voteArray.push(voteAmount);
          remainingShares -= voteAmount;
        }
      });

      if (!vaultAddress) throw new Error("Vault address not found");

      await allocateVotes({
        functionName: "allocateVotes",
        args: [vaultAddress, studentArray as `0x${string}`[], voteArray],
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
        You have ${userPersonalYield.toFixed(2)} in yield to allocate to students.
      </p>

      {/* Vault Context Banner */}
      <div className="alert alert-info mb-6">
        <div>
          <div className="font-bold">💼 Allocating from: EndaomentVault</div>
          <div className="text-sm">
            Your voting power: {Number(formatUnits(userShares || 0n, 6)).toFixed(2)} shares ({votingPower.toFixed(2)}%)
          </div>
          <div className="text-sm mt-1">
            Donor type: {isWhale ? "🐋 Whale (earns 10% of vault yield)" : "💰 Retail (earns 15% of vault yield)"}
          </div>
        </div>
      </div>

      {/* Yield Generation Demo */}
      <div className="card bg-primary text-primary-content mb-6">
        <div className="card-body">
          <h3 className="card-title">🎯 Demo: Generate Yield</h3>
          <p className="text-sm opacity-90">
            Simulate yield generation to see the impact of your allocation in real-time
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="label">
                <span className="label-text text-primary-content">Time Period</span>
              </label>
              <select
                value={selectedMonths}
                onChange={e => setSelectedMonths(Number(e.target.value))}
                className="select select-bordered w-full bg-base-100 text-base-content"
              >
                <option value={1}>1 Month (~0.42% yield)</option>
                <option value={3}>3 Months (~1.25% yield)</option>
                <option value={6}>6 Months (~2.5% yield)</option>
                <option value={12}>1 Year (~5% yield)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <button
                className="btn btn-secondary w-full"
                onClick={handleGenerateYield}
                disabled={isGeneratingYield || !totalShares || Number(totalShares) === 0}
              >
                {isGeneratingYield ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Generating...
                  </>
                ) : (
                  `Generate ${selectedMonths} Month${selectedMonths > 1 ? "s" : ""} of Yield`
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-base-100 text-base-content rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Expected Yield:</span>
              <span className="text-lg font-bold">${calculateExpectedYield(selectedMonths)} USDC</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm">Student Share (75%):</span>
              <span className="font-semibold">
                ${(Number(calculateExpectedYield(selectedMonths)) * 0.75).toFixed(2)} USDC
              </span>
            </div>
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
          // Student gets their percentage of user's personal yield
          const studentYield = ((userPersonalYield * allocation) / 100).toFixed(2);

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
                    <p className="text-sm text-success font-semibold">${studentYield} USDC</p>
                    <p className="text-xs text-base-content/60">{allocation}% of your yield</p>
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

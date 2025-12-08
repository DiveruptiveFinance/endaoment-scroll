"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { FIXED_APY, calculateProjections, formatUSDC, formatUSDCWithCommas } from "~~/utils/format";

export const dynamic = "force-dynamic";

export default function DonorDashboardPage() {
  const { address } = useAccount();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [profileDescription, setProfileDescription] = useState<string>("");

  // Read USDC balance
  const { data: usdcBalance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "balanceOf",
    args: [address],
  });

  // Read LosslessVault shares
  const { data: userShares } = useScaffoldReadContract({
    contractName: "LosslessVault",
    functionName: "balanceOf",
    args: [address],
  });

  // Read assets (principal deposited)
  const { data: userAssets } = useScaffoldReadContract({
    contractName: "LosslessVault",
    functionName: "convertToAssets",
    args: [userShares || 0n],
  });

  // Read deposit events
  const { data: depositEvents } = useScaffoldEventHistory({
    contractName: "LosslessVault",
    eventName: "Deposit",
    fromBlock: 0n,
  });

  const availableUSDC = usdcBalance || 0n;
  const principalDeposited = userAssets || 0n;
  const principalNumber = Number(formatUSDC(principalDeposited).replace(/,/g, ""));

  // Calculate projections
  const projections = calculateProjections(principalNumber, FIXED_APY);

  // Prepare chart data
  const chartData = Object.values(projections).map(p => ({
    period: p.period,
    yield: parseFloat(p.yield.toFixed(2)),
    total: parseFloat(p.total.toFixed(2)),
  }));

  // Get supported initiatives (from deposit events)
  const supportedInitiatives = depositEvents?.length || 0;

  // Load profile from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedImage = localStorage.getItem("donorProfileImage");
      const savedName = localStorage.getItem("donorProfileName");
      const savedDesc = localStorage.getItem("donorProfileDescription");
      if (savedImage) setProfileImage(savedImage);
      if (savedName) setProfileName(savedName);
      if (savedDesc) setProfileDescription(savedDesc);
    }
  }, []);

  if (!address) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Connect Your Wallet</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">Please connect your wallet to view your dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header with Profile */}
        <div className="flex items-start gap-6 mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#F2F4F7] flex-shrink-0 bg-[#F8FAFC]">
            {profileImage ? (
              <Image src={profileImage} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[32px] font-bold text-[#0052FF]">
                {profileName.charAt(0) || "D"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-2">{profileName || "Donor Dashboard"}</h1>
            {profileDescription && <p className="text-[16px] text-[#1A1A1A]/70 mb-4">{profileDescription}</p>}
            <Link href="/donor/profile">
              <button className="text-[14px] text-[#0052FF] hover:text-[#0040CC] transition-colors">
                Edit Profile →
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Available USDC */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Available USDC</div>
            <div className="text-[32px] font-bold text-[#0A0F1C]">${formatUSDCWithCommas(availableUSDC)}</div>
            <div className="text-[12px] text-[#1A1A1A]/60 mt-1">In your wallet</div>
          </div>

          {/* USDC Used for Yield */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Principal Deposited</div>
            <div className="text-[32px] font-bold text-[#0052FF]">${formatUSDCWithCommas(principalDeposited)}</div>
            <div className="text-[12px] text-[#1A1A1A]/60 mt-1">Generating yield (10% APY)</div>
          </div>
        </div>

        {/* Projection Chart */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-8">
          <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Donation Projections</h2>
          <p className="text-[14px] text-[#1A1A1A]/70 mb-6">
            Projected yield donations based on your principal (10% APY)
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" />
              <XAxis dataKey="period" stroke="#1A1A1A" />
              <YAxis stroke="#1A1A1A" />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              />
              <Legend />
              <Line type="monotone" dataKey="yield" stroke="#5CE27F" strokeWidth={2} name="Yield Donated" />
              <Line type="monotone" dataKey="total" stroke="#0052FF" strokeWidth={2} name="Total (Principal + Yield)" />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-5 gap-4 mt-6">
            {Object.values(projections).map(p => (
              <div key={p.period} className="text-center">
                <div className="text-[12px] text-[#1A1A1A]/70 mb-1">{p.period}</div>
                <div className="text-[16px] font-bold text-[#0052FF]">${p.yield.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Initiatives */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-8">
          <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Initiatives Supported</h2>
          {supportedInitiatives > 0 ? (
            <div>
              <p className="text-[16px] text-[#1A1A1A]/70 mb-4">
                You have made <span className="font-semibold">{supportedInitiatives}</span> donation
                {supportedInitiatives !== 1 ? "s" : ""}
              </p>
              <Link href="/fund/universities">
                <PrimaryButton size="md">View All Universities</PrimaryButton>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[16px] text-[#1A1A1A]/70 mb-4">You haven&apos;t made any donations yet</p>
              <Link href="/fund/donate">
                <PrimaryButton size="md">Make Your First Donation</PrimaryButton>
              </Link>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/fund/donate">
            <PrimaryButton size="lg" className="w-full">
              Donate
            </PrimaryButton>
          </Link>
          <Link href="/donor/withdraw">
            <PrimaryButton size="lg" variant="secondary" className="w-full">
              Withdraw
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { formatUSDCWithCommas } from "~~/utils/format";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { University } from "~~/data/universities";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";

interface UniversityCardProps {
  university: University;
}

export function UniversityCard({ university }: UniversityCardProps) {
  // Read donations from DonationTracker
  const { data: totalDonations } = useScaffoldReadContract({
    contractName: "DonationTracker",
    functionName: "getTotalDonations",
    args: [university.wallet as `0x${string}`],
  });

  // Read yield distributed from DonationTracker
  const { data: totalYield } = useScaffoldReadContract({
    contractName: "DonationTracker",
    functionName: "getTotalYieldDistributed",
    args: [university.wallet as `0x${string}`],
  });

  // Read current USDC balance in university wallet
  const { data: walletBalance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "balanceOf",
    args: [university.wallet as `0x${string}`],
  });

  const capitalRaised = totalDonations ? Number(formatUSDCWithCommas(totalDonations).replace(/,/g, "")) : 0;
  const yieldGenerated = totalYield ? Number(formatUSDCWithCommas(totalYield).replace(/,/g, "")) : 0;
  const currentBalance = walletBalance ? Number(formatUSDCWithCommas(walletBalance).replace(/,/g, "")) : 0;

  const capitalProgress = (capitalRaised / university.capitalGoal) * 100;
  const yieldProgress = (yieldGenerated / (university.capitalGoal * 0.1)) * 100; // 10% of goal as yield target

  return (
    <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300">
      {/* University Logo and Name */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-[6px] overflow-hidden border border-[#F2F4F7] flex-shrink-0 bg-[#F8FAFC]">
          {university.logo ? (
            <Image src={university.logo} alt={university.shortName} fill className="object-contain p-2" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[20px] font-bold text-[#0052FF]">
              {university.shortName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-1">{university.shortName}</h3>
          <p className="text-[14px] text-[#1A1A1A]/70 mb-2">{university.name}</p>
          <p className="text-[13px] text-[#1A1A1A]/60">{university.description}</p>
        </div>
      </div>

      {/* Capital Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[14px] font-semibold text-[#0A0F1C]">Capital Raised</span>
          <span className="text-[16px] font-bold text-[#0052FF]">
            ${formatUSDCWithCommas(BigInt(Math.floor(capitalRaised * 1e6)))} / ${university.capitalGoal.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-[#F2F4F7] rounded-full h-2">
          <div
            className="h-2 rounded-full bg-[#0052FF] transition-all duration-500"
            style={{ width: `${Math.min(capitalProgress, 100)}%` }}
          />
        </div>
        <div className="text-[12px] text-[#1A1A1A]/60 mt-1">
          {capitalProgress.toFixed(1)}% of goal
        </div>
      </div>

      {/* Yield Generated */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[14px] font-semibold text-[#0A0F1C]">Yield Generated (True Donation)</span>
          <span className="text-[16px] font-bold text-[#5CE27F]">
            ${formatUSDCWithCommas(BigInt(Math.floor(yieldGenerated * 1e6)))}
          </span>
        </div>
        <div className="w-full bg-[#F2F4F7] rounded-full h-2">
          <div
            className="h-2 rounded-full bg-[#5CE27F] transition-all duration-500"
            style={{ width: `${Math.min(yieldProgress, 100)}%` }}
          />
        </div>
        <div className="text-[12px] text-[#1A1A1A]/60 mt-1">
          Current balance: ${formatUSDCWithCommas(BigInt(Math.floor(currentBalance * 1e6)))}
        </div>
      </div>

      {/* Fund Button */}
      <Link href={`/fund/donate?university=${university.id}`}>
        <PrimaryButton size="md" className="w-full">
          Fund this University
        </PrimaryButton>
      </Link>
    </div>
  );
}


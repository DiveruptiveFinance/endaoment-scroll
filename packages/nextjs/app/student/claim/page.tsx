"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, DollarSign, ExternalLink, XCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { getFundingClaim } from "~~/data/mockStudentFlow";
import { getFundingProgress, getStudentById } from "~~/data/students";
// import { FundingClaim } from "~~/types/student-flow";

export default function ClaimFundingPage() {
  const { address } = useAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const fundingClaim = address ? getFundingClaim("1") : null;
  const student = address ? getStudentById("1") : null;

  if (!address) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Connect Your Wallet</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">Please connect your wallet to claim your funding</p>
            <PrimaryButton size="lg">Connect Wallet</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Student Profile Not Found</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">You need to create a student profile first</p>
            <Link href="/student/create">
              <PrimaryButton size="lg">Create Student Profile</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = getFundingProgress(student);

  const handleClaim = async () => {
    if (!fundingClaim || fundingClaim.status !== "approved") return;

    setIsClaiming(true);

    // Mock: Simulate claim process
    setTimeout(() => {
      setIsClaiming(false);
      setClaimSuccess(true);
    }, 3000);
  };

  if (claimSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <CheckCircle2 className="w-16 h-16 text-[#5CE27F] mx-auto mb-4" strokeWidth={2} />
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Funds Claimed Successfully!</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">Your funds have been transferred to your wallet</p>
            {fundingClaim?.txHash && (
              <div className="mb-6">
                <a
                  href={`https://etherscan.io/tx/${fundingClaim.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#0052FF] hover:text-[#0040CC] transition-colors"
                >
                  <span>View Transaction</span>
                  <ExternalLink className="w-4 h-4" strokeWidth={2} />
                </a>
              </div>
            )}
            <Link href="/student/dashboard">
              <PrimaryButton size="lg">Back to Dashboard</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!fundingClaim) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Link
            href="/student/dashboard"
            className="inline-block mb-6 text-[#0052FF] hover:text-[#0040CC] transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <DollarSign className="w-16 h-16 text-[#1A1A1A]/30 mx-auto mb-4" strokeWidth={2} />
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">No Funding Available</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">You don&apos;t have any approved funding to claim yet</p>
            <Link href="/student/dashboard">
              <PrimaryButton size="lg">Back to Dashboard</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (fundingClaim.status) {
      case "approved":
        return <CheckCircle2 className="w-6 h-6 text-[#5CE27F]" strokeWidth={2} />;
      case "pending":
        return <Clock className="w-6 h-6 text-[#FFCF72]" strokeWidth={2} />;
      case "rejected":
        return <XCircle className="w-6 h-6 text-[#FF5B5B]" strokeWidth={2} />;
      case "claimed":
        return <CheckCircle2 className="w-6 h-6 text-[#0052FF]" strokeWidth={2} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (fundingClaim.status) {
      case "approved":
        return "bg-[#5CE27F]/10 border-[#5CE27F]/30 text-[#5CE27F]";
      case "pending":
        return "bg-[#FFCF72]/10 border-[#FFCF72]/30 text-[#FFCF72]";
      case "rejected":
        return "bg-[#FF5B5B]/10 border-[#FF5B5B]/30 text-[#FF5B5B]";
      case "claimed":
        return "bg-[#0052FF]/10 border-[#0052FF]/30 text-[#0052FF]";
      default:
        return "bg-[#F2F4F7] border-[#F2F4F7] text-[#1A1A1A]/70";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/student/dashboard"
          className="inline-block mb-6 text-[#0052FF] hover:text-[#0040CC] transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
          <h1 className="text-[32px] font-bold text-[#0A0F1C] mb-2">Claim Funding</h1>
          <p className="text-[16px] text-[#1A1A1A]/70 mb-8">Claim your approved funding to your wallet</p>

          {/* Funding Amount */}
          <div className="bg-[#F2F4F7] rounded-[6px] p-8 mb-6 text-center">
            <div className="text-[48px] font-bold text-[#0052FF] mb-2">${fundingClaim.amount.toLocaleString()}</div>
            <div className="text-[20px] font-semibold text-[#0A0F1C] mb-1">{fundingClaim.token}</div>
            <div className="text-[14px] text-[#1A1A1A]/70">Available to claim</div>
          </div>

          {/* Status */}
          <div className={`rounded-[6px] p-4 border mb-6 flex items-center gap-3 ${getStatusColor()}`}>
            {getStatusIcon()}
            <div>
              <div className="text-[16px] font-semibold capitalize">{fundingClaim.status}</div>
              <div className="text-[13px] opacity-80">
                {fundingClaim.status === "approved" && "Ready to claim"}
                {fundingClaim.status === "pending" && "Awaiting approval"}
                {fundingClaim.status === "rejected" && "Funding request rejected"}
                {fundingClaim.status === "claimed" && "Already claimed"}
              </div>
            </div>
          </div>

          {/* Funding Progress Info */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] mb-6">
            <h3 className="text-[18px] font-bold text-[#0A0F1C] mb-4">Funding Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#1A1A1A]/70">Current Funding</span>
                <span className="text-[16px] font-semibold text-[#0A0F1C]">
                  ${student.currentFunding.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#1A1A1A]/70">Funding Goal</span>
                <span className="text-[16px] font-semibold text-[#0A0F1C]">
                  ${student.fundingGoalUsd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#1A1A1A]/70">Progress</span>
                <span className="text-[16px] font-bold text-[#0052FF]">{progress.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Claim Details */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] mb-6">
            <h3 className="text-[18px] font-bold text-[#0A0F1C] mb-4">Claim Details</h3>
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/70">Requested At</span>
                <span className="text-[#0A0F1C] font-semibold">{fundingClaim.requestedAt.toLocaleDateString()}</span>
              </div>
              {fundingClaim.claimedAt && (
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/70">Claimed At</span>
                  <span className="text-[#0A0F1C] font-semibold">{fundingClaim.claimedAt.toLocaleDateString()}</span>
                </div>
              )}
              {fundingClaim.txHash && (
                <div className="flex justify-between items-center">
                  <span className="text-[#1A1A1A]/70">Transaction</span>
                  <a
                    href={`https://etherscan.io/tx/${fundingClaim.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0052FF] hover:text-[#0040CC] transition-colors flex items-center gap-1"
                  >
                    <span>View on Etherscan</span>
                    <ExternalLink className="w-4 h-4" strokeWidth={2} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Claim Button */}
          {fundingClaim.status === "approved" && (
            <PrimaryButton size="lg" className="w-full" onClick={handleClaim} disabled={isClaiming}>
              {isClaiming ? "Claiming..." : "Claim Funds"}
            </PrimaryButton>
          )}

          {fundingClaim.status === "claimed" && (
            <div className="bg-[#0052FF]/10 rounded-[6px] p-4 border border-[#0052FF]/30 text-center">
              <p className="text-[16px] font-semibold text-[#0A0F1C]">Funds have already been claimed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

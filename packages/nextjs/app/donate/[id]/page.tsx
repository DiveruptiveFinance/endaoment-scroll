"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { TOKENS } from "~~/data/constants";
import { getFundingProgress, getStudentById } from "~~/data/students";

export default function DonatePage() {
  const params = useParams();
  const router = useRouter();
  const student = getStudentById(params.id as string);
  const [amount, setAmount] = useState(100);
  const [token, setToken] = useState<string>(TOKENS.USDC.symbol);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!student) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <p className="text-[16px] text-[#FF5B5B] mb-4">Student not found</p>
            <Link href="/" className="text-[#0052FF] hover:text-[#0040CC] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = getFundingProgress(student);

  // Determine progress bar color based on funding level
  const getProgressColor = () => {
    if (progress < 25) return "#FF5B5B"; // Red
    if (progress < 50) return "#FF8C42"; // Orange
    if (progress < 75) return "#FFCF72"; // Yellow
    return "#5CE27F"; // Green
  };

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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <CheckCircle2 className="w-16 h-16 text-[#5CE27F] mx-auto mb-4" strokeWidth={2} />
            <h2 className="text-[32px] font-bold text-[#0A0F1C] mb-4">Donation Successful!</h2>
            <p className="text-[18px] text-[#1A1A1A]/70 mb-6">
              You donated ${amount.toLocaleString()} {token} to {student.name}&apos;s education
            </p>
            <div className="bg-[#F2F4F7] rounded-[6px] p-4 mb-6 inline-block">
              <div className="text-[14px] text-[#1A1A1A]/70 mb-1">Transaction</div>
              <code className="text-[12px] text-[#0052FF]">{mockTxHash.slice(0, 20)}...</code>
            </div>
            <div className="flex gap-4 justify-center">
              <PrimaryButton size="lg" onClick={() => router.push("/dashboard")}>
                View Dashboard
              </PrimaryButton>
              <PrimaryButton variant="secondary" size="lg" onClick={() => router.push("/")}>
                Fund More Students
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 text-[#0052FF] hover:text-[#0040CC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span>Back to Students</span>
        </Link>

        {/* Student Header with Images */}
        <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
          <div className="flex items-start gap-6 mb-6">
            {/* Student Avatar */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#F2F4F7] flex-shrink-0">
              {student.avatarUrl ? (
                <Image
                  src={student.avatarUrl}
                  alt={student.name}
                  fill
                  className="object-cover"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-[#0052FF]/10 flex items-center justify-center text-[36px] font-bold text-[#0052FF]"
                style={{ display: student.avatarUrl ? "none" : "flex" }}
              >
                {student.name.charAt(0)}
              </div>
            </div>

            {/* University Logo */}
            {student.universityLogo && (
              <div className="relative w-20 h-20 rounded-[6px] overflow-hidden border border-[#F2F4F7] flex-shrink-0">
                <Image
                  src={student.universityLogo}
                  alt={student.university}
                  fill
                  className="object-contain p-2"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Name and Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-[36px] font-bold text-[#0A0F1C]">{student.name}</h1>
                {student.isVerified && <CheckCircle2 className="w-6 h-6 text-[#5CE27F]" strokeWidth={2} />}
              </div>
              <p className="text-[20px] font-semibold text-[#0052FF] mb-1">{student.field}</p>
              <p className="text-[16px] text-[#1A1A1A]/70 mb-3">{student.university}</p>
              <p className="text-[16px] text-[#1A1A1A]/70 leading-relaxed">{student.bio}</p>
            </div>
          </div>

          {/* Funding Progress Bar */}
          <div className="border-t border-[#F2F4F7] pt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[16px] font-semibold text-[#0A0F1C]">Funding Progress</span>
              <span className="text-[20px] font-bold text-[#0052FF]">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#F2F4F7] rounded-full h-4 mb-3">
              <div
                className="h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor: getProgressColor(),
                }}
              />
            </div>
            <div className="flex justify-between text-[14px] text-[#1A1A1A]/70">
              <span>${student.currentFunding.toLocaleString()} raised</span>
              <span>Goal: ${student.fundingGoalUsd.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Donation form */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
          <div>
            <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-6">Donation Amount</h2>

            {/* Amount Display */}
            <div className="mb-6">
              <div className="text-center mb-6">
                <div className="text-[48px] font-bold text-[#0052FF] mb-2">${amount.toLocaleString()}</div>
                <div className="text-[16px] text-[#1A1A1A]/70">{token}</div>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="range"
                    min={10}
                    max={10000}
                    step={10}
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-[#F2F4F7] rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #0052FF 0%, #0052FF ${((amount - 10) / (10000 - 10)) * 100}%, #F2F4F7 ${((amount - 10) / (10000 - 10)) * 100}%, #F2F4F7 100%)`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[13px] text-[#1A1A1A]/70">
                  <span className="font-medium">$10</span>
                  <span className="font-medium">$10,000</span>
                </div>
              </div>

              {/* Quick amount buttons */}
              <div className="flex gap-2 mt-4 justify-center">
                {[100, 500, 1000, 5000].map(quickAmount => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount)}
                    className={`px-4 py-2 rounded-[6px] text-[14px] font-semibold transition-all duration-300 ${
                      amount === quickAmount
                        ? "bg-[#0052FF] text-white"
                        : "bg-[#F2F4F7] text-[#1A1A1A] hover:bg-[#0052FF]/10"
                    }`}
                  >
                    ${quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Token selection */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-[#1A1A1A] mb-2">Token</label>
              <select
                className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] bg-white text-[#1A1A1A] focus:border-[#0052FF] focus:outline-none transition-all duration-300"
                value={token}
                onChange={e => setToken(e.target.value)}
              >
                <option value={TOKENS.USDC.symbol}>USDC</option>
                <option value={TOKENS.ETH.symbol}>ETH</option>
                <option value={TOKENS.MXNe.symbol}>MXNe</option>
                <option value={TOKENS.BRL1.symbol}>BRL1</option>
              </select>
            </div>

            {/* Info */}
            <div className="bg-[#F2F4F7] rounded-[6px] p-4 mb-6 flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#0052FF] flex-shrink-0 mt-0.5"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className="text-[14px] text-[#1A1A1A]/70">
                Your principal is safe. Only yield is distributed to students.
              </span>
            </div>

            {/* Submit */}
            <PrimaryButton size="lg" className="w-full" onClick={handleDonate} disabled={isLoading || amount < 10}>
              {isLoading ? "Processing..." : `Donate $${amount.toLocaleString()} ${token}`}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";

export default function FundPage() {
  const [activeTab, setActiveTab] = useState<"universities" | "initiatives">("universities");

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-4">Fund Education</h1>
          <p className="text-[16px] text-[#1A1A1A]/70 max-w-2xl">
            Choose how you want to support education. Fund universities directly or support student initiatives.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#F2F4F7]">
          <button
            onClick={() => setActiveTab("universities")}
            className={`px-6 py-3 text-[16px] font-semibold border-b-2 transition-colors ${
              activeTab === "universities"
                ? "border-[#0052FF] text-[#0052FF]"
                : "border-transparent text-[#1A1A1A]/70 hover:text-[#0052FF]"
            }`}
          >
            Universities
          </button>
          <button
            onClick={() => setActiveTab("initiatives")}
            className={`px-6 py-3 text-[16px] font-semibold border-b-2 transition-colors ${
              activeTab === "initiatives"
                ? "border-[#0052FF] text-[#0052FF]"
                : "border-transparent text-[#1A1A1A]/70 hover:text-[#0052FF]"
            }`}
          >
            Initiatives
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "universities" && (
          <div>
            <Link href="/fund/universities">
              <PrimaryButton size="lg" className="w-full mb-6">
                View All Universities
              </PrimaryButton>
            </Link>
            <p className="text-[14px] text-[#1A1A1A]/70 text-center">
              Browse top Mexican universities and fund them directly
            </p>
          </div>
        )}

        {activeTab === "initiatives" && (
          <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Coming Soon</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              Student initiatives will be available soon. For now, focus on funding universities directly.
            </p>
            <p className="text-[14px] text-[#1A1A1A]/50">
              In this MVP stage, we prioritize university funding to maximize impact.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


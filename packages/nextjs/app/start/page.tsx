"use client";

import { useRouter } from "next/navigation";
import { Box, GraduationCap, Info, Users } from "lucide-react";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";

export default function StartPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-4">Choose Your Path</h1>
          <p className="text-[16px] text-[#1A1A1A]/70 max-w-2xl mx-auto">
            Select how you want to participate in enDAOment
          </p>
        </div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Whale Donor */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center mb-4">
                <Box className="w-8 h-8 text-[#0052FF]" strokeWidth={2} />
              </div>
              <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Whale Donor</h2>
              <p className="text-[16px] text-[#1A1A1A]/70 mb-6">Create your vault and define yield strategy.</p>
              <PrimaryButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => router.push("/vault/create")}
              >
                Create Vault
              </PrimaryButton>
            </div>
          </div>

          {/* Retail Donor */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#0052FF]" strokeWidth={2} />
              </div>
              <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Retail Donor</h2>
              <p className="text-[16px] text-[#1A1A1A]/70 mb-6">Join shared vaults starting at $10.</p>
              <PrimaryButton variant="secondary" size="md" className="w-full" onClick={() => router.push("/vaults")}>
                Explore Vaults
              </PrimaryButton>
            </div>
          </div>

          {/* Student */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-[#0052FF]" strokeWidth={2} />
              </div>
              <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Student</h2>
              <p className="text-[16px] text-[#1A1A1A]/70 mb-6">Get funded, no repayment needed.</p>
              <PrimaryButton variant="secondary" size="md" className="w-full" onClick={() => router.push("/")}>
                Browse Students
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-[#F2F4F7] rounded-[6px] p-6 border border-[#F2F4F7]">
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-[#0052FF]/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-4 h-4 text-[#0052FF]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">How Yield Distribution Works</h3>
              <p className="text-[16px] text-[#1A1A1A]/70">
                All deposits generate yield through DeFi strategies (Aave). The yield is split: 10% to whale donors, 15%
                to retail donors, and 75% to students based on community voting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box, CheckSquare, GraduationCap, Heart, TrendingUp, User } from "lucide-react";
import { useAccount } from "wagmi";
import { StudentCard } from "~~/components/miniapp/StudentCard";
import { Logo } from "~~/components/ui/Logo";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { StatsCard } from "~~/components/ui/StatsCard";
import { PLATFORM_STATS } from "~~/data/constants";
import { STUDENTS } from "~~/data/students";

export default function Home() {
  const router = useRouter();
  const { address: connectedAddress, isConnected } = useAccount();
  const [userType, setUserType] = useState<"student" | "donor" | null>(null);

  // Handle redirect after wallet connection
  useEffect(() => {
    if (isConnected) {
      const storedUserType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
      const typeToUse = userType || storedUserType;

      if (typeToUse === "student") {
        router.push("/student/dashboard");
      } else if (typeToUse === "donor") {
        // Scroll to students section
        setTimeout(() => {
          const studentsSection = document.getElementById("students-section");
          if (studentsSection) {
            studentsSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  }, [isConnected, userType, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimalist */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <p className="text-[16px] text-[#1A1A1A] mb-8 max-w-2xl mx-auto">
            Transform donations into perpetual scholarships. Your donation earns DeFi yield and funds students forever.
          </p>

          {/* Platform Stats - White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <StatsCard title="Total Donated" value={`$${PLATFORM_STATS.totalDonated.toLocaleString()}`} />
            <StatsCard title="Yield Generated" value={`$${PLATFORM_STATS.totalYieldGenerated.toLocaleString()}`} />
            <StatsCard title="Students Supported" value={PLATFORM_STATS.studentsSupported} />
          </div>

          {/* User Type Selection - Two Buttons */}
          {!isConnected ? (
            <div className="max-w-2xl mx-auto mb-12">
              <h2 className="text-[24px] font-bold text-[#0A0F1C] mb-6">Choose Your Path</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Button */}
                <ConnectButton.Custom>
                  {({ openConnectModal: openModal }) => {
                    return (
                      <button
                        onClick={() => {
                          setUserType("student");
                          if (typeof window !== "undefined") {
                            localStorage.setItem("userType", "student");
                          }
                          openModal();
                        }}
                        className="bg-white rounded-[6px] p-8 border-2 border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300 text-left group"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center group-hover:bg-[#0052FF]/20 transition-colors">
                            <User className="w-8 h-8 text-[#0052FF]" strokeWidth={2} />
                          </div>
                          <h3 className="text-[24px] font-bold text-[#0A0F1C]">Student</h3>
                        </div>
                        <p className="text-[16px] text-[#1A1A1A]/70">
                          Upload documents, earn voting power, and claim your funding
                        </p>
                      </button>
                    );
                  }}
                </ConnectButton.Custom>

                {/* Donor Button */}
                <ConnectButton.Custom>
                  {({ openConnectModal: openModal }) => {
                    return (
                      <button
                        onClick={() => {
                          setUserType("donor");
                          if (typeof window !== "undefined") {
                            localStorage.setItem("userType", "donor");
                          }
                          openModal();
                        }}
                        className="bg-white rounded-[6px] p-8 border-2 border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300 text-left group"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center group-hover:bg-[#0052FF]/20 transition-colors">
                            <Heart className="w-8 h-8 text-[#0052FF]" strokeWidth={2} />
                          </div>
                          <h3 className="text-[24px] font-bold text-[#0A0F1C]">Donor</h3>
                        </div>
                        <p className="text-[16px] text-[#1A1A1A]/70">
                          Fund students and earn yield while making a perpetual impact
                        </p>
                      </button>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              {userType === "student" ||
              (typeof window !== "undefined" && localStorage.getItem("userType") === "student") ? (
                <Link href="/student/dashboard">
                  <PrimaryButton size="lg">Go to Student Dashboard</PrimaryButton>
                </Link>
              ) : (
                <a href="#students-section">
                  <PrimaryButton size="lg">Browse Students</PrimaryButton>
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Student Grid Section */}
      <section id="students-section" className="bg-[#F8FAFC] py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-2">Fund a Student</h2>
            <p className="text-[16px] text-[#1A1A1A]/70">Browse students from top LATAM universities</p>
          </div>

          {/* Student Cards Grid - 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STUDENTS.slice(0, 4).map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">How It Works</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 max-w-2xl mx-auto">
              A new model for educational funding inspired by Octant&apos;s allocation mechanism
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
                  <Box className="w-5 h-5 text-[#0052FF]" strokeWidth={2} />
                </div>
                <span className="text-[20px] font-bold text-[#0A0F1C]">1</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Join a Vault</h3>
              <p className="text-[16px] text-[#1A1A1A]/70">
                Explore vaults created by whale donors. Deposit as little as $10 USDC.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#0052FF]" strokeWidth={2} />
                </div>
                <span className="text-[20px] font-bold text-[#0A0F1C]">2</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Earn Yield</h3>
              <p className="text-[16px] text-[#1A1A1A]/70">
                Your funds generate yield through DeFi strategies. Whales 10%, retail 15%, students 75%.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-[#0052FF]" strokeWidth={2} />
                </div>
                <span className="text-[20px] font-bold text-[#0A0F1C]">3</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Vote Together</h3>
              <p className="text-[16px] text-[#1A1A1A]/70">
                Every 30 days, allocate your vault&apos;s yield to students. Pool voting power.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#0052FF]" strokeWidth={2} />
                </div>
                <span className="text-[20px] font-bold text-[#0A0F1C]">4</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Fund Students</h3>
              <p className="text-[16px] text-[#1A1A1A]/70">
                Students receive funding for research and education. Track progress and impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0052FF] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-[28px] font-bold text-white mb-4">Ready to make perpetual impact?</h2>
          <p className="text-[16px] text-white/90 mb-8 max-w-2xl mx-auto">
            Join {PLATFORM_STATS.activeDonors} donors supporting the next generation of LATAM leaders
          </p>
          {connectedAddress ? (
            <Link href="/start">
              <PrimaryButton variant="secondary" size="lg">
                Get Started
              </PrimaryButton>
            </Link>
          ) : (
            <PrimaryButton variant="secondary" size="lg">
              Connect Wallet to Start
            </PrimaryButton>
          )}
        </div>
      </section>
    </div>
  );
}

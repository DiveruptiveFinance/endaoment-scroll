"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Logo } from "~~/components/ui/Logo";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { StatsCard } from "~~/components/ui/StatsCard";
import { FlowDiagram } from "~~/components/ui/FlowDiagram";
import { PLATFORM_STATS } from "~~/data/constants";
import { UNIVERSITIES } from "~~/data/universities";

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
        router.push("/student/register");
      } else if (typeToUse === "donor") {
        router.push("/fund/universities");
      } else if (typeToUse === "university") {
        router.push("/university/register");
      }
    }
  }, [isConnected, userType, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Logo Centered */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Centered */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <StatsCard title="Total Donated" value={`$${PLATFORM_STATS.totalDonated.toLocaleString()}`} />
            <StatsCard title="Yield Generated" value={`$${PLATFORM_STATS.totalYieldGenerated.toLocaleString()}`} />
            <StatsCard title="Students Supported" value={PLATFORM_STATS.studentsSupported} />
          </div>

          {/* Elige tu camino - 3 Options */}
          {!isConnected ? (
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-8">Elige tu camino</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ① Universidad */}
                <ConnectButton.Custom>
                  {({ openConnectModal: openModal }) => {
                    return (
                      <button
                        onClick={() => {
                          setUserType("university");
                          if (typeof window !== "undefined") {
                            localStorage.setItem("userType", "university");
                          }
                          openModal();
                        }}
                        className="bg-white rounded-[6px] p-6 border-2 border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300 text-center group"
                      >
                        <div className="text-[32px] font-bold text-[#0052FF] mb-2">①</div>
                        <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Universidad</h3>
                        <p className="text-[14px] text-[#1A1A1A]/70">
                          Recibe yield y gestiona fondos
                        </p>
                      </button>
                    );
                  }}
                </ConnectButton.Custom>

                {/* ② Donador */}
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
                        className="bg-white rounded-[6px] p-6 border-2 border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300 text-center group"
                      >
                        <div className="text-[32px] font-bold text-[#0052FF] mb-2">②</div>
                        <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Donador</h3>
                        <p className="text-[14px] text-[#1A1A1A]/70">
                          Invierte y genera impacto perpetuo
                        </p>
                      </button>
                    );
                  }}
                </ConnectButton.Custom>

                {/* ③ Estudiante */}
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
                        className="bg-white rounded-[6px] p-6 border-2 border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300 text-center group"
                      >
                        <div className="text-[32px] font-bold text-[#0052FF] mb-2">③</div>
                        <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">Estudiante</h3>
                        <p className="text-[14px] text-[#1A1A1A]/70">
                          Regístrate y recibe fondos
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
                <Link href="/student/register">
                  <PrimaryButton size="lg">Ir a Registro</PrimaryButton>
                </Link>
              ) : userType === "donor" ||
                (typeof window !== "undefined" && localStorage.getItem("userType") === "donor") ? (
                <Link href="/fund/universities">
                  <PrimaryButton size="lg">Donar</PrimaryButton>
                </Link>
              ) : userType === "university" ||
                (typeof window !== "undefined" && localStorage.getItem("userType") === "university") ? (
                <Link href="/university/register">
                  <PrimaryButton size="lg">Registrar Universidad</PrimaryButton>
                </Link>
              ) : (
                <>
                  <Link href="/fund/universities">
                    <PrimaryButton size="lg">Donar</PrimaryButton>
                  </Link>
                  <Link href="/university/register">
                    <PrimaryButton size="lg" variant="secondary">
                      Universidad
                    </PrimaryButton>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Universidades con EnDAOment - Scrollable List */}
      <section className="bg-[#F8FAFC] py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-2">Universidades con EnDAOment</h2>
            <p className="text-[16px] text-[#1A1A1A]/70">Instituciones que están transformando la educación</p>
          </div>

          {/* Scrollable University Cards */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max md:grid md:grid-cols-3 md:min-w-0">
              {UNIVERSITIES.slice(0, 6).map(uni => (
                <div
                  key={uni.id}
                  className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] min-w-[280px] md:min-w-0 hover:border-[#0052FF] transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-[6px] bg-[#F8FAFC] border border-[#F2F4F7] flex items-center justify-center">
                      <span className="text-[18px] font-bold text-[#0052FF]">{uni.shortName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#0A0F1C]">{uni.shortName}</h3>
                      <p className="text-[12px] text-[#1A1A1A]/70">{uni.name}</p>
                    </div>
                  </div>
                  <Link href={`/fund/universities?university=${uni.id}`}>
                    <PrimaryButton size="sm" className="w-full">
                      Ver detalles
                    </PrimaryButton>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Flow Diagram */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <FlowDiagram />
        </div>
      </section>

    </div>
  );
}

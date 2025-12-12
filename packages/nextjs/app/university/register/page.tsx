"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { UNIVERSITIES } from "~~/data/universities";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function UniversityRegisterPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [selectedUniversityId, setSelectedUniversityId] = useState<string | null>(null);
  const [txState, setTxState] = useState<"idle" | "registering" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const { writeContractAsync: registerUniversity } = useScaffoldWriteContract("UniversityRegistry");

  // Check if university is already registered
  const { data: isRegistered } = useScaffoldReadContract({
    contractName: "UniversityRegistry",
    functionName: "isUniversityRegistered",
    args: selectedUniversityId ? [selectedUniversityId] : undefined,
  });

  const handleRegister = async () => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    if (!selectedUniversityId) {
      setError("Please select a university");
      return;
    }

    if (isRegistered) {
      setError("This university is already registered");
      return;
    }

    setError(null);
    setTxState("registering");

    try {
      await registerUniversity({
        functionName: "registerUniversity",
        args: [selectedUniversityId, address],
      });

      setTxState("success");
      setTimeout(() => {
        router.push("/university/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Transaction failed");
      setTxState("error");
    }
  };

  if (txState === "success") {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">University Registered!</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              Your university has been successfully registered. You will now receive yield distributions.
            </p>
            <p className="text-[14px] text-[#1A1A1A]/50 mt-4">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-8">University Registration</h1>
        <p className="text-[16px] text-[#1A1A1A]/70 mb-8">
          Select your university and connect your wallet to receive yield distributions from donations.
        </p>

        {/* University Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {UNIVERSITIES.map(uni => (
            <button
              key={uni.id}
              onClick={() => setSelectedUniversityId(uni.id)}
              className={`p-6 rounded-[6px] border-2 transition-all text-left ${
                selectedUniversityId === uni.id
                  ? "border-[#0052FF] bg-[#0052FF]/10"
                  : "border-[#F2F4F7] hover:border-[#0052FF]/50"
              }`}
            >
              <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">{uni.shortName}</h3>
              <p className="text-[14px] text-[#1A1A1A]/70">{uni.name}</p>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#FF5B5B]/10 border border-[#FF5B5B] rounded-[6px] p-4 mb-6">
            <p className="text-[14px] text-[#FF5B5B]">{error}</p>
          </div>
        )}

        {/* Loading */}
        {txState === "registering" && (
          <div className="bg-[#0052FF]/10 border border-[#0052FF] rounded-[6px] p-4 mb-6 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0052FF] mx-auto mb-2"></div>
            <p className="text-[14px] text-[#0052FF]">Registering university...</p>
          </div>
        )}

        {/* Register Button */}
        <PrimaryButton
          size="lg"
          className="w-full"
          onClick={handleRegister}
          disabled={txState === "registering" || !address || !selectedUniversityId || isRegistered}
        >
          {!address
            ? "Connect Wallet"
            : !selectedUniversityId
              ? "Select a University"
              : isRegistered
                ? "Already Registered"
                : txState === "registering"
                  ? "Registering..."
                  : "Register University"}
        </PrimaryButton>

        {!address && (
          <p className="text-[14px] text-[#1A1A1A]/70 text-center mt-4">
            Please connect your wallet to register your university
          </p>
        )}
      </div>
    </div>
  );
}

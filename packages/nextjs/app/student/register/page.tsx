"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { UNIVERSITIES } from "~~/data/universities";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { uploadFileToIpfs } from "~~/utils/ipfs";
import { TransactionState, getTransactionMessage, isLoadingState } from "~~/utils/transactionStates";

export default function StudentRegisterPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    researchArea: "", // faculty + career combined
    studentId: "", // enrollment ID
    idDocument: null as File | null,
    idDocumentHash: "",
    academicAchievements: 0,
    sportsAchievements: 0,
    studentAchievements: 0,
  });
  const [txState, setTxState] = useState<TransactionState>("idle");
  const [error, setError] = useState<string | null>(null);

  const { writeContractAsync: registerStudent } = useScaffoldWriteContract("StudentRegistry");

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadFileToIpfs(file);
      setFormData({ ...formData, idDocument: file, idDocumentHash: result.hash });
    } catch {
      setError("Failed to upload ID document");
    }
  };

  const handleSubmit = async () => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    // Validate
    if (!formData.name || !formData.university || !formData.researchArea || !formData.studentId) {
      setError("Please fill all required fields");
      return;
    }

    setError(null);
    setTxState("depositing");

    try {
      // Register student - Contract expects: name, university, researchArea, studentId, academicAchievements, sportsAchievements, studentAchievements
      await registerStudent({
        functionName: "registerStudent",
        args: [
          formData.name,
          formData.university,
          formData.researchArea,
          formData.studentId,
          BigInt(formData.academicAchievements),
          BigInt(formData.sportsAchievements),
          BigInt(formData.studentAchievements),
        ],
      });

      // Mint SBT (this should be done automatically by StudentRegistry, but for now we do it manually)
      // In production, StudentRegistry should mint the SBT after registration
      setTxState("success");

      setTimeout(() => {
        router.push("/student/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed");
      setTxState("error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-8">Student Registration</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? "bg-[#0052FF] text-white" : "bg-[#F2F4F7] text-[#1A1A1A]/70"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 ${step > s ? "bg-[#0052FF]" : "bg-[#F2F4F7]"}`} style={{ margin: "0 8px" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: University Selection */}
        {step === 1 && (
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <h2 className="text-[24px] font-bold text-[#0A0F1C] mb-6">Select Your University</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {UNIVERSITIES.map(uni => (
                <button
                  key={uni.id}
                  onClick={() => setFormData({ ...formData, university: uni.id })}
                  className={`p-4 rounded-[6px] border-2 transition-all text-left ${
                    formData.university === uni.id
                      ? "border-[#0052FF] bg-[#0052FF]/10"
                      : "border-[#F2F4F7] hover:border-[#0052FF]/50"
                  }`}
                >
                  <div className="relative w-12 h-12 mb-2">
                    {uni.logo ? (
                      <Image src={uni.logo} alt={uni.shortName} fill className="object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[20px] font-bold text-[#0052FF]">
                        {uni.shortName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-[14px] font-semibold">{uni.shortName}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <PrimaryButton onClick={() => setStep(2)} disabled={!formData.university}>
                Next →
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* Step 2: Personal Information */}
        {step === 2 && (
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <h2 className="text-[24px] font-bold text-[#0A0F1C] mb-6">Personal Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-semibold text-[#0A0F1C] mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] focus:border-[#0052FF] focus:outline-none"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#0A0F1C] mb-2">Research Area / Career *</label>
                <input
                  type="text"
                  value={formData.researchArea}
                  onChange={e => setFormData({ ...formData, researchArea: e.target.value })}
                  className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] focus:border-[#0052FF] focus:outline-none"
                  placeholder="e.g., Computer Science, Engineering"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#0A0F1C] mb-2">
                  Student ID / Enrollment Number *
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] focus:border-[#0052FF] focus:outline-none"
                  placeholder="e.g., ID#12345"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#0A0F1C] mb-2">Upload ID Document *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] focus:border-[#0052FF] focus:outline-none"
                />
                {formData.idDocument && (
                  <p className="text-[12px] text-[#1A1A1A]/70 mt-2">✓ {formData.idDocument.name}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <PrimaryButton variant="secondary" onClick={() => setStep(1)}>
                ← Back
              </PrimaryButton>
              <PrimaryButton
                onClick={() => setStep(3)}
                disabled={!formData.name || !formData.researchArea || !formData.studentId}
              >
                Next →
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* Step 3: Achievements */}
        {step === 3 && (
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <h2 className="text-[24px] font-bold text-[#0A0F1C] mb-6">Achievements</h2>
            <p className="text-[14px] text-[#1A1A1A]/70 mb-6">
              Select the number of achievements in each category. This affects your voting power.
            </p>

            <div className="space-y-6">
              {[
                { key: "academicAchievements", label: "Academic Achievements", value: formData.academicAchievements },
                { key: "sportsAchievements", label: "Sports Achievements", value: formData.sportsAchievements },
                { key: "studentAchievements", label: "Student Achievements", value: formData.studentAchievements },
              ].map(({ key, label, value }) => (
                <div key={key}>
                  <label className="block text-[14px] font-semibold text-[#0A0F1C] mb-2">{label}</label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <button
                        key={num}
                        onClick={() => setFormData({ ...formData, [key]: num } as any)}
                        className={`px-4 py-2 rounded-[6px] border-2 transition-all ${
                          value === num
                            ? "border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF] font-semibold"
                            : "border-[#F2F4F7] hover:border-[#0052FF]/50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-[#FF5B5B]/10 border border-[#FF5B5B] rounded-[6px] p-4 mt-6">
                <p className="text-[14px] text-[#FF5B5B]">{error}</p>
              </div>
            )}

            {isLoadingState(txState) && (
              <div className="bg-[#0052FF]/10 border border-[#0052FF] rounded-[6px] p-4 mt-6 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0052FF] mx-auto mb-2"></div>
                <p className="text-[14px] text-[#0052FF]">{getTransactionMessage(txState)}</p>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <PrimaryButton variant="secondary" onClick={() => setStep(2)}>
                ← Back
              </PrimaryButton>
              <PrimaryButton onClick={handleSubmit} disabled={isLoadingState(txState) || !address}>
                {!address
                  ? "Connect Wallet"
                  : isLoadingState(txState)
                    ? getTransactionMessage(txState)
                    : "Complete Registration"}
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

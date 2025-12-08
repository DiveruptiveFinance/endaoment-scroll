"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Award, CheckCircle2, Clock, DollarSign, FileText, Upload, Vote, XCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { getFundingClaim, getStudentDocuments, getStudentScore } from "~~/data/mockStudentFlow";
import { getFundingProgress, getStudentById } from "~~/data/students";
import { FundingClaim, StudentDocument, StudentScore } from "~~/types/student-flow";

// Force dynamic rendering to avoid static pre-rendering issues with useSearchParams
export const dynamic = "force-dynamic";

// Component that uses useSearchParams - must be wrapped in Suspense
function StudentDashboardContent() {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "funding" | "voting">("overview");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["overview", "documents", "funding", "voting"].includes(tab)) {
      setActiveTab(tab as "overview" | "documents" | "funding" | "voting");
    }
  }, [searchParams]);

  // Mock: Get student by wallet address (in real app, this would query the contract)
  const student = address ? getStudentById("1") : null; // Mock: using ID "1" for demo
  const documents = address ? getStudentDocuments("1") : [];
  const score = address ? getStudentScore("1") : null;
  const fundingClaim = address ? getFundingClaim("1") : null;

  if (!address) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Connect Your Wallet</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              Please connect your wallet to access your student dashboard
            </p>
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

  const getProgressColor = () => {
    if (progress < 25) return "#FF5B5B";
    if (progress < 50) return "#FF8C42";
    if (progress < 75) return "#FFCF72";
    return "#5CE27F";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          {/* Student Avatar */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#F2F4F7] flex-shrink-0">
            {student.avatarUrl ? (
              <Image src={student.avatarUrl} alt={student.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-[#0052FF]/10 flex items-center justify-center text-[24px] font-bold text-[#0052FF]">
                {student.name.charAt(0)}
              </div>
            )}
          </div>

          {/* University Logo */}
          {student.universityLogo && (
            <div className="relative w-12 h-12 rounded-[6px] overflow-hidden border border-[#F2F4F7] flex-shrink-0">
              <Image src={student.universityLogo} alt={student.university} fill className="object-contain p-1" />
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-2">{student.name}</h1>
            <p className="text-[16px] text-[#0052FF] font-semibold">{student.field}</p>
            <p className="text-[14px] text-[#1A1A1A]/70">{student.university}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#F2F4F7]">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 text-[16px] font-semibold border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-[#0052FF] text-[#0052FF]"
                : "border-transparent text-[#1A1A1A]/70 hover:text-[#0052FF]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-3 text-[16px] font-semibold border-b-2 transition-colors ${
              activeTab === "documents"
                ? "border-[#0052FF] text-[#0052FF]"
                : "border-transparent text-[#1A1A1A]/70 hover:text-[#0052FF]"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab("funding")}
            className={`px-6 py-3 text-[16px] font-semibold border-b-2 transition-colors ${
              activeTab === "funding"
                ? "border-[#0052FF] text-[#0052FF]"
                : "border-transparent text-[#1A1A1A]/70 hover:text-[#0052FF]"
            }`}
          >
            Funding
          </button>
          <button
            onClick={() => setActiveTab("voting")}
            className={`px-6 py-3 text-[16px] font-semibold border-b-2 transition-colors ${
              activeTab === "voting"
                ? "border-[#0052FF] text-[#0052FF]"
                : "border-transparent text-[#1A1A1A]/70 hover:text-[#0052FF]"
            }`}
          >
            Voting
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Funding Progress */}
            <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-5 h-5 text-[#0052FF]" strokeWidth={2} />
                <h2 className="text-[20px] font-bold text-[#0A0F1C]">Funding Progress</h2>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[16px] font-semibold text-[#0A0F1C]">Progress</span>
                <span className="text-[20px] font-bold text-[#0052FF]">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#F2F4F7] rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full transition-all duration-500"
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

            {/* Voting Score */}
            {score && (
              <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-[#0052FF]" strokeWidth={2} />
                  <h2 className="text-[20px] font-bold text-[#0A0F1C]">Voting Power Score</h2>
                </div>
                <div className="text-center mb-4">
                  <div className="text-[48px] font-bold text-[#0052FF] mb-2">{score.totalScore}</div>
                  <div className="text-[16px] text-[#1A1A1A]/70">Based on {score.documentsCount} documents</div>
                </div>
                <Link href="/student/proposals">
                  <PrimaryButton size="md" className="w-full">
                    Use Voting Power
                  </PrimaryButton>
                </Link>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/student/documents" className="block">
                <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <Upload className="w-5 h-5 text-[#0052FF]" strokeWidth={2} />
                    <h3 className="text-[18px] font-bold text-[#0A0F1C]">Upload Documents</h3>
                  </div>
                  <p className="text-[14px] text-[#1A1A1A]/70">
                    Upload grades, papers, and work to increase your voting power
                  </p>
                </div>
              </Link>

              {fundingClaim && fundingClaim.status === "approved" && (
                <Link href="/student/claim" className="block">
                  <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="w-5 h-5 text-[#5CE27F]" strokeWidth={2} />
                      <h3 className="text-[18px] font-bold text-[#0A0F1C]">Claim Funding</h3>
                    </div>
                    <p className="text-[14px] text-[#1A1A1A]/70">
                      Claim ${fundingClaim.amount.toLocaleString()} {fundingClaim.token} available
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {activeTab === "documents" && <DocumentsTab documents={documents} />}

        {activeTab === "funding" && (
          <FundingTab
            student={student}
            progress={progress}
            getProgressColor={getProgressColor}
            fundingClaim={fundingClaim}
          />
        )}

        {activeTab === "voting" && <VotingTab score={score} />}
      </div>
    </div>
  );
}

// Documents Tab Component
function DocumentsTab({ documents }: { documents: StudentDocument[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[28px] font-bold text-[#0A0F1C]">My Documents</h2>
        <Link href="/student/documents/upload">
          <PrimaryButton size="md">
            <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
            Upload Document
          </PrimaryButton>
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
          <FileText className="w-12 h-12 text-[#1A1A1A]/30 mx-auto mb-4" strokeWidth={2} />
          <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">No Documents Yet</h3>
          <p className="text-[16px] text-[#1A1A1A]/70 mb-6">Upload documents to increase your voting power score</p>
          <Link href="/student/documents/upload">
            <PrimaryButton size="md">Upload Your First Document</PrimaryButton>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-[6px] bg-[#0052FF]/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#0052FF]" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[18px] font-bold text-[#0A0F1C] mb-1">{doc.title}</h3>
                    {doc.description && <p className="text-[14px] text-[#1A1A1A]/70 mb-2">{doc.description}</p>}
                    <div className="flex items-center gap-4 text-[13px] text-[#1A1A1A]/60">
                      <span className="capitalize">{doc.type}</span>
                      <span>•</span>
                      <span>{doc.uploadedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {doc.status === "approved" && doc.score !== undefined && (
                    <div className="text-right">
                      <div className="text-[20px] font-bold text-[#0052FF]">{doc.score}</div>
                      <div className="text-[12px] text-[#1A1A1A]/60">Score</div>
                    </div>
                  )}
                  {doc.status === "approved" && <CheckCircle2 className="w-5 h-5 text-[#5CE27F]" strokeWidth={2} />}
                  {doc.status === "pending" && <Clock className="w-5 h-5 text-[#FFCF72]" strokeWidth={2} />}
                  {doc.status === "rejected" && <XCircle className="w-5 h-5 text-[#FF5B5B]" strokeWidth={2} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Funding Tab Component
function FundingTab({
  student,
  progress,
  getProgressColor,
  fundingClaim,
}: {
  student: any;
  progress: number;
  getProgressColor: () => string;
  fundingClaim: FundingClaim | null;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-6">Funding Status</h2>

      {/* Funding Progress */}
      <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-4">
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

      {/* Claim Section */}
      {fundingClaim && (
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
          <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Available to Claim</h3>
          <div className="bg-[#F2F4F7] rounded-[6px] p-4 mb-4">
            <div className="text-[32px] font-bold text-[#0052FF] mb-1">
              ${fundingClaim.amount.toLocaleString()} {fundingClaim.token}
            </div>
            <div className="text-[14px] text-[#1A1A1A]/70">
              Status: <span className="font-semibold capitalize">{fundingClaim.status}</span>
            </div>
          </div>
          {fundingClaim.status === "approved" && (
            <Link href="/student/claim">
              <PrimaryButton size="md" className="w-full">
                Claim Funds
              </PrimaryButton>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Voting Tab Component
function VotingTab({ score }: { score: StudentScore | null }) {
  if (!score) {
    return (
      <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
        <Vote className="w-12 h-12 text-[#1A1A1A]/30 mx-auto mb-4" strokeWidth={2} />
        <h3 className="text-[20px] font-bold text-[#0A0F1C] mb-2">No Voting Power Yet</h3>
        <p className="text-[16px] text-[#1A1A1A]/70 mb-6">Upload documents to earn voting power</p>
        <Link href="/student/documents/upload">
          <PrimaryButton size="md">Upload Documents</PrimaryButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
        <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Your Voting Power</h2>
        <div className="text-center mb-6">
          <div className="text-[48px] font-bold text-[#0052FF] mb-2">{score.totalScore}</div>
          <div className="text-[16px] text-[#1A1A1A]/70">Total Voting Power Score</div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#1A1A1A]/70">Average Document Score</span>
            <span className="text-[16px] font-semibold text-[#0A0F1C]">{score.averageDocumentScore.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#1A1A1A]/70">Documents Count</span>
            <span className="text-[16px] font-semibold text-[#0A0F1C]">{score.documentsCount}</span>
          </div>
        </div>
        <Link href="/student/proposals">
          <PrimaryButton size="md" className="w-full">
            View Proposals & Vote
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function StudentDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }>
      <StudentDashboardContent />
    </Suspense>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { StudentCard } from "~~/components/miniapp/StudentCard";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { getFundingProgress, getStudentById } from "~~/data/students";

export default function StudentDetailPage() {
  const params = useParams();
  const student = getStudentById(params.id as string);

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
          <p className="text-[16px] text-[#FF5B5B]">Student not found</p>
        </div>
        <Link href="/" className="inline-block mt-4 text-[#0052FF] hover:text-[#0040CC] transition-colors">
          ← Back to Students
        </Link>
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Link href="/" className="inline-block mb-6 text-[#0052FF] hover:text-[#0040CC] transition-colors">
          ← Back to Students
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left column: Student card */}
          <div className="md:col-span-1">
            <StudentCard student={student} showDonateButton={false} />
          </div>

          {/* Right column: Extended details */}
          <div className="md:col-span-2">
            {/* Header with images */}
            <div className="flex items-start gap-4 mb-6">
              {/* Student Avatar */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#F2F4F7] flex-shrink-0">
                {student.avatarUrl ? (
                  <Image
                    src={student.avatarUrl}
                    alt={student.name}
                    fill
                    className="object-cover"
                    onError={e => {
                      // Fallback to initial if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full bg-[#0052FF]/10 flex items-center justify-center text-[32px] font-bold text-[#0052FF]"
                  style={{ display: student.avatarUrl ? "none" : "flex" }}
                >
                  {student.name.charAt(0)}
                </div>
              </div>

              {/* University Logo */}
              {student.universityLogo && (
                <div className="relative w-16 h-16 rounded-[6px] overflow-hidden border border-[#F2F4F7] flex-shrink-0">
                  <Image
                    src={student.universityLogo}
                    alt={student.university}
                    fill
                    className="object-contain p-1"
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
                  {student.isVerified && <CheckCircle2 className="w-5 h-5 text-[#5CE27F]" strokeWidth={2} />}
                </div>
                <p className="text-[20px] font-semibold text-[#0052FF] mb-1">{student.field}</p>
                <p className="text-[16px] text-[#1A1A1A]/70">{student.university}</p>
              </div>
            </div>

            {/* Funding Progress Bar - Lateral/Inferior */}
            <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[16px] font-semibold text-[#0A0F1C]">Funding Progress</span>
                <span className="text-[16px] font-bold text-[#0052FF]">{progress.toFixed(1)}%</span>
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
              <div className="flex justify-between text-[13px] text-[#1A1A1A]/70">
                <span>${student.currentFunding.toLocaleString()} raised</span>
                <span>Goal: ${student.fundingGoalUsd.toLocaleString()}</span>
              </div>
            </div>

            {/* Full bio */}
            <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
              <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">About</h2>
              <p className="text-[16px] text-[#1A1A1A]/70 leading-relaxed">{student.bio}</p>
            </div>

            {/* Impact metrics */}
            <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mb-6">
              <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Impact Metrics</h2>
              <div className="space-y-4">
                {student.impactMetrics.map((metric, idx) => (
                  <div key={idx} className="border-l-4 border-[#0052FF] pl-4 py-2">
                    <h3 className="text-[16px] font-semibold text-[#0A0F1C] mb-1">{metric.title}</h3>
                    {metric.description && <p className="text-[14px] text-[#1A1A1A]/70 mb-1">{metric.description}</p>}
                    {metric.date && <p className="text-[13px] text-[#1A1A1A]/60">{metric.date}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link href={`/donate/${student.id}`} className="block">
              <PrimaryButton size="lg" className="w-full">
                Fund {student.name}&apos;s Education
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

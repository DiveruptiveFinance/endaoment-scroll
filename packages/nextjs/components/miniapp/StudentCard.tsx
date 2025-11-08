"use client";

import Link from "next/link";
import { UI_CONFIG } from "../../data/constants";
import { getFundingProgress } from "../../data/students";
import { Student } from "../../types/student";
import { PrimaryButton } from "../ui/PrimaryButton";
import { CheckCircle2, GraduationCap, MapPin } from "lucide-react";

interface StudentCardProps {
  student: Student;
  showDonateButton?: boolean;
}

/**
 * StudentCard Component - Minimalist Institutional Style
 * Displays a student profile card with funding progress and impact metrics
 */
export function StudentCard({ student, showDonateButton = true }: StudentCardProps) {
  const progress = getFundingProgress(student);

  // Determine progress bar color based on funding level
  const getProgressColor = () => {
    if (progress < 25) return "#FF5B5B"; // Red
    if (progress < 75) return "#FFCF72"; // Orange
    return "#5CE27F"; // Green
  };

  return (
    <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] hover:bg-[rgba(0,82,255,0.02)] transition-all duration-300">
      {/* Header with name and verified badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[20px] font-bold text-[#0A0F1C]">{student.name}</h3>
            {student.isVerified && <CheckCircle2 className="w-4 h-4 text-[#5CE27F]" strokeWidth={2} />}
          </div>
          <p className="text-[16px] font-semibold text-[#0052FF] mb-2">{student.field}</p>
        </div>
        <span className="text-[13px] font-medium text-[#1A1A1A] bg-[#F2F4F7] px-2 py-1 rounded-[6px]">
          {student.category}
        </span>
      </div>

      {/* University and country */}
      <div className="flex items-center gap-2 text-[13px] text-[#1A1A1A]/70 mb-2">
        <GraduationCap className="w-4 h-4" strokeWidth={2} />
        <span>{student.university}</span>
      </div>
      <div className="flex items-center gap-2 text-[13px] text-[#1A1A1A]/70 mb-4">
        <MapPin className="w-4 h-4" strokeWidth={2} />
        <span>{student.country}</span>
      </div>

      {/* Bio excerpt */}
      <p className="text-[16px] text-[#1A1A1A]/70 line-clamp-2 mb-4">{student.bio}</p>

      {/* Funding progress */}
      <div className="mb-4">
        <div className="flex justify-between text-[13px] mb-2">
          <span className="font-semibold text-[#1A1A1A]">Funding Progress</span>
          <span className="text-[#1A1A1A]/70">
            ${student.currentFunding.toLocaleString()} / ${student.fundingGoal.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-[#F2F4F7] rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: getProgressColor(),
            }}
          />
        </div>
        <div className="text-[13px] text-[#1A1A1A]/60 mt-1">{progress.toFixed(1)}% funded</div>
      </div>

      {/* Action button */}
      {showDonateButton && (
        <Link href={`/donate/${student.id}`} className="block">
          <PrimaryButton size="sm" className="w-full">
            Fund Student
          </PrimaryButton>
        </Link>
      )}
    </div>
  );
}

"use client";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
      <div className="text-[13px] font-medium text-[#1A1A1A] mb-2">{title}</div>
      <div className="text-[28px] font-bold text-[#0A0F1C] mb-1">{value}</div>
      {description && <div className="text-[13px] text-[#1A1A1A]/70">{description}</div>}
    </div>
  );
}

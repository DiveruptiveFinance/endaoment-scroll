"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLink?: boolean;
}

export function Logo({ className = "", size = "md", showLink = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-[20px]",
    md: "text-[24px]",
    lg: "text-[36px]",
  };

  const logoContent = (
    <div className={`inline-flex items-center gap-0.5 font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-[#0A0F1C] lowercase">en</span>
      <span className="bg-[#0052FF] text-white px-2 py-0.5 rounded-[4px] font-bold uppercase leading-tight">DAO</span>
      <span className="text-[#0A0F1C] lowercase">ment</span>
    </div>
  );

  if (showLink) {
    return (
      <Link href="/" className="inline-block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

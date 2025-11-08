"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function PrimaryButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: PrimaryButtonProps) {
  const baseClasses = "font-semibold rounded-[6px] transition-all duration-300 ease-in-out";

  const variantClasses = {
    primary:
      "bg-[#0052FF] text-white hover:bg-[#0040CC] hover:shadow-[0_4px_12px_rgba(0,82,255,0.1)] hover:-translate-y-[1px]",
    secondary: "bg-white text-[#0052FF] border border-[#0052FF] hover:bg-[rgba(0,82,255,0.05)]",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

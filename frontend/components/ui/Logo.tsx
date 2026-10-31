"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Logo({
  size = "md",
  showWordmark = true,
  className = "",
  onClick,
}: LogoProps) {
  const dimensions = {
    xs: { w: 18, h: 20, text: "text-xs tracking-[0.14em]" },
    sm: { w: 22, h: 24, text: "text-sm tracking-[0.14em]" },
    md: { w: 26, h: 29, text: "text-sm tracking-[0.16em]" },
    lg: { w: 32, h: 35, text: "text-base tracking-[0.16em]" },
    xl: { w: 42, h: 46, text: "text-xl tracking-[0.18em]" },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? "cursor-pointer group" : ""
      } ${className}`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/deepaq-logo.png"
          alt="DEEPAQ"
          width={dimensions.w}
          height={dimensions.h}
          priority
          className="object-contain transition-transform group-hover:scale-105"
        />
      </div>

      {showWordmark && (
        <span
          className={`font-bold font-sans text-[#F1F0E9] ${dimensions.text} transition-colors group-hover:text-[#A5B39A]`}
        >
          DEEPAQ
        </span>
      )}
    </div>
  );
}

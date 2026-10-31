import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerBadge?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: "default" | "highlight" | "danger" | "emerald";
  footer?: React.ReactNode;
  id?: string;
}

export function GlassCard({
  children,
  className = "",
  headerTitle,
  headerSubtitle,
  headerBadge,
  headerAction,
  variant = "default",
  footer,
  id,
}: GlassCardProps) {
  const variantStyles = {
    default: "border-[#30312C] bg-[#191A17]",
    highlight: "border-[#7E92A0]/30 bg-[#191A17]",
    emerald: "border-[#A5B39A]/25 bg-[#191A17]",
    danger: "border-[#C26765]/30 bg-[#191A17]",
  }[variant];

  return (
    <section
      id={id}
      className={`relative rounded-lg border transition-all ${variantStyles} ${className}`}
    >
      {(headerTitle || headerAction || headerBadge || headerSubtitle) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30312C] px-5 sm:px-6 py-4 bg-[#191A17]">
          <div>
            {headerSubtitle && (
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A5A69E]">
                {headerSubtitle}
              </p>
            )}
            {headerTitle && (
              <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[#F1F0E9] flex items-center gap-2 mt-0.5">
                {headerTitle}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerBadge}
            {headerAction}
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6">{children}</div>

      {footer && (
        <div className="border-t border-[#30312C] px-5 sm:px-6 py-3 bg-[#151613] text-xs font-mono text-[#A5A69E]">
          {footer}
        </div>
      )}
    </section>
  );
}

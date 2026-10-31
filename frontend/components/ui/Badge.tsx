import React from "react";

type BadgeVariant =
  | "emerald"
  | "cyan"
  | "amber"
  | "rose"
  | "purple"
  | "slate"
  | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  emerald:
    "bg-[#A5B39A]/12 text-[#A5B39A] border-[#A5B39A]/30 border",
  cyan:
    "bg-[#7E92A0]/12 text-[#7E92A0] border-[#7E92A0]/30 border",
  amber:
    "bg-[#C4A977]/12 text-[#C4A977] border-[#C4A977]/30 border",
  rose:
    "bg-[#C26765]/12 text-[#C26765] border-[#C26765]/30 border",
  purple:
    "bg-[#9E7B9B]/12 text-[#9E7B9B] border-[#9E7B9B]/30 border",
  slate:
    "bg-[#20211E] text-[#A5A69E] border-[#30312C] border",
  outline:
    "bg-transparent text-[#A5A69E] border border-[#30312C] hover:border-[#A5A69E]/40",
};

export function Badge({
  children,
  variant = "slate",
  size = "sm",
  className = "",
  icon,
}: BadgeProps) {
  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 tracking-wider font-mono font-medium"
      : "text-[11px] px-2.5 py-1 tracking-wider font-mono font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded uppercase transition-colors ${sizeClasses} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

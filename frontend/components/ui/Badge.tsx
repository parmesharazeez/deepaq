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
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 border",
  cyan:
    "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 border",
  amber:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 border",
  rose:
    "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 border",
  purple:
    "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 border",
  slate:
    "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] border",
  outline:
    "bg-transparent text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)]",
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
      ? "text-[10px] px-2 py-0.5 tracking-wider font-mono font-medium rounded-md"
      : "text-[11px] px-2.5 py-1 tracking-wider font-mono font-medium rounded-lg";

  return (
    <span
      className={`inline-flex items-center gap-1.5 uppercase transition-colors ${sizeClasses} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

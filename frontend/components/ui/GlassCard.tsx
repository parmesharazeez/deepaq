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
    default: "border-[var(--border-subtle)] bg-[var(--bg-secondary)]",
    highlight: "border-[var(--accent-secondary)]/30 bg-[var(--bg-secondary)]",
    emerald: "border-[var(--accent-primary)]/30 bg-[var(--bg-secondary)]",
    danger: "border-[#C26765]/30 bg-[var(--bg-secondary)]",
  }[variant];

  return (
    <section
      id={id}
      className={`relative rounded-2xl border transition-all ${variantStyles} ${className} shadow-xs text-[var(--text-primary)]`}
    >
      {(headerTitle || headerAction || headerBadge || headerSubtitle) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-5 sm:px-6 py-4 bg-[var(--surface-elevated)] rounded-t-2xl">
          <div>
            {headerSubtitle && (
              <p className="text-[10px] font-mono font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {headerSubtitle}
              </p>
            )}
            {headerTitle && (
              <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--text-primary)] flex items-center gap-2 mt-0.5">
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
        <div className="border-t border-[var(--border-subtle)] px-5 sm:px-6 py-3.5 bg-[var(--surface-elevated)] rounded-b-2xl">
          {footer}
        </div>
      )}
    </section>
  );
}

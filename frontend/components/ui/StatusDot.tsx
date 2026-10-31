import React from "react";

interface StatusDotProps {
  status?: "online" | "warning" | "error" | "offline" | "pulse";
  size?: "sm" | "md";
  className?: string;
}

export function StatusDot({
  status = "online",
  size = "sm",
  className = "",
}: StatusDotProps) {
  const dotColor = {
    online: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
    offline: "bg-[var(--text-muted)]",
    pulse: "bg-blue-500",
  }[status];

  const sizeClass = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";

  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <span className={`rounded-full ${dotColor} ${sizeClass}`} />
    </span>
  );
}

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
    online: "bg-[#A5B39A]",
    warning: "bg-[#C4A977]",
    error: "bg-[#C26765]",
    offline: "bg-[#70716A]",
    pulse: "bg-[#7E92A0]",
  }[status];

  const ringColor = {
    online: "bg-[#A5B39A]/25",
    warning: "bg-[#C4A977]/25",
    error: "bg-[#C26765]/25",
    offline: "bg-[#70716A]/15",
    pulse: "bg-[#7E92A0]/25",
  }[status];

  const sizeClass = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";
  const ringSizeClass = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      {status !== "offline" && (
        <span
          className={`absolute rounded-full opacity-60 animate-ping ${ringColor} ${ringSizeClass}`}
        />
      )}
      <span className={`relative rounded-full ${dotColor} ${sizeClass}`} />
    </span>
  );
}

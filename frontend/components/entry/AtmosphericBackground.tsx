"use client";

import React from "react";

export function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#111210]">
      {/* Subtle, restrained atmospheric gradient with warm mineral undertones */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(165,179,154,0.04),transparent_70%)]" />

      {/* Gentle horizontal vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,#111210_95%)]" />
    </div>
  );
}

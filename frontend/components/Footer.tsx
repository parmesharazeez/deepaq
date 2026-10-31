"use client";

import React from "react";
import { PILOT_METADATA } from "../lib/constants";
import { Logo } from "./ui/Logo";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-8 px-4 sm:px-6 text-xs text-[var(--text-muted)]">
      <div className="max-w-[1550px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Logo size="sm" />
          <p className="mt-2 text-xs text-[var(--text-secondary)] max-w-md leading-relaxed">
            DEEPAQ is an AI-powered environmental intelligence platform providing real-time multi-basin air quality monitoring and machine-learning aerosol predictions across India.
          </p>
          <p className="mt-1 text-[11px] font-mono text-[var(--text-muted)]">
            Reference domain: {PILOT_METADATA.city}, India ({PILOT_METADATA.latitude}° N, {PILOT_METADATA.longitude}° E) · Open-Meteo & CPCB Baseline
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-2 text-xs">
          <div className="flex flex-wrap gap-4 text-[var(--text-secondary)] font-mono text-[11px]">
            <span>16 Basins Monitored</span>
            <span>·</span>
            <span>RandomForest Regressor</span>
            <span>·</span>
            <span>MAE ±2.962 µg/m³</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            For situational awareness & personal exposure mitigation · Open environmental data
          </p>
        </div>
      </div>
    </footer>
  );
}

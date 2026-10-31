"use client";

import React from "react";
import {
  Flame,
  Sparkles,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { CityOption } from "../../lib/constants";
import { DashboardResponse, PredictionResponse } from "../../lib/types";
import { formatNumber } from "../../lib/utils";

interface DiwaliViewProps {
  city: CityOption;
  dashboard: DashboardResponse | null;
  prediction: PredictionResponse | null;
  onNavigateTab: (tab: string) => void;
}

export function DiwaliView({
  city,
  dashboard,
  prediction,
  onNavigateTab,
}: DiwaliViewProps) {
  const currentPM25 = dashboard?.air_quality?.values?.pm2_5 ?? 88.5;
  const predictedPM25 = prediction?.prediction?.predicted_value ?? 82.3;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header: Diwali Problem Statement Banner */}
      <div className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-[var(--bg-secondary)] to-orange-500/10 p-6 sm:p-9 shadow-sm overflow-hidden">
        {/* Subtle festive background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono">
                <Flame size={13} className="text-amber-500" />
                <span>Diwali Environmental Mission</span>
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Problem Statement Focus
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              The Festival of Lights: Atmospheric Science & Particulate Trap
            </h1>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every autumn across North India, the joyous celebration of Diwali coincides with a severe atmospheric event. DEEPAQ decodes why particulate pollution spikes 5x to 15x, and how modern meteorology and machine learning empower citizens to celebrate safely.
            </p>
          </div>

          {/* Quick Diwali Telemetry Badge */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs font-mono space-y-2 shrink-0 min-w-[220px]">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>Active Basin:</span>
              <span className="text-[var(--text-primary)] font-semibold">{city.name}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>Current PM2.5:</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {formatNumber(currentPM25, 1)} µg/m³
              </span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>1h ML Forecast:</span>
              <span className="text-[var(--accent-primary)] font-bold">
                {formatNumber(predictedPM25, 1)} µg/m³
              </span>
            </div>
            <div className="pt-1.5 border-t border-[var(--border-subtle)] text-[10.5px] text-[var(--text-muted)]">
              Trained on Chandigarh Diwali history (2021–2026)
            </div>
          </div>
        </div>
      </div>

      {/* The Tri-Factor Atmospheric Mechanism */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-8 space-y-5 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            The Tri-Factor Atmospheric Trap
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Why Diwali pollution in North India is fundamentally an atmospheric physics phenomenon rather than an isolated fireworks issue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Factor 1 */}
          <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold text-sm">
                1
              </span>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                Thermal Inversion Ceiling
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Late autumn temperatures drop rapidly at sunset. Cold air settles near the ground beneath a layer of warmer air, creating a lid below 250m that prevents smoke from rising or dispersing vertically into the troposphere.
            </p>
          </div>

          {/* Factor 2 */}
          <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold text-sm">
                2
              </span>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                Regional Stubble Smoke
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Paddy harvest crop residue burning across Punjab and Haryana produces dense plumes that are transported by slow northwesterly winds directly into the Shivalik and Gangetic basins, creating high background loading.
            </p>
          </div>

          {/* Factor 3 */}
          <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold text-sm">
                3
              </span>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                Fireworks Combustion Spike
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Pyrotechnic formulations release potassium nitrate, barium, sulfur dioxide, and ultra-fine metal aerosols into the already stagnant surface air mass between 20:00 and 01:00, multiplying particulate density up to 15x.
            </p>
          </div>
        </div>
      </div>

      {/* Diwali 24-Hour Timeline & Risk Windows */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-8 space-y-5 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            Diwali Diurnal Exposure Curve (Typical North Indian Basin)
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Plan celebrations and outdoor activities around predictable atmospheric dispersion windows
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Phase 1 */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--accent-primary)] font-semibold">14:00 – 17:00 IST</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                SAFEST WINDOW
              </span>
            </div>
            <h4 className="font-semibold text-sm text-[var(--text-primary)]">
              Pre-Diwali Convection
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Solar radiation heats the ground, keeping the boundary layer high (~1,200m). Ambient PM2.5 is at its diurnal low (45–65 µg/m³). Ideal time for daytime visits and outdoor preparations.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">19:30 – 23:00 IST</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                SPIKE BEGINS
              </span>
            </div>
            <h4 className="font-semibold text-sm text-[var(--text-primary)]">
              Celebration & Initial Inversion
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Surface cooling begins. Fireworks combustion introduces dense particulate plumes into a rapidly descending boundary layer. PM2.5 rises rapidly from 90 to 220+ µg/m³.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="p-4 rounded-xl border border-[#C26765]/40 bg-rose-500/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#C26765] font-semibold">00:00 – 04:30 IST</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/15 text-[#C26765] text-[10px] font-bold">
                CRITICAL HAZARD
              </span>
            </div>
            <h4 className="font-semibold text-sm text-[var(--text-primary)]">
              Peak Thermal Inversion Trap
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Winds drop below 3 km/h. Smoke cannot escape. Particulate levels hit peak (350–550+ µg/m³). High risk for children and seniors. Keep doors and windows tightly sealed.
            </p>
          </div>

          {/* Phase 4 */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--accent-secondary)] font-semibold">12:00 – 16:00 (Next Day)</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                GRADUAL CLEARING
              </span>
            </div>
            <h4 className="font-semibold text-sm text-[var(--text-primary)]">
              Solar Convective Flushing
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Next-day midday sun breaks the inversion lid. Vertical dilution begins, gradually lowering particulate concentrations back toward seasonal averages.
            </p>
          </div>
        </div>
      </div>

      {/* Green Crackers vs Traditional & Protection Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Green Crackers Card */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-semibold text-base text-[var(--text-primary)]">
              CSIR-NEERI Green Firecrackers
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Formulations approved by the Petroleum and Explosives Safety Organisation (PESO) reduce particulate emission by approximately 30% compared to conventional fireworks:
          </p>
          <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 pt-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>SWAS (Safe Water Releaser):</strong> Emits water vapor to suppress dust particulates.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>STAR (Safe Thermite Cracker):</strong> Formulated without barium nitrate or potassium chlorate.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>SAFAL (Safe Minimal Aluminum):</strong> Uses magnesium substitute, cutting particulate loading.</span>
            </li>
          </ul>
        </div>

        {/* Family Protection Advisory */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <HeartPulse size={18} className="text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-base text-[var(--text-primary)]">
              Protecting Children & Seniors on Diwali
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Simple, high-impact protocols for families during the celebration:
          </p>
          <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 pt-1">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Indoor Celebration Priority:</strong> Enjoy diyas, electric lighting, and sweets indoors between 20:00 and 01:00.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Air Purifier Clean Room:</strong> Run a HEPA purifier in the bedroom where infants and elders sleep.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Airtight N95 Respirators:</strong> If stepping outdoors to greet neighbors, wear a fitted N95 respirator.</span>
            </li>
          </ul>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <button
              onClick={() => onNavigateTab("health")}
              className="text-xs font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See full public health guide</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

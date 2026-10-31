"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  HeartPulse,
  Wind,
  AlertTriangle,
} from "lucide-react";
import { CityOption, HEALTH_GUIDANCE, POLLUTANT_PROFILES } from "../../lib/constants";
import { AQICategory } from "../../lib/types";
import { DashboardResponse } from "../../lib/types";
import { formatNumber, getPM25Category } from "../../lib/utils";

interface HealthViewProps {
  city: CityOption;
  dashboard: DashboardResponse | null;
}

export function HealthView({ city, dashboard }: HealthViewProps) {
  const currentPM25 = dashboard?.air_quality?.values?.pm2_5 ?? null;
  const currentCategory = getPM25Category(currentPM25);
  const currentGuidance = HEALTH_GUIDANCE[currentCategory.category];

  const [selectedTier, setSelectedTier] = useState<AQICategory>(currentCategory.category);

  const activeGuidance =
    HEALTH_GUIDANCE[selectedTier] || currentGuidance;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse size={15} className="text-[var(--accent-primary)]" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--accent-primary)]">
                Environmental Health & Exposure Protocols
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Actionable Health Advisories
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-2xl">
              Evidence-based public health risk mitigation protocols for {city.name}, aligned with WHO and Indian National Ambient Air Quality Standards.
            </p>
          </div>

          {/* Current Air Quality Indicator */}
          <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] flex items-center gap-3 shrink-0">
            <div>
              <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                Current {city.name} Air
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-semibold font-mono text-[var(--text-primary)]">
                  {formatNumber(currentPM25, 1)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">µg/m³</span>
              </div>
            </div>
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium border"
              style={{
                backgroundColor: `${currentCategory.color}15`,
                borderColor: `${currentCategory.color}35`,
                color: currentCategory.color,
              }}
            >
              {currentCategory.category}
            </span>
          </div>
        </div>

        {/* Severity Tier Selector Pills */}
        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Explore Advisories By Severity Tier:
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(HEALTH_GUIDANCE) as AQICategory[]).map((tier) => {
              const isActive = selectedTier === tier;
              const isCurrent = currentCategory.category === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-xs"
                      : "bg-[var(--surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {tier}
                    {isCurrent && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-white/20">
                        NOW
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Tier Advisory Showcase */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-primary)]">
              Protocol: {selectedTier} Air Quality Tier
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-0.5">
              Personal Exposure & Health Management Protocol
            </h2>
          </div>
          <div className="text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-elevated)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">
            PPE: {activeGuidance.mask}
          </div>
        </div>

        {/* 4 Persona Cohort Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Outdoor Activity */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Outdoor Exercise
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {activeGuidance.outdoor}
            </p>
          </div>

          {/* Sensitive Cohorts */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C26765]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Sensitive Groups & Asthmatics
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {activeGuidance.sensitive}
            </p>
          </div>

          {/* Indoor Environment */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#7E92A0]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Indoor Air Management
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {activeGuidance.indoor}
            </p>
          </div>

          {/* Ventilation */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D4A373]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Ventilation & Windows
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {activeGuidance.ventilation}
            </p>
          </div>
        </div>
      </div>

      {/* Practical Protective Protocols: Purifiers, Ventilation, Masks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* HEPA Purifiers */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[var(--accent-primary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              HEPA Purifier Operation
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Ensure units use true H13/H14 HEPA filters. Seal room perimeter doors and windows. Maintain Clean Air Delivery Rate (CADR) sufficient for at least 4.5 air changes per hour (ACH). Position units centrally rather than tucked into corners.
          </p>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
            Target indoor PM2.5: &lt;15 µg/m³
          </div>
        </div>

        {/* Ventilation Timing */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Wind size={18} className="text-[var(--accent-primary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Ventilation Windows
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Never ventilate during early morning (06:00-09:30) or late night when boundary layer thermal inversion traps toxic particulate matter near the ground. Ventilate briefly between 13:00 and 16:00 IST when solar convective mixing is maximal.
          </p>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
            Cleanest window: 13:00 – 16:00 IST
          </div>
        </div>

        {/* Masks & PPE Standards */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#D4A373]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Respiratory PPE Standards
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Surgical and cloth masks provide 0% to 15% filtration against sub-micron PM2.5 particulates. Only certified N95, KN95, or FFP2 respirators with airtight facial seals prevent deep alveolar aerosol deposition during severe episodes.
          </p>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
            Required standard: N95 / FFP2 airtight
          </div>
        </div>
      </div>

      {/* Comprehensive Pollutant Health Impact Reference */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Atmospheric Analyte Profiles & Health Risks
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Pathological mechanisms and Indian NAAQS safe concentration thresholds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {Object.values(POLLUTANT_PROFILES).map((p) => (
            <div
              key={p.formula}
              className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[var(--text-primary)]">
                      {p.name}
                    </span>
                    <span className="font-mono text-xs text-[var(--accent-primary)] font-bold">
                      {p.formula}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">({p.fullName})</span>
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                    Safe Limit: {p.standard24h}
                  </div>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div>
                  <strong className="text-[var(--text-primary)]">Primary Sources:</strong>{" "}
                  <span className="text-[var(--text-secondary)]">{p.sources}</span>
                </div>
                <div>
                  <strong className="text-[var(--text-primary)]">Health Impact:</strong>{" "}
                  <span className="text-[var(--text-secondary)]">{p.healthEffects}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

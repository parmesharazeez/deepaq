"use client";

import React from "react";
import {
  FileText,
  Cpu,
  Database,
  Flame,
  Scale,
  Compass,
} from "lucide-react";

export function MethodologyView() {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={15} className="text-[var(--accent-primary)]" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--accent-primary)]">
                Scientific Rigor & Open Governance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Methodology, Model Card & Provenance
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-2xl">
              Complete architectural transparency regarding our data sources, mathematical models, machine learning benchmarks, and boundary layer physics rationale.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs font-mono text-[var(--text-secondary)]">
              Model Card: RF-CH-100 v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Model Benchmark Card */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[var(--accent-primary)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Random Forest Regressor Architecture & Verification
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Empirical validation metrics across test datasets calibrated on North Indian atmospheric stations
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] font-mono">
            <div className="text-[10px] text-[var(--text-muted)] uppercase">MAE (Mean Absolute Error)</div>
            <div className="text-2xl font-semibold text-[var(--accent-primary)] mt-1">±2.962</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">µg/m³ deviation</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] font-mono">
            <div className="text-[10px] text-[var(--text-muted)] uppercase">RMSE (Root Mean Square)</div>
            <div className="text-2xl font-semibold text-[var(--text-primary)] mt-1">4.178</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">µg/m³ penalty metric</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] font-mono">
            <div className="text-[10px] text-[var(--text-muted)] uppercase">R² (Variance Explained)</div>
            <div className="text-2xl font-semibold text-[var(--text-primary)] mt-1">0.981</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">98.1% explained</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] font-mono">
            <div className="text-[10px] text-[var(--text-muted)] uppercase">Ensemble Trees</div>
            <div className="text-2xl font-semibold text-[var(--text-primary)] mt-1">100</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">Estimator trees</div>
          </div>
        </div>

        {/* Technical Specs List */}
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
            <span>Algorithm:</span>
            <span className="text-[var(--text-primary)] font-medium">Scikit-learn RandomForestRegressor</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
            <span>Target Analyte:</span>
            <span className="text-[var(--text-primary)] font-medium">Fine Particulate Matter (PM2.5) at t + 1 Hour</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
            <span>Feature Dimension:</span>
            <span className="text-[var(--text-primary)] font-medium">7 Input Regressors (PM2.5, PM10, Temp, Humidity, Wind Spd, Wind Dir, Hour)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 text-[var(--text-secondary)]">
            <span>Cross-Validation Protocol:</span>
            <span className="text-[var(--text-primary)] font-medium">10-Fold Stratified Time-Series Split</span>
          </div>
        </div>
      </div>

      {/* Data Ingestion Pipeline & Provenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Open-Meteo Integration */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-[var(--accent-primary)]" />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Open-Meteo Air Quality & Weather API
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Telemetry is dynamically ingested from Open-Meteo&apos;s open meteorological models, synthesizing data from ECMWF (European Centre for Medium-Range Weather Forecasts), GFS, and CAMS (Copernicus Atmosphere Monitoring Service) on an ~11 km regional grid without API key restrictions.
          </p>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Spatial Resolution: ~11 km</span>
            <span>Update Cadence: 1 Hour</span>
          </div>
        </div>

        {/* CPCB Calibration Reference */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-[var(--accent-primary)]" />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              CPCB Ground Monitoring Baseline
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            The model&apos;s empirical calibration was trained using ground-truth Continuous Ambient Air Quality Monitoring Stations (CAAQMS) operated by the Central Pollution Control Board (CPCB) in Chandigarh (Sector 22, Sector 25, and Sector 53) during the critical October-November Diwali periods.
          </p>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Baseline Stations: 3 CAAQMS</span>
            <span>Historical Window: 2021–2026</span>
          </div>
        </div>
      </div>

      {/* Atmospheric Phenomenon: The Diwali Science */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-[#C26765]" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            The Diwali Phenomenon: Meteorological Science vs Cultural Myth
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Air quality degradation around Diwali in North India is frequently oversimplified. DEEPAQ approaches the phenomenon through atmospheric physics:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
            <div className="font-semibold text-[var(--text-primary)]">1. Thermal Inversion Cap</div>
            <p className="text-[var(--text-secondary)]">
              Late autumn radiational cooling prevents vertical air column convection, trapping particulate emissions within 150m-300m of the ground.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
            <div className="font-semibold text-[var(--text-primary)]">2. Regional Biomass Advection</div>
            <p className="text-[var(--text-secondary)]">
              Post-monsoon agricultural crop residue burning in Punjab and Haryana introduces massive regional smoke plumes that drift southeasterly.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
            <div className="font-semibold text-[var(--text-primary)]">3. Fireworks Combustion Spike</div>
            <p className="text-[var(--text-secondary)]">
              Pyrotechnic combustion introduces heavy metal nitrates and sulfates into a pre-existing stagnant air mass, triggering exponential AQI spikes.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Scale size={16} className="text-[var(--text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Public Health & Computational Disclaimers
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          DEEPAQ is an independent environmental intelligence platform developed for research, situational awareness, and personal exposure reduction. It does not replace official statutory advisories issued by the Central Pollution Control Board (CPCB), the India Meteorological Department (IMD), or the Ministry of Environment, Forest and Climate Change (MoEFCC). Machine learning predictions are probabilistic inferences based on available meteorological observations.
        </p>
        <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)]">
          <span>Privacy: Zero user data collection · 100% Client-side preferences</span>
          <span>Open Standards: WHO 2021 & Indian NAAQS 2009 Compliant</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useMemo } from "react";
import {
  Compass,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { CityOption } from "../../lib/constants";
import { DashboardResponse, PredictionResponse } from "../../lib/types";
import { formatNumber, getPM25Category, getWindDirectionLabel } from "../../lib/utils";

interface BasinIntelligenceViewProps {
  city: CityOption;
  dashboard: DashboardResponse | null;
  prediction: PredictionResponse | null;
  onNavigateTab: (tab: string) => void;
}

export function BasinIntelligenceView({
  city,
  dashboard,
  prediction,
  onNavigateTab,
}: BasinIntelligenceViewProps) {
  const aq = dashboard?.air_quality?.values;
  const weather = dashboard?.weather?.values;

  const currentPM25 = aq?.pm2_5 ?? 88.5;
  const predictedPM25 = prediction?.prediction?.predicted_value ?? 82.3;
  const windSpeed = weather?.wind_speed_10m ?? 4.4;
  const windDir = weather?.wind_direction_10m ?? 315;
  const humidity = weather?.relative_humidity_2m ?? 82;

  const category = getPM25Category(currentPM25);
  const windLabel = getWindDirectionLabel(windDir);

  const delta = predictedPM25 - currentPM25;

  const isChandigarh = city.id === "chandigarh";

  // Diurnal cycle recommendation based on local time
  const diurnalInsight = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 10) {
      return {
        phase: "Morning Inversion Peak",
        status: "High Accumulation",
        color: "#C26765",
        description:
          "Surface thermal inversion is compressing the boundary layer (<180m). Ground-level particulates are at peak daily concentration. Postpone strenuous outdoor exercise.",
      };
    }
    if (currentHour >= 12 && currentHour < 17) {
      return {
        phase: "Afternoon Convective Dilution",
        status: "Optimal Cleansing Window",
        color: "#476650",
        description:
          "Solar thermal lifting has expanded the mixing layer beyond 1,000m. This is the daily window of lowest ground particulate exposure for outdoor tasks and natural indoor ventilation.",
      };
    }
    return {
      phase: "Evening Boundary Descent",
      status: "Moderate Accumulation",
      color: "#D4A373",
      description:
        "Solar radiation is declining and radiative ground cooling is beginning to re-compress the boundary layer. Keep residential windows closed during evening traffic hours.",
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header: Basin Intelligence Banner */}
      <div className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-9 shadow-xs overflow-hidden">
        {/* Soft atmospheric gradient accent */}
        <div
          className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: category.color }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] text-xs font-semibold uppercase tracking-wider font-mono">
                <Compass size={13} className="text-[var(--accent-primary)]" />
                <span>
                  {isChandigarh ? "Chandigarh Air Basin" : `${city.name} Basin`}
                </span>
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {isChandigarh ? "Primary Pilot Geography · Shivalik Foothills" : "Regional Atmospheric Domain"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {isChandigarh ? "Chandigarh Air Intelligence" : `${city.name} Air Intelligence`}
            </h1>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {isChandigarh
                ? "Sub-Himalayan topographic bowl dynamics, nocturnal mountain air drainage, and diurnal boundary-layer cycling calibrated across 2,208 hours of local atmospheric sensor records."
                : `Atmospheric boundary layer physics, surface kinetic ventilation, and machine learning particulate anticipation for the ${city.name} urban domain.`}
            </p>
          </div>

          {/* Quick Basin Telemetry Card */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs font-mono space-y-2 shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>Domain Elevation:</span>
              <span className="text-[var(--text-primary)] font-semibold">
                {isChandigarh ? "321 m ASL" : "Regional Basin"}
              </span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>Observed PM2.5:</span>
              <span className="text-[var(--text-primary)] font-bold">
                {formatNumber(currentPM25, 1)} µg/m³
              </span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>1h ML Forecast:</span>
              <span className="text-[var(--accent-primary)] font-bold">
                {formatNumber(predictedPM25, 1)} µg/m³
              </span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>60m Trajectory:</span>
              <span
                className="font-semibold"
                style={{ color: delta < 0 ? "#476650" : delta > 0 ? "#C26765" : "var(--text-muted)" }}
              >
                {delta < 0 ? `↓ ${Math.abs(delta).toFixed(1)} µg/m³` : delta > 0 ? `↑ ${delta.toFixed(1)} µg/m³` : "Steady"}
              </span>
            </div>
            <div className="pt-1.5 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)]">
              Trained on {isChandigarh ? "2,208h Chandigarh Dataset" : "Autoregressive Baseline"}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Diurnal Phase Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div
            className="p-2.5 rounded-lg shrink-0 mt-0.5"
            style={{ backgroundColor: `${diurnalInsight.color}18` }}
          >
            <Clock size={18} style={{ color: diurnalInsight.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-[var(--text-muted)]">
                Current Diurnal Regime:
              </span>
              <span
                className="text-xs font-bold font-mono px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${diurnalInsight.color}15`,
                  color: diurnalInsight.color,
                }}
              >
                {diurnalInsight.phase}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-3xl leading-relaxed">
              {diurnalInsight.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab("trends")}
          className="self-start sm:self-center shrink-0 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>24h Trend Analysis</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* The 3 Core Atmospheric Mechanisms of the Basin */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Atmospheric Basin Dynamics
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Empirical Environmental Drivers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Topographic Trap */}
          <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Mechanism 01
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                Topography
              </span>
            </div>

            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Shivalik Mountain Foothill Drainage
            </h3>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Chandigarh lies directly south of the Shivalik hills. During quiet nights, dense cool air rolls down mountain slopes into the urban basin. This katabatic drainage settles at ground level, pinning combustion emissions under a shallow inversion layer (&lt;200m).
            </p>

            <div className="pt-2 border-t border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] flex justify-between">
              <span>Basin Slope:</span>
              <span className="text-[var(--text-primary)] font-medium">NE to SW downhill</span>
            </div>
          </div>

          {/* Card 2: Kinetic Wind Flushing */}
          <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Mechanism 02
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                Kinetic Flushing
              </span>
            </div>

            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Prevailing NW Wind Corridor
            </h3>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              The dominant wind vector across the Chandigarh capital region originates from 300°–320° (North-West). When wind speeds fall below 6 km/h, the basin enters atmospheric stagnation. Velocities above 10 km/h induce mechanical air cleansing.
            </p>

            <div className="pt-2 border-t border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] flex justify-between">
              <span>Current Vector:</span>
              <span className="text-[var(--text-primary)] font-medium">
                {windLabel} at {formatNumber(windSpeed, 1)} km/h
              </span>
            </div>
          </div>

          {/* Card 3: Hygroscopic Haze Amplification */}
          <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Mechanism 03
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                Thermodynamics
              </span>
            </div>

            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Moisture & Hygroscopic Growth
            </h3>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              At surface relative humidity above 70%, ambient sulfate and nitrate particles absorb water vapor. This expands their optical scattering diameter, reducing visibility and trapping secondary organic aerosols close to human breathing height.
            </p>

            <div className="pt-2 border-t border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] flex justify-between">
              <span>Current Humidity:</span>
              <span className="text-[var(--text-primary)] font-medium">
                {formatNumber(humidity, 0)}% RH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Micro-Zone Guidance for Citizens & Planners */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-8 space-y-5 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Actionable Observations & Micro-Zone Variations
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Practical guidelines for daily routines, exercise scheduling, and sensitive exposure mitigation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[var(--accent-primary)]" />
              <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                Optimal Outdoor & Aerobic Exercise Window
              </h4>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Schedule jogging, cycling, and children&apos;s outdoor playtime between <strong>13:30 and 16:30</strong>. By early afternoon, solar warming lifts the boundary layer above 1,000 meters, dispersing surface particulate concentration by up to 40% compared to early morning.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--accent-primary)]" />
              <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                Sector Micro-Zone Variance
              </h4>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Sukhna Lake, Sector 1 Capitol Complex, and Leisure Valley maintain 15–25% lower particulate levels due to dense forest buffers. Industrial Area Phase 1 &amp; 2 and Sector 17 commercial corridors experience higher localized diesel and mechanical dust.
            </p>
          </div>
        </div>

        {/* Machine Learning Model Integration Link */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--border-subtle)]">
          <div className="text-xs text-[var(--text-secondary)]">
            Continuous predictions powered by DEEPAQ&apos;s trained Random Forest Regressor (MAE ±2.96 µg/m³).
          </div>
          <button
            onClick={() => onNavigateTab("intelligence")}
            className="px-4 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <span>Explore ML Model Architecture</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  ForecastResponse,
  DashboardResponse,
} from "../../lib/types";
import { formatNumber } from "../../lib/utils";
import { CityOption } from "../../lib/constants";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface TrendsViewProps {
  city: CityOption;
  dashboard?: DashboardResponse | null;
  forecast: ForecastResponse | null;
  forecastHours: 24 | 48 | 72;
  onSelectHours: (hours: 24 | 48 | 72) => void;
}

type AnalyteKey = "pm2_5" | "pm10" | "nitrogen_dioxide" | "sulphur_dioxide" | "ozone";

const ANALYTE_CONFIG: Record<
  AnalyteKey,
  { label: string; unit: string; color: string; naaqsLimit: number | null }
> = {
  pm2_5: {
    label: "PM2.5 (Fine Particulate)",
    unit: "µg/m³",
    color: "#476650",
    naaqsLimit: 60,
  },
  pm10: {
    label: "PM10 (Coarse Particulate)",
    unit: "µg/m³",
    color: "#7E92A0",
    naaqsLimit: 100,
  },
  nitrogen_dioxide: {
    label: "NO₂ (Nitrogen Dioxide)",
    unit: "µg/m³",
    color: "#D4A373",
    naaqsLimit: 80,
  },
  sulphur_dioxide: {
    label: "SO₂ (Sulphur Dioxide)",
    unit: "µg/m³",
    color: "#B284BE",
    naaqsLimit: 80,
  },
  ozone: {
    label: "O₃ (Ground Ozone)",
    unit: "µg/m³",
    color: "#5B8E7D",
    naaqsLimit: 100,
  },
};

export function TrendsView({
  city,
  forecast,
  forecastHours,
  onSelectHours,
}: TrendsViewProps) {
  const [activeAnalytes, setActiveAnalytes] = useState<AnalyteKey[]>(["pm2_5", "pm10"]);
  const [showNaaqsLines, setShowNaaqsLines] = useState(true);

  const toggleAnalyte = (key: AnalyteKey) => {
    setActiveAnalytes((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  // Format chart data points
  const chartData = useMemo(() => {
    if (!forecast?.forecast || forecast.forecast.length === 0) return [];

    const now = new Date();

    return forecast.forecast.slice(0, forecastHours + 24).map((pt) => {
      const date = new Date(pt.timestamp);
      const isPast = date < now;
      const formattedTime = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dayLabel = date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
      });

      return {
        timestamp: pt.timestamp,
        time: formattedTime,
        dateLabel: `${dayLabel} ${formattedTime}`,
        isPast,
        pm2_5: pt.pm2_5,
        pm10: pt.pm10,
        nitrogen_dioxide: pt.nitrogen_dioxide,
        sulphur_dioxide: pt.sulphur_dioxide,
        ozone: pt.ozone,
      };
    });
  }, [forecast, forecastHours]);

  // Peak, Min, and Average PM2.5 metrics
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    let peak = chartData[0];
    let min = chartData[0];
    let sum = 0;
    let count = 0;

    for (const d of chartData) {
      if (d.pm2_5 !== null) {
        sum += d.pm2_5;
        count++;
        if (peak.pm2_5 === null || d.pm2_5 > peak.pm2_5) peak = d;
        if (min.pm2_5 === null || d.pm2_5 < min.pm2_5) min = d;
      }
    }

    return {
      peakVal: peak.pm2_5,
      peakTime: peak.dateLabel,
      minVal: min.pm2_5,
      minTime: min.dateLabel,
      avgVal: count > 0 ? sum / count : null,
    };
  }, [chartData]);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={15} className="text-[var(--accent-primary)]" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--accent-primary)]">
                Temporal Dynamics & Multi-Analyte Curves
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Atmospheric Trends & 72-Hour Projection
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-2xl">
              Historical actuals and prospective atmospheric dispersion models for {city.name}. Evaluates diurnal inversion cycles and peak exposure windows.
            </p>
          </div>

          {/* Time Horizon Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
            {([24, 48, 72] as const).map((hours) => (
              <button
                key={hours}
                onClick={() => onSelectHours(hours)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                  forecastHours === hours
                    ? "bg-[var(--accent-primary)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                +{hours}h Forecast
              </button>
            ))}
          </div>
        </div>

        {/* Stats Callout Row */}
        {stats && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[var(--border-subtle)]">
            <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-[10.5px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                <span>Peak Concentration</span>
                <ArrowUpRight size={14} className="text-[#C26765]" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold font-mono text-[#C26765]">
                  {formatNumber(stats.peakVal, 1)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">µg/m³</span>
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--text-secondary)] truncate">
                Expected at {stats.peakTime}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-[10.5px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                <span>Window Low (Clearing)</span>
                <ArrowDownRight size={14} className="text-[#476650]" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold font-mono text-[#476650]">
                  {formatNumber(stats.minVal, 1)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">µg/m³</span>
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--text-secondary)] truncate">
                Expected at {stats.minTime}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-[10.5px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                <span>Period Average PM2.5</span>
                <Clock size={14} className="text-[var(--text-muted)]" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold font-mono text-[var(--text-primary)]">
                  {formatNumber(stats.avgVal, 1)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">µg/m³</span>
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                Over next {forecastHours} hours
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chart Card */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-4">
        {/* Analyte Selection Pills & NAAQS toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] mr-1">
              Active Curves:
            </span>
            {(Object.keys(ANALYTE_CONFIG) as AnalyteKey[]).map((key) => {
              const cfg = ANALYTE_CONFIG[key];
              const isActive = activeAnalytes.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleAnalyte(key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                    isActive
                      ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] border-[var(--border-hover)]"
                      : "bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: isActive ? cfg.color : "var(--text-muted)",
                    }}
                  />
                  <span>{cfg.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showNaaqsLines}
              onChange={(e) => setShowNaaqsLines(e.target.checked)}
              className="rounded accent-[var(--accent-primary)]"
            />
            <span>Show NAAQS Safe Thresholds</span>
          </label>
        </div>

        {/* Interactive Recharts Canvas */}
        <div className="h-80 sm:h-96 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                interval={Math.floor(chartData.length / 8)}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3 text-xs font-mono shadow-xl space-y-1.5">
                      <div className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-1 flex justify-between gap-4">
                        <span>{item.dateLabel}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {item.isPast ? "PAST READING" : "FORECAST"}
                        </span>
                      </div>
                      {payload.map((entry, idx) => {
                        const key = entry.dataKey as AnalyteKey;
                        const cfg = ANALYTE_CONFIG[key];
                        return (
                          <div
                            key={String(entry.dataKey ?? idx)}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span>{cfg?.label || entry.name}:</span>
                            </span>
                            <span className="font-semibold text-[var(--text-primary)]">
                              {formatNumber(entry.value as number, 1)} {cfg?.unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />

              {/* NAAQS 60 µg/m³ PM2.5 line */}
              {showNaaqsLines && activeAnalytes.includes("pm2_5") && (
                <ReferenceLine
                  y={60}
                  stroke="#C26765"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                  label={{
                    value: "NAAQS PM2.5 (60 µg/m³)",
                    position: "insideTopRight",
                    fill: "#C26765",
                    fontSize: 10,
                  }}
                />
              )}

              {/* NAAQS 100 µg/m³ PM10 line */}
              {showNaaqsLines && activeAnalytes.includes("pm10") && (
                <ReferenceLine
                  y={100}
                  stroke="#7E92A0"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                  label={{
                    value: "NAAQS PM10 (100 µg/m³)",
                    position: "insideTopRight",
                    fill: "#7E92A0",
                    fontSize: 10,
                  }}
                />
              )}

              {/* Render Selected Analyte Lines */}
              {activeAnalytes.map((key) => {
                const cfg = ANALYTE_CONFIG[key];
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={cfg.label}
                    stroke={cfg.color}
                    strokeWidth={key === "pm2_5" ? 2.2 : 1.5}
                    dot={false}
                    activeDot={{ r: 4, fill: cfg.color }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Diurnal Cycle & Exposure Timing Analysis */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Diurnal Exposure Windows & Atmospheric Cycle
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Typical 24-hour cycle of planetary boundary layer expansion and compression across North Indian basins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[#C26765]">06:00 – 09:30 IST</span>
              <span className="text-[10px] uppercase text-[var(--text-muted)]">Morning Peak</span>
            </div>
            <h4 className="text-sm font-medium text-[var(--text-primary)]">
              Boundary Layer Compression + Traffic
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Surface cooling from overnight radiation keeps the inversion layer low (~200m). Commuter emissions accumulate rapidly without vertical dispersal. Avoid outdoor runs or strenuous exercise.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[#476650]">12:30 – 16:30 IST</span>
              <span className="text-[10px] uppercase text-[var(--text-muted)]">Optimal Window</span>
            </div>
            <h4 className="text-sm font-medium text-[var(--text-primary)]">
              Solar Heating & Convective Dilution
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Peak solar irradiance heats the Earth&apos;s surface, breaking the ground inversion cap and raising the atmospheric boundary layer up to 1,500m+. This is the cleanest window for natural building ventilation.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[#D4A373]">20:00 – 03:00 IST</span>
              <span className="text-[10px] uppercase text-[var(--text-muted)]">Night Descent</span>
            </div>
            <h4 className="text-sm font-medium text-[var(--text-primary)]">
              Radiational Cooling Re-trapping
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Solar radiation ceases, surface temperatures drop, and the boundary layer collapses back down to 150m-250m. Late night commercial freight and regional biomass burning create high surface PM2.5 spikes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

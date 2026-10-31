"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  Clock,
  Layers,
} from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { Badge } from "./ui/Badge";
import { ForecastResponse } from "../lib/types";
import { formatNumber, getPM25Category } from "../lib/utils";

interface ForecastChartProps {
  forecastData: ForecastResponse | null;
  selectedHours: 24 | 48 | 72;
  onSelectHours: (hours: 24 | 48 | 72) => void;
}

interface FormattedForecastPoint {
  rawTimestamp: string;
  displayTime: string;
  fullDate: string;
  hourOnly: string;
  pm2_5: number | null;
  pm10: number | null;
  nitrogen_dioxide: number | null;
  ozone: number | null;
}

export function ForecastChart({
  forecastData,
  selectedHours,
  onSelectHours,
}: ForecastChartProps) {
  const [activePollutant, setActivePollutant] = useState<"pm2_5" | "pm10" | "nitrogen_dioxide">("pm2_5");

  // Transform raw points with clean formatted dates for charts and tooltips
  const chartData = useMemo<FormattedForecastPoint[]>(() => {
    if (!forecastData?.forecast) return [];

    return forecastData.forecast.map((pt) => {
      const d = new Date(pt.timestamp);
      const isDateValid = !isNaN(d.getTime());

      const hourOnly = isDateValid
        ? d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          })
        : pt.timestamp;

      const displayTime = isDateValid
        ? d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          })
        : pt.timestamp;

      const fullDate = isDateValid
        ? d.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          })
        : pt.timestamp;

      return {
        rawTimestamp: pt.timestamp,
        displayTime,
        fullDate,
        hourOnly,
        pm2_5: pt.pm2_5,
        pm10: pt.pm10,
        nitrogen_dioxide: pt.nitrogen_dioxide,
        ozone: pt.ozone,
      };
    });
  }, [forecastData]);

  // Compute summary metrics for active pollutant over this window
  const stats = useMemo(() => {
    const validValues = chartData
      .map((d) => d[activePollutant])
      .filter((v): v is number => v !== null && !isNaN(v));

    if (validValues.length === 0) return { min: null, max: null, avg: null };

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const sum = validValues.reduce((a, b) => a + b, 0);
    const avg = sum / validValues.length;

    return { min, max, avg };
  }, [chartData, activePollutant]);

  const pollutantLabels: Record<
    "pm2_5" | "pm10" | "nitrogen_dioxide",
    { label: string; unit: string; color: string }
  > = {
    pm2_5: { label: "PM2.5", unit: "µg/m³", color: "#A5B39A" },
    pm10: { label: "PM10", unit: "µg/m³", color: "#7E92A0" },
    nitrogen_dioxide: { label: "NO₂", unit: "µg/m³", color: "#C4A977" },
  };

  const currentPollutantMeta = pollutantLabels[activePollutant];

  return (
    <GlassCard
      id="forecast"
      headerTitle="Atmospheric Simulation Forecast"
      headerSubtitle="Numerical Aerosol Dispersion Output"
      headerBadge={
        <Badge variant="cyan" icon={<Layers size={10} />}>
          OPEN-METEO NUMERICAL OUTPUT
        </Badge>
      }
      headerAction={
        <div className="flex items-center gap-1 bg-[#141512] p-0.5 rounded border border-[#30312C]">
          {([24, 48, 72] as const).map((hours) => (
            <button
              key={hours}
              onClick={() => onSelectHours(hours)}
              className={`px-2 py-0.5 text-[10.5px] font-mono rounded transition-colors cursor-pointer ${
                selectedHours === hours
                  ? "bg-[#A5B39A] text-[#111210] font-semibold"
                  : "text-[#A5A69E] hover:text-[#F1F0E9]"
              }`}
            >
              {hours}H
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Subheader & Analyte Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#70716A]">
              Analyte:
            </span>
            <div className="flex items-center gap-1">
              {(
                [
                  { key: "pm2_5", label: "PM2.5" },
                  { key: "pm10", label: "PM10" },
                  { key: "nitrogen_dioxide", label: "NO₂" },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActivePollutant(item.key)}
                  className={`text-[10.5px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    activePollutant === item.key
                      ? "border-[#A5B39A]/40 bg-[#A5B39A]/12 text-[#A5B39A] font-medium"
                      : "border-[#30312C] bg-[#141512] text-[#A5A69E] hover:text-[#F1F0E9]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[10.5px] font-mono text-[#70716A]">
            {chartData.length} simulated hourly timesteps · Resolution: ~11km
          </span>
        </div>

        {/* Statistical Readout */}
        <div className="grid grid-cols-3 gap-2 bg-[#141512] border border-[#30312C] rounded-md p-3 font-mono">
          <div className="px-2">
            <span className="text-[9px] uppercase tracking-wider text-[#70716A] block">
              Window Minimum
            </span>
            <p className="mt-0.5 text-base sm:text-lg font-semibold text-[#A5B39A]">
              {formatNumber(stats.min, 1)}{" "}
              <span className="text-[9px] font-normal text-[#70716A]">
                {currentPollutantMeta.unit}
              </span>
            </p>
          </div>
          <div className="border-x border-[#30312C] px-2">
            <span className="text-[9px] uppercase tracking-wider text-[#70716A] block">
              Window Mean
            </span>
            <p className="mt-0.5 text-base sm:text-lg font-semibold text-[#7E92A0]">
              {formatNumber(stats.avg, 1)}{" "}
              <span className="text-[9px] font-normal text-[#70716A]">
                {currentPollutantMeta.unit}
              </span>
            </p>
          </div>
          <div className="px-2">
            <span className="text-[9px] uppercase tracking-wider text-[#70716A] block">
              Peak Concentration
            </span>
            <p className="mt-0.5 text-base sm:text-lg font-semibold text-[#C26765]">
              {formatNumber(stats.max, 1)}{" "}
              <span className="text-[9px] font-normal text-[#70716A]">
                {currentPollutantMeta.unit}
              </span>
            </p>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[320px] w-full pt-1">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 10, left: -22, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="editorialGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentPollutantMeta.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={currentPollutantMeta.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#30312C"
                  strokeDasharray="2 2"
                  vertical={false}
                />
                <XAxis
                  dataKey="displayTime"
                  tick={{ fill: "#70716A", fontSize: 10, fontFamily: "monospace" }}
                  interval={Math.ceil(chartData.length / 8)}
                  dy={10}
                  tickLine={{ stroke: "#30312C" }}
                />
                <YAxis
                  tick={{ fill: "#70716A", fontSize: 10, fontFamily: "monospace" }}
                  dx={-5}
                  tickLine={{ stroke: "#30312C" }}
                  domain={["auto", "auto"]}
                />
                {activePollutant === "pm2_5" && (
                  <>
                    <ReferenceLine
                      y={60}
                      stroke="#C4A977"
                      strokeDasharray="3 3"
                      label={{
                        value: "NAAQS 24h (60 µg/m³)",
                        fill: "#C4A977",
                        fontSize: 9,
                        fontFamily: "monospace",
                        position: "insideTopRight",
                      }}
                    />
                    <ReferenceLine
                      y={120}
                      stroke="#C26765"
                      strokeDasharray="3 3"
                      label={{
                        value: "Very Poor (120 µg/m³)",
                        fill: "#C26765",
                        fontSize: 9,
                        fontFamily: "monospace",
                        position: "insideTopRight",
                      }}
                    />
                  </>
                )}
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0].payload as FormattedForecastPoint;
                    const val = item[activePollutant];
                    const cat = activePollutant === "pm2_5" ? getPM25Category(val) : null;

                    return (
                      <div className="rounded-md border border-[#30312C] bg-[#191A17] p-3 shadow-xl font-mono text-xs space-y-1.5 min-w-[190px]">
                        <div className="text-[10px] text-[#70716A] border-b border-[#30312C] pb-1 flex items-center justify-between">
                          <span>{item.fullDate}</span>
                          <span className="text-[#A5B39A]">Hourly NWP</span>
                        </div>
                        <div className="flex items-baseline justify-between pt-0.5">
                          <span className="text-[#A5A69E]">
                            {currentPollutantMeta.label}:
                          </span>
                          <span className="text-sm font-semibold text-[#F1F0E9]">
                            {formatNumber(val, 2)} {currentPollutantMeta.unit}
                          </span>
                        </div>
                        {cat && (
                          <div className="flex items-center gap-1.5 pt-0.5 text-[10.5px]">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span style={{ color: cat.color }} className="font-medium">
                              Tier: {cat.category}
                            </span>
                          </div>
                        )}
                        <div className="text-[9px] text-[#70716A] pt-1 border-t border-[#30312C]">
                          Open-Meteo numerical model grid output
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={activePollutant}
                  stroke={currentPollutantMeta.color}
                  strokeWidth={1.5}
                  fill="url(#editorialGradient)"
                  connectNulls={true}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: currentPollutantMeta.color,
                    stroke: "#111210",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-[#70716A] font-mono text-xs">
              <Clock className="animate-spin mb-1.5" size={18} />
              <span>Ingesting simulated timesteps...</span>
            </div>
          )}
        </div>

        {/* Legend & Benchmarks Context */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[10.5px] font-mono text-[#70716A] pt-2 border-t border-[#30312C]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#A5A69E]">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: currentPollutantMeta.color }}
              />
              <span>{currentPollutantMeta.label} Curve</span>
            </span>
            {activePollutant === "pm2_5" && (
              <>
                <span className="flex items-center gap-1 text-[#C4A977]">
                  <span className="inline-block h-0.5 w-2.5 bg-[#C4A977]" />
                  <span>NAAQS 24h Threshold (60 µg/m³)</span>
                </span>
                <span className="flex items-center gap-1 text-[#C26765]">
                  <span className="inline-block h-0.5 w-2.5 bg-[#C26765]" />
                  <span>Very Poor Threshold (120 µg/m³)</span>
                </span>
              </>
            )}
          </div>
          <span>Interval: 1-hour</span>
        </div>
      </div>
    </GlassCard>
  );
}

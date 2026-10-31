"use client";

import React, { useMemo } from "react";
import {
  Activity,
  Wind,
  Thermometer,
  Droplets,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
} from "lucide-react";
import {
  DashboardResponse,
  ForecastResponse,
  PredictionResponse,
} from "../../lib/types";
import {
  formatNumber,
  getPM25Category,
  getWindDirectionLabel,
  formatRelativeTime,
} from "../../lib/utils";
import { CityOption, HEALTH_GUIDANCE } from "../../lib/constants";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

interface HomeViewProps {
  city: CityOption;
  dashboard: DashboardResponse | null;
  forecast: ForecastResponse | null;
  prediction: PredictionResponse | null;
  onNavigateTab: (tab: string) => void;
}

export function HomeView({
  city,
  dashboard,
  forecast,
  prediction,
  onNavigateTab,
}: HomeViewProps) {
  const aq = dashboard?.air_quality?.values;
  const weather = dashboard?.weather?.values;

  const pm25 = aq?.pm2_5 ?? null;
  const pm10 = aq?.pm10 ?? null;
  const temp = weather?.temperature_2m ?? null;
  const humidity = weather?.relative_humidity_2m ?? null;
  const windSpeed = weather?.wind_speed_10m ?? null;
  const windDir = weather?.wind_direction_10m ?? null;

  // Use US AQI or calculate from PM2.5
  const rawAqi = aq?.us_aqi;
  const category = getPM25Category(pm25);
  const guidance = HEALTH_GUIDANCE[category.category];
  const windLabel = getWindDirectionLabel(windDir);

  // 24-hour trend extraction from forecast history
  const past24hData = useMemo(() => {
    if (!forecast?.forecast || forecast.forecast.length === 0) return [];
    // Take the first 24-36 historical points
    return forecast.forecast.slice(0, 24).map((pt) => {
      const d = new Date(pt.timestamp);
      return {
        time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        pm2_5: pt.pm2_5,
      };
    });
  }, [forecast]);

  // Compute 24h trend delta
  const trend24h = useMemo(() => {
    if (past24hData.length < 2) return { delta: 0, direction: "steady" };
    const first = past24hData[0].pm2_5 ?? 0;
    const last = past24hData[past24hData.length - 1].pm2_5 ?? 0;
    const delta = Math.round((last - first) * 10) / 10;
    const direction = delta > 3 ? "rising" : delta < -3 ? "falling" : "steady";
    return { delta, direction };
  }, [past24hData]);

  // Determine primary pollutant
  const primaryPollutant = useMemo(() => {
    if (pm25 && pm10) {
      return pm25 / 60 > pm10 / 100 ? "PM2.5 (Fine Aerosol)" : "PM10 (Inhalable Dust)";
    }
    return "PM2.5 (Fine Particulate)";
  }, [pm25, pm10]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* SECTION 1: HERO LIVE AQI FOCAL POINT */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left: Prominent AQI Figure */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-muted)] font-medium">
                Live Environmental Status
              </span>
              <span className="text-[var(--border-subtle)]">·</span>
              <span className="text-xs text-[var(--accent-primary)] font-medium">
                {city.name} Basin
              </span>
            </div>

            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-bold font-sans tracking-tight text-[var(--text-primary)] tabular-nums">
                {rawAqi ?? (pm25 ? Math.round(pm25 * 1.6) : "--")}
              </span>
              <div className="space-y-1">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                  style={{
                    backgroundColor: category.bgColor,
                    color: category.color,
                    border: `1px solid ${category.borderColor}`,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.category}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Standard: NAAQS / US AQI Scale
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
              {category.healthImplications}
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-1">
              <span className="flex items-center gap-1">
                <span className="text-[var(--text-secondary)] font-medium">Primary:</span>{" "}
                {primaryPollutant}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                <span>
                  Synced {formatRelativeTime(dashboard ? new Date(dashboard.air_quality.timestamp) : null)}
                </span>
              </span>
            </div>
          </div>

          {/* Right: 24h Trend Chart Mini-Card */}
          <div className="w-full lg:w-80 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                24-Hour Trend
              </span>
              <div className="flex items-center gap-1 text-xs font-medium">
                {trend24h.direction === "rising" ? (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                    <TrendingUp size={13} />
                    <span>+{trend24h.delta} µg/m³</span>
                  </span>
                ) : trend24h.direction === "falling" ? (
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingDown size={13} />
                    <span>{trend24h.delta} µg/m³</span>
                  </span>
                ) : (
                  <span className="text-[var(--text-muted)] flex items-center gap-0.5">
                    <Minus size={13} />
                    <span>Steady</span>
                  </span>
                )}
              </div>
            </div>

            <div className="h-24 w-full">
              {past24hData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={past24hData} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
                    <defs>
                      <linearGradient id="heroTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={category.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={category.color} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const v = payload[0].value;
                        return (
                          <div className="rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-1.5 text-[10px] font-mono shadow-md">
                            <span>{formatNumber(Number(v), 1)} µg/m³</span>
                          </div>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="pm2_5"
                      stroke={category.color}
                      strokeWidth={1.5}
                      fill="url(#heroTrendGrad)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)] font-mono">
                  Ingesting 24h history...
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10.5px] font-mono text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-1.5">
              <span>Actual Open-Meteo series</span>
              <button
                onClick={() => onNavigateTab("trends")}
                className="text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full charts</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: FIVE CORE ATMOSPHERIC TELEMETRY TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* PM2.5 */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-mono uppercase tracking-wider text-[10px]">PM2.5</span>
            <Activity size={14} className="text-[var(--accent-primary)]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold font-sans text-[var(--text-primary)] tabular-nums">
              {formatNumber(pm25, 1)}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">µg/m³</span>
          </div>
          <p className="text-[10.5px] text-[var(--text-secondary)] truncate">Fine inhalable combustion aerosol</p>
        </div>

        {/* PM10 */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-mono uppercase tracking-wider text-[10px]">PM10</span>
            <Wind size={14} className="text-[var(--accent-secondary)]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold font-sans text-[var(--text-primary)] tabular-nums">
              {formatNumber(pm10, 1)}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">µg/m³</span>
          </div>
          <p className="text-[10.5px] text-[var(--text-secondary)] truncate">Coarse dust & mechanical particles</p>
        </div>

        {/* Temperature */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-mono uppercase tracking-wider text-[10px]">Ambient Temp</span>
            <Thermometer size={14} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold font-sans text-[var(--text-primary)] tabular-nums">
              {formatNumber(temp, 1)}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">°C</span>
          </div>
          <p className="text-[10.5px] text-[var(--text-secondary)] truncate">Surface boundary gradient</p>
        </div>

        {/* Humidity */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-mono uppercase tracking-wider text-[10px]">Humidity</span>
            <Droplets size={14} className="text-[var(--accent-secondary)]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold font-sans text-[var(--text-primary)] tabular-nums">
              {formatNumber(humidity, 0)}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">%</span>
          </div>
          <p className="text-[10.5px] text-[var(--text-secondary)] truncate">
            {humidity && humidity > 70 ? "Smog condensation factor" : "Moderate moisture"}
          </p>
        </div>

        {/* Wind Speed & Direction */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 space-y-1 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-mono uppercase tracking-wider text-[10px]">Wind Velocity</span>
            <Wind size={14} className="text-[var(--accent-primary)]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold font-sans text-[var(--text-primary)] tabular-nums">
              {formatNumber(windSpeed, 1)}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">km/h</span>
          </div>
          <p className="text-[10.5px] text-[var(--text-secondary)] truncate">
            {windLabel} advection ({windDir != null ? Math.round(windDir) : "--"}°)
          </p>
        </div>
      </div>

      {/* SECTION 3: ENVIRONMENTAL INTELLIGENCE & PRACTICAL GUIDANCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Intelligence Summary */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[var(--accent-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Atmospheric Intelligence Summary
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
              Physically Grounded
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            In the {city.name} basin, current particulate concentration reflects an aerosol loading of{" "}
            <strong className="text-[var(--text-primary)]">{formatNumber(pm25, 1)} µg/m³ (PM2.5)</strong> and{" "}
            <strong className="text-[var(--text-primary)]">{formatNumber(pm10, 1)} µg/m³ (PM10)</strong>. With wind
            speeds of {formatNumber(windSpeed, 1)} km/h out of the {windLabel}, atmospheric ventilation is{" "}
            {windSpeed && windSpeed < 6
              ? "restricted, establishing nocturnal boundary-layer stagnation."
              : "moderate, promoting regional dispersion across the basin."}
          </p>

          {/* 1-Hour Machine Learning Ahead */}
          {prediction && (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-primary)] font-medium block">
                  1-Hour Machine Learning Projection
                </span>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Random Forest model forecasts next-hour PM2.5:
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-bold font-sans text-[var(--text-primary)] tabular-nums">
                  {formatNumber(prediction.prediction.predicted_value, 1)}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)] ml-1">µg/m³</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Want detailed physical attribution?</span>
            <button
              onClick={() => onNavigateTab("intelligence")}
              className="text-[var(--accent-primary)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open Intelligence Engine</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right: Personalized Health Guidance */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--accent-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Health & Activity Guidance
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Tier: {category.category}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-[var(--text-primary)] block text-[11px] mb-0.5">
                Outdoor Activities:
              </span>
              <p className="text-[var(--text-secondary)] leading-relaxed">{guidance.outdoor}</p>
            </div>

            <div>
              <span className="font-semibold text-[var(--text-primary)] block text-[11px] mb-0.5">
                Sensitive Groups:
              </span>
              <p className="text-[var(--text-secondary)] leading-relaxed">{guidance.sensitive}</p>
            </div>

            <div>
              <span className="font-semibold text-[var(--text-primary)] block text-[11px] mb-0.5">
                Indoor Protection & Ventilation:
              </span>
              <p className="text-[var(--text-secondary)] leading-relaxed">{guidance.ventilation}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Public-health recommendations</span>
            <button
              onClick={() => onNavigateTab("health")}
              className="text-[var(--accent-primary)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>All guidelines</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

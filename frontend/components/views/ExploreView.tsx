"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Check,
  X,
  ArrowRight,
  Layers,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { CityOption, HEALTH_GUIDANCE } from "../../lib/constants";
import { formatNumber, getPM25Category } from "../../lib/utils";

interface CitySummary {
  city: CityOption;
  pm2_5: number | null;
  pm10: number | null;
  us_aqi: number | null;
  european_aqi: number | null;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  timestamp: string;
}

interface ExploreData {
  cities: CitySummary[];
  timestamp: string;
  nationalAveragePM25: number;
  highestCity: CitySummary | null;
  lowestCity: CitySummary | null;
}

interface ExploreViewProps {
  currentCity: CityOption;
  onSelectCity: (city: CityOption) => void;
  onNavigateHome: () => void;
}

type SeverityFilter = "ALL" | "GOOD" | "MODERATE" | "POOR" | "VERY_POOR" | "SEVERE";
type SortOption = "PM25_DESC" | "PM25_ASC" | "NAME_ASC";

export function ExploreView({ currentCity, onSelectCity, onNavigateHome }: ExploreViewProps) {
  const [data, setData] = useState<ExploreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("PM25_DESC");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const fetchExploreData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/explore");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ExploreData = await res.json();
      setData(json);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load explore data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/explore")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: ExploreData) => {
        if (!ignore) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load explore data");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Filtered and sorted cities list
  const filteredCities = useMemo(() => {
    if (!data?.cities) return [];

    let list = data.cities.filter((item) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.city.name.toLowerCase().includes(q) ||
        item.city.state.toLowerCase().includes(q) ||
        item.city.region.toLowerCase().includes(q);

      if (!matchSearch) return false;

      // Severity filter
      if (severityFilter === "ALL") return true;
      const cat = getPM25Category(item.pm2_5);
      if (severityFilter === "GOOD") return cat.category === "Good";
      if (severityFilter === "MODERATE") return cat.category === "Moderate";
      if (severityFilter === "POOR") return cat.category === "Poor";
      if (severityFilter === "VERY_POOR") return cat.category === "Very Poor";
      if (severityFilter === "SEVERE") return cat.category === "Severe";
      return true;
    });

    // Sort list
    list = [...list].sort((a, b) => {
      if (sortBy === "PM25_DESC") {
        return (b.pm2_5 ?? 0) - (a.pm2_5 ?? 0);
      }
      if (sortBy === "PM25_ASC") {
        return (a.pm2_5 ?? 0) - (b.pm2_5 ?? 0);
      }
      if (sortBy === "NAME_ASC") {
        return a.city.name.localeCompare(b.city.name);
      }
      return 0;
    });

    return list;
  }, [data, searchQuery, severityFilter, sortBy]);

  // Comparison toggle
  const toggleCompare = (cityId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(cityId)) {
        return prev.filter((id) => id !== cityId);
      }
      if (prev.length >= 2) {
        return [prev[1], cityId]; // Keep the most recent two
      }
      return [...prev, cityId];
    });
  };

  // Compare modal data
  const comparedCities = useMemo(() => {
    if (!data?.cities || compareIds.length === 0) return [];
    return compareIds
      .map((id) => data.cities.find((c) => c.city.id === id))
      .filter((c): c is CitySummary => Boolean(c));
  }, [data, compareIds]);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--accent-primary)]">
                National Air Basin Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Multi-Basin Environmental Explorer
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-2xl">
              Real-time atmospheric telemetry and air mass monitoring across 16 major Indian environmental basins, industrial corridors, and coastal ecosystems.
            </p>
            {error && (
              <div className="mt-3 p-2.5 rounded-lg border border-[#C26765]/30 bg-[var(--surface-elevated)] text-[#C26765] text-xs font-mono">
                <strong>Sync alert:</strong> {error}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {compareIds.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
              >
                <Layers size={14} />
                <span>Compare {compareIds.length} Basins</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                  {compareIds.length}/2
                </span>
              </button>
            )}

            <button
              onClick={fetchExploreData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Refresh National Basin Readings"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Sync Basins</span>
            </button>
          </div>
        </div>

        {/* Basin National Stat Callouts */}
        {data && (
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-[var(--border-subtle)]">
            <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
              <div className="text-[10.5px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                National Basin Avg PM2.5
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight font-mono text-[var(--text-primary)]">
                  {formatNumber(data.nationalAveragePM25, 1)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">µg/m³</span>
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                Across 16 monitored basins
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
              <div className="text-[10.5px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                Highest Concentration
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight font-mono text-[#C26765]">
                  {formatNumber(data.highestCity?.pm2_5, 1)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">µg/m³</span>
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-[var(--text-primary)] truncate">
                {data.highestCity?.city.name}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
              <div className="text-[10.5px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                Lowest Concentration
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight font-mono text-[#476650]">
                  {formatNumber(data.lowestCity?.pm2_5, 1)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">µg/m³</span>
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-[var(--text-primary)] truncate">
                {data.lowestCity?.city.name}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
              <div className="text-[10.5px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                Pilot Reference Domain
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-semibold tracking-tight text-[var(--accent-primary)]">
                  Chandigarh Basin
                </span>
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                Active ML Random Forest
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Search by city, state, or geographic corridor (e.g., Delhi, Punjab, Coastal)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] shrink-0">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
            >
              <option value="PM25_DESC">Highest PM2.5 First</option>
              <option value="PM25_ASC">Lowest PM2.5 First</option>
              <option value="NAME_ASC">Basin Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] mr-1">
            Severity:
          </span>
          {(
            [
              { id: "ALL", label: "All Basins" },
              { id: "GOOD", label: "Good (<30)" },
              { id: "MODERATE", label: "Moderate (30-60)" },
              { id: "POOR", label: "Poor (60-90)" },
              { id: "VERY_POOR", label: "Very Poor (90-120)" },
              { id: "SEVERE", label: "Severe (>120)" },
            ] as const
          ).map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSeverityFilter(pill.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                severityFilter === pill.id
                  ? "bg-[var(--accent-primary)] text-white"
                  : "bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {pill.label}
            </button>
          ))}

          {compareIds.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[var(--accent-primary)] font-medium">
                {compareIds.length} basin{compareIds.length > 1 ? "s" : ""} pinned for comparison
              </span>
              <button
                onClick={() => setCompareIds([])}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Basins */}
      {loading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] animate-pulse"
            />
          ))}
        </div>
      ) : filteredCities.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-12 text-center">
          <AlertCircle size={28} className="mx-auto text-[var(--text-muted)] mb-3" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            No environmental basins matched your filters
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Try adjusting your search query or selecting a different severity threshold.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSeverityFilter("ALL");
            }}
            className="mt-4 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCities.map((item) => {
            const cat = getPM25Category(item.pm2_5);
            const isCurrent = currentCity.id === item.city.id;
            const isCompared = compareIds.includes(item.city.id);

            return (
              <div
                key={item.city.id}
                className={`rounded-xl border transition-all p-5 flex flex-col justify-between ${
                  isCurrent
                    ? "border-[var(--accent-primary)] bg-[var(--bg-secondary)] ring-1 ring-[var(--accent-primary)]/30"
                    : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-hover)]"
                }`}
              >
                {/* Basin Card Header */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-[var(--text-primary)]">
                          {item.city.name}
                        </h3>
                        {item.city.pilot && (
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono uppercase bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                            PILOT BASIN
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {item.city.state} · {item.city.region}
                      </div>
                    </div>

                    {/* Compare Checkbox Button */}
                    <button
                      onClick={() => toggleCompare(item.city.id)}
                      title={isCompared ? "Remove from comparison" : "Add to comparison"}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer text-xs ${
                        isCompared
                          ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
                          : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
                      }`}
                    >
                      {isCompared ? <Check size={13} /> : <Layers size={13} />}
                    </button>
                  </div>

                  {/* Primary Measurement Display */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                        PM2.5 Ambient
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-3xl font-semibold tracking-tight font-mono text-[var(--text-primary)]">
                          {formatNumber(item.pm2_5, 1)}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">µg/m³</span>
                      </div>
                    </div>

                    {/* Category Pill */}
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-medium border"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        borderColor: `${cat.color}35`,
                        color: cat.color,
                      }}
                    >
                      {cat.category}
                    </span>
                  </div>

                  {/* Mini Secondary Atmospheric Indicators */}
                  <div className="mt-4 grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono">
                    <div>
                      <div className="text-[9.5px] text-[var(--text-muted)] uppercase">PM10</div>
                      <div className="font-medium text-[var(--text-primary)] mt-0.5">
                        {formatNumber(item.pm10, 0)} <span className="text-[9px] text-[var(--text-muted)]">µg</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9.5px] text-[var(--text-muted)] uppercase">Temp</div>
                      <div className="font-medium text-[var(--text-primary)] mt-0.5">
                        {formatNumber(item.temperature, 1)}°C
                      </div>
                    </div>
                    <div>
                      <div className="text-[9.5px] text-[var(--text-muted)] uppercase">Wind</div>
                      <div className="font-medium text-[var(--text-primary)] mt-0.5">
                        {formatNumber(item.windSpeed, 1)} <span className="text-[9px] text-[var(--text-muted)]">km/h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basin Card Action */}
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="text-[10.5px] font-mono text-[var(--text-muted)]">
                    Elev: {item.city.elevationMeters}m
                  </div>

                  {isCurrent ? (
                    <button
                      onClick={onNavigateHome}
                      className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent-primary)] hover:underline cursor-pointer"
                    >
                      <span>View Active Telemetry</span>
                      <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectCity(item.city)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
                    >
                      <span>Switch to this Basin</span>
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Basin Comparison Modal */}
      {showCompareModal && comparedCities.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-[var(--accent-primary)]" />
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    Atmospheric Basin Comparison
                  </h2>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Side-by-side comparative environmental analysis across selected geographic basins
                </p>
              </div>

              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Basin Comparison Columns */}
            <div className={`grid gap-6 ${comparedCities.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
              {comparedCities.map((c) => {
                const cat = getPM25Category(c.pm2_5);
                const guidance = HEALTH_GUIDANCE[cat.category];
                return (
                  <div
                    key={c.city.id}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          {c.city.name}
                        </h3>
                        <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                          {c.city.state} · {c.city.region}
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-md text-xs font-medium border"
                        style={{
                          backgroundColor: `${cat.color}15`,
                          borderColor: `${cat.color}35`,
                          color: cat.color,
                        }}
                      >
                        {cat.category}
                      </span>
                    </div>

                    {/* Primary Metric */}
                    <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                        Particulate Load (PM2.5)
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-3xl font-semibold font-mono text-[var(--text-primary)]">
                          {formatNumber(c.pm2_5, 1)}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">µg/m³</span>
                      </div>
                      <div className="mt-1 text-xs text-[var(--text-secondary)]">
                        NAAQS limit: 60 µg/m³ (24-hour)
                      </div>
                    </div>

                    {/* Secondary Matrix */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <div className="text-[10px] text-[var(--text-muted)]">PM10 COARSE</div>
                        <div className="font-semibold text-[var(--text-primary)] mt-0.5">
                          {formatNumber(c.pm10, 1)} µg/m³
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <div className="text-[10px] text-[var(--text-muted)]">TEMPERATURE</div>
                        <div className="font-semibold text-[var(--text-primary)] mt-0.5">
                          {formatNumber(c.temperature, 1)}°C
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <div className="text-[10px] text-[var(--text-muted)]">RELATIVE HUMIDITY</div>
                        <div className="font-semibold text-[var(--text-primary)] mt-0.5">
                          {formatNumber(c.humidity, 0)}%
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <div className="text-[10px] text-[var(--text-muted)]">WIND DISPERSION</div>
                        <div className="font-semibold text-[var(--text-primary)] mt-0.5">
                          {formatNumber(c.windSpeed, 1)} km/h
                        </div>
                      </div>
                    </div>

                    {/* Topography Info */}
                    <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs">
                      <div className="font-medium text-[var(--text-primary)] mb-1">
                        Regional Topography
                      </div>
                      <div className="text-[var(--text-secondary)]">
                        {c.city.description} (Elevation: {c.city.elevationMeters}m above MSL)
                      </div>
                    </div>

                    {/* Health Guidance Snapshot */}
                    <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs">
                      <div className="font-medium text-[var(--text-primary)] mb-1">
                        Recommended Action Protocol
                      </div>
                      <div className="text-[var(--text-secondary)]">
                        {guidance.outdoor}
                      </div>
                    </div>

                    {/* Select as active button */}
                    <button
                      onClick={() => {
                        onSelectCity(c.city);
                        setShowCompareModal(false);
                      }}
                      className="w-full py-2 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Make Active Location
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Differential Callout if 2 cities */}
            {comparedCities.length === 2 && (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 text-xs font-mono">
                <div className="font-medium text-[var(--text-primary)] mb-1">
                  Atmospheric Particulate Differential:
                </div>
                {(() => {
                  const [c1, c2] = comparedCities;
                  const v1 = c1.pm2_5 ?? 0;
                  const v2 = c2.pm2_5 ?? 0;
                  const diff = Math.abs(v1 - v2);
                  const higher = v1 > v2 ? c1.city.name : c2.city.name;
                  const lower = v1 > v2 ? c2.city.name : c1.city.name;
                  return (
                    <div className="text-[var(--text-secondary)]">
                      <strong>{higher}</strong> is currently experiencing a{" "}
                      <span className="text-[#C26765] font-semibold">
                        +{formatNumber(diff, 1)} µg/m³
                      </span>{" "}
                      higher fine particulate burden than <strong>{lower}</strong>.
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

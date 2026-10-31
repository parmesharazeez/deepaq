"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Clock,
  Layers,
  MapPin,
  Sun,
  Moon,
  LayoutDashboard,
  Compass,
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { StatusDot } from "./ui/StatusDot";
import { CityOption } from "../lib/constants";
import { formatRelativeTime } from "../lib/utils";
import { LocationBar } from "./LocationBar";
import { useTheme } from "../hooks/useTheme";

interface HeaderProps {
  apiHealthy: boolean;
  refreshing: boolean;
  lastUpdated: Date | null;
  latencyMs: number | null;
  autoRefresh: boolean;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
  selectedCity: CityOption;
  onSelectCity: (city: CityOption) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const VIEW_TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "explore", label: "Basins", icon: Compass },
  { id: "intelligence", label: "ML Intel", icon: BrainCircuit },
  { id: "trends", label: "Trends", icon: TrendingUp },
  { id: "health", label: "Health", icon: ShieldCheck },
  { id: "geography", label: "Map", icon: MapPin },
  { id: "methodology", label: "Methodology", icon: FileText },
];

export function Header({
  apiHealthy,
  refreshing,
  lastUpdated,
  latencyMs,
  autoRefresh,
  onRefresh,
  onToggleAutoRefresh,
  selectedCity,
  onSelectCity,
  activeSection,
  onNavigate,
}: HeaderProps) {
  const [, setTicker] = useState(0);
  const { theme, toggleTheme } = useTheme();

  // Re-render for relative sync time
  useEffect(() => {
    const timer = setInterval(() => setTicker((t) => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/95 px-4 py-2.5 backdrop-blur-md transition-all sm:px-6">
      <div className="mx-auto flex max-w-[1550px] flex-wrap items-center justify-between gap-3">
        {/* Left: Location Autocomplete Bar */}
        <div className="flex items-center gap-3">
          <LocationBar
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
          />

          <span className="hidden xl:inline-block h-3.5 w-px bg-[var(--border-subtle)]" />

          {/* Pilot Grid Tag */}
          <div className="hidden xl:flex items-center gap-1.5 font-mono text-[10.5px] text-[var(--text-muted)]">
            <Layers size={11} className="text-[var(--text-secondary)]" />
            <span>GRID: ~11km ECMWF/CAMS</span>
          </div>
        </div>

        {/* Center: Top View Switcher Navigation Pills (hidden on smaller screens where sidebar or bottom bar handles it) */}
        <nav className="hidden 2xl:flex items-center gap-1 p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon
                  size={13}
                  className={isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Telemetry Connectivity, Sync, Theme Toggle & Refresh */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* Theme switcher button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            className="flex items-center p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {theme === "light" ? (
              <Moon size={14} className="text-[var(--text-secondary)]" />
            ) : (
              <Sun size={14} className="text-amber-400" />
            )}
          </button>

          {/* API Connectivity Indicator */}
          <div
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[10px] font-mono"
            title={`API Telemetry | Latency: ${latencyMs ?? "--"}ms`}
          >
            <StatusDot status={apiHealthy ? "online" : "error"} size="sm" />
            <span className="hidden sm:inline text-[var(--text-muted)]">API:</span>
            <span className="font-medium text-[var(--text-primary)]">
              {apiHealthy ? "ONLINE" : "OFFLINE"}
            </span>
            {latencyMs !== null && (
              <span className="text-[var(--text-muted)] ml-0.5">
                {latencyMs}ms
              </span>
            )}
          </div>

          {/* Last Sync Time */}
          <div
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[10px] font-mono text-[var(--text-secondary)]"
            title={lastUpdated ? `Exact: ${lastUpdated.toLocaleTimeString()}` : "Not synced"}
          >
            <Clock size={11} className="text-[var(--text-muted)]" />
            <span className="hidden sm:inline text-[var(--text-muted)]">SYNC:</span>
            <span className="text-[var(--text-primary)] font-medium">
              {formatRelativeTime(lastUpdated)}
            </span>
          </div>

          {/* Auto Refresh Toggle */}
          <button
            onClick={onToggleAutoRefresh}
            className={`hidden lg:flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-mono transition-colors cursor-pointer ${
              autoRefresh
                ? "border-[var(--border-hover)] bg-[var(--surface-elevated)] text-[var(--accent-primary)] font-medium"
                : "border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
            title="Auto-refresh telemetry every 60 seconds"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                autoRefresh ? "bg-[var(--accent-primary)]" : "bg-[var(--text-muted)]"
              }`}
            />
            <span>LIVE</span>
          </button>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-subtle)] active:scale-95 px-3 py-1 text-xs font-mono font-medium text-[var(--text-primary)] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            title="Fetch latest meteorological and aerosol telemetry"
          >
            <RefreshCw
              size={11}
              className={`transition-transform text-[var(--accent-primary)] ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span>{refreshing ? "SYNCING" : "REFRESH"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

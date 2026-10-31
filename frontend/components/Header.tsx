"use client";

import React from "react";
import {
  Sun,
  Moon,
  LayoutDashboard,
  Compass,
  Layers,
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { CityOption } from "../lib/constants";
import { LocationBar } from "./LocationBar";
import { useTheme } from "../hooks/useTheme";

interface HeaderProps {
  apiHealthy: boolean;
  selectedCity: CityOption;
  onSelectCity: (city: CityOption) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const VIEW_TABS = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "basin-intel", label: "Basin Intel", icon: Compass },
  { id: "trends", label: "24h Forecast", icon: TrendingUp },
  { id: "explore", label: "All Basins", icon: Layers },
  { id: "intelligence", label: "ML Model", icon: BrainCircuit },
  { id: "health", label: "Health Guide", icon: ShieldCheck },
  { id: "methodology", label: "About", icon: FileText },
];

export function Header({
  apiHealthy,
  selectedCity,
  onSelectCity,
  activeSection,
  onNavigate,
}: HeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/95 px-4 py-3 backdrop-blur-md transition-colors sm:px-6">
      <div className="mx-auto flex max-w-[1550px] flex-wrap items-center justify-between gap-3">
        {/* Left: Location Selector & Indicator */}
        <div className="flex items-center gap-3">
          <LocationBar
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
          />

          {/* Simple Live status badge (Zero developer controls or sync counters) */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              apiHealthy
                ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400"
            }`}
            title={apiHealthy ? "Live atmospheric observations actively feeding ML engine" : "Reconnecting to atmospheric telemetry..."}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                apiHealthy ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span className="font-mono text-[11px] tracking-wide uppercase font-semibold">
              {apiHealthy ? "LIVE" : "SYNCING"}
            </span>
          </div>
        </div>

        {/* Center: Top Segment Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs font-semibold ring-1 ring-[var(--border-hover)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon
                  size={14}
                  className={
                    isActive
                      ? "text-[var(--accent-primary)]"
                      : "text-[var(--text-muted)]"
                  }
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Switcher Toggle (Comfortable, large, clear) */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            suppressHydrationWarning
            aria-label={`Switch to ${mounted && theme === "dark" ? "Light" : "Dark"} mode`}
            title={`Switch to ${mounted && theme === "dark" ? "Light" : "Dark"} mode`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-subtle)] text-[var(--text-primary)] text-xs font-medium transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {!mounted || theme === "light" ? (
              <>
                <Moon size={14} className="text-[var(--accent-secondary)]" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun size={14} className="text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

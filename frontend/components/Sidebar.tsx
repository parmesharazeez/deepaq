"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Flame,
  Compass,
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  MapPin,
  FileText,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { PILOT_METADATA, CityOption } from "../lib/constants";
import { Logo } from "./ui/Logo";
import { useTheme } from "../hooks/useTheme";

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  apiHealthy: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedCity?: CityOption;
  onOpenCitySelect?: () => void;
  onOpenWelcome?: () => void;
}

const NAV_ITEMS = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "diwali", label: "Diwali Special", icon: Flame, badge: "FESTIVAL" },
  { id: "trends", label: "24h Forecast", icon: TrendingUp },
  { id: "explore", label: "All Basins", icon: Compass, badge: "16" },
  { id: "intelligence", label: "ML Model", icon: BrainCircuit, badge: "1H" },
  { id: "health", label: "Health Guide", icon: ShieldCheck },
  { id: "geography", label: "Spatial Map", icon: MapPin },
  { id: "methodology", label: "Methodology", icon: FileText },
];

export function Sidebar({
  activeSection,
  onNavigate,
  apiHealthy,
  collapsed,
  onToggleCollapse,
  selectedCity,
  onOpenCitySelect,
  onOpenWelcome,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between select-none">
      <div>
        {/* Brand Header */}
        <div
          className={`border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] transition-all ${
            collapsed ? "p-3 flex flex-col items-center" : "px-4 py-4"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {collapsed ? (
              <button
                onClick={onOpenWelcome}
                title="DEEPAQ Home"
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <Image
                  src="/deepaq-icon.png"
                  alt="DEEPAQ"
                  width={24}
                  height={24}
                  priority
                  className="object-contain rounded-md"
                />
              </button>
            ) : (
              <Logo size="sm" onClick={onOpenWelcome} />
            )}

            {/* Collapse toggle button on desktop */}
            <button
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={`hidden lg:flex p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer ${
                collapsed ? "mt-3" : ""
              }`}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Active Domain Location Pill (when expanded) */}
          {!collapsed && (
            <button
              onClick={onOpenCitySelect}
              className="mt-3 w-full text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-subtle)] px-3 py-2 flex items-center justify-between text-xs transition-all cursor-pointer group shadow-xs"
              title="Change Active Environmental Basin"
            >
              <span className="flex items-center gap-2 text-[var(--text-primary)] truncate font-medium">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] shrink-0" />
                <span className="truncate">{selectedCity?.name || PILOT_METADATA.city}</span>
              </span>
              <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] text-[10px] uppercase font-mono font-semibold shrink-0">
                SWITCH
              </span>
            </button>
          )}
        </div>

        {/* Navigation Rail */}
        <nav className="p-2 space-y-1">
          {!collapsed && (
            <p className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-muted)] font-semibold">
              Platform Views
            </p>
          )}

          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isDiwali = item.id === "diwali";

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? `${idx + 1}. ${item.label}` : undefined}
                className={`w-full flex items-center rounded-xl transition-all text-xs font-medium group cursor-pointer ${
                  collapsed
                    ? "justify-center p-2.5"
                    : "justify-between px-3 py-2.5 text-left"
                } ${
                  isActive
                    ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-hover)] font-semibold shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? "text-[var(--accent-primary)]"
                        : isDiwali
                        ? "text-amber-500 animate-pulse"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}
                </div>
                {!collapsed && item.badge && (
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full font-semibold border ${
                      isDiwali
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-subtle)]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: System Status & Theme Switcher */}
      <div
        className={`border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] ${
          collapsed ? "p-2.5 flex flex-col items-center" : "p-3 space-y-2.5"
        }`}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] cursor-pointer"
            >
              {theme === "light" ? <Moon size={14} /> : <Sun size={14} className="text-amber-400" />}
            </button>
            <span
              className={`h-2 w-2 rounded-full ${
                apiHealthy ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span>Model Engine:</span>
                <span className="text-[var(--accent-primary)] font-semibold font-mono text-[11px]">
                  Random Forest
                </span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span>Validation MAE:</span>
                <span className="text-[var(--text-primary)] font-mono text-[11px]">
                  ±2.96 µg/m³
                </span>
              </div>
            </div>

            {/* Theme switcher button in expanded sidebar */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-subtle)] text-xs text-[var(--text-primary)] font-medium transition-all cursor-pointer shadow-xs"
            >
              <span className="flex items-center gap-2">
                {theme === "light" ? (
                  <Moon size={14} className="text-[var(--accent-secondary)]" />
                ) : (
                  <Sun size={14} className="text-amber-400" />
                )}
                <span className="capitalize">{theme === "light" ? "Switch to Dark" : "Switch to Light"}</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">MODE</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--bg-secondary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 py-2.5 flex items-center justify-between">
        <Logo size="sm" onClick={onOpenWelcome} />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-primary)] cursor-pointer"
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} className="text-amber-400" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation rail"
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] cursor-pointer"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop Sidebar Rail */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] z-30 transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}

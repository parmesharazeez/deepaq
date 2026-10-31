"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
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
import { StatusDot } from "./ui/StatusDot";
import { PILOT_METADATA, CityOption } from "../lib/constants";
import { Logo } from "./ui/Logo";
import { useTheme } from "../hooks/useTheme";

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  apiHealthy: boolean;
  latencyMs: number | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedCity?: CityOption;
  onOpenCitySelect?: () => void;
  onOpenWelcome?: () => void;
}

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "explore", label: "Basin Explorer", icon: Compass, badge: "16" },
  { id: "intelligence", label: "ML Intelligence", icon: BrainCircuit, badge: "1H" },
  { id: "trends", label: "Trends & 72h", icon: TrendingUp },
  { id: "health", label: "Health Protocols", icon: ShieldCheck },
  { id: "geography", label: "Spatial Geography", icon: MapPin },
  { id: "methodology", label: "Methodology", icon: FileText },
];

export function Sidebar({
  activeSection,
  onNavigate,
  apiHealthy,
  latencyMs,
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
              className={`hidden lg:flex p-1 rounded-md border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer ${
                collapsed ? "mt-3" : ""
              }`}
            >
              {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>
          </div>

          {/* Active Domain Location Pill (when expanded) */}
          {!collapsed && (
            <button
              onClick={onOpenCitySelect}
              className="mt-3 w-full text-left rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-subtle)] px-2.5 py-1.5 flex items-center justify-between text-[11px] font-mono transition-colors cursor-pointer group"
              title="Change Active Environmental Basin"
            >
              <span className="flex items-center gap-1.5 text-[var(--text-primary)] truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] shrink-0" />
                <span className="truncate">{selectedCity?.name || PILOT_METADATA.city}</span>
              </span>
              <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] text-[9.5px] uppercase shrink-0">
                SWITCH
              </span>
            </button>
          )}
        </div>

        {/* Navigation Rail */}
        <nav className="p-2 space-y-0.5">
          {!collapsed && (
            <p className="px-3 pt-2 pb-1.5 text-[9.5px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Intelligence Views
            </p>
          )}

          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? `${idx + 1}. ${item.label}` : undefined}
                className={`w-full flex items-center rounded-lg transition-colors text-xs font-medium group cursor-pointer ${
                  collapsed
                    ? "justify-center p-2.5"
                    : "justify-between px-3 py-2 text-left"
                } ${
                  isActive
                    ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-hover)] font-semibold shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={15}
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? "text-[var(--accent-primary)]"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}
                </div>
                {!collapsed && item.badge && (
                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
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
          collapsed ? "p-2.5 flex flex-col items-center" : "p-3 space-y-2"
        }`}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] cursor-pointer"
            >
              {theme === "light" ? <Moon size={13} /> : <Sun size={13} />}
            </button>
            <StatusDot status={apiHealthy ? "online" : "error"} size="sm" />
            <span className="font-mono text-[9px] text-[var(--text-muted)]">
              {latencyMs !== null ? `${latencyMs}ms` : "--"}
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-2.5 font-mono text-[10.5px] space-y-1">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span>Telemetry:</span>
                <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-medium">
                  <StatusDot status={apiHealthy ? "online" : "error"} size="sm" />
                  {apiHealthy ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span>Model Engine:</span>
                <span className="text-[var(--accent-primary)] font-medium">
                  RandomForest
                </span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span>Latency:</span>
                <span className="text-[var(--text-secondary)]">
                  {latencyMs !== null ? `${latencyMs}ms` : "--"}
                </span>
              </div>
            </div>

            {/* Quick theme toggle in expanded state */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-subtle)] text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                {theme === "light" ? <Sun size={12} className="text-amber-600" /> : <Moon size={12} className="text-blue-400" />}
                <span className="capitalize">{theme} Theme</span>
              </span>
              <span className="text-[9.5px] uppercase text-[var(--text-muted)]">TOGGLE</span>
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
            className="p-1.5 rounded-md border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation rail"
            className="p-1.5 rounded-md border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] cursor-pointer"
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

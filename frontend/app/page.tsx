"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  RefreshCw,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// Dedicated Intelligence Views
import { HomeView } from "../components/views/HomeView";
import { ExploreView } from "../components/views/ExploreView";
import { IntelligenceView } from "../components/views/IntelligenceView";
import { TrendsView } from "../components/views/TrendsView";
import { HealthView } from "../components/views/HealthView";
import { MethodologyView } from "../components/views/MethodologyView";
import { GeographicIntelligence } from "../components/GeographicIntelligence";

// Cinematic Entry Experience Components
import { AtmosphericBackground } from "../components/entry/AtmosphericBackground";
import { WelcomeScreen } from "../components/entry/WelcomeScreen";
import { CitySelectionScreen } from "../components/entry/CitySelectionScreen";
import { TransitionScreen } from "../components/entry/TransitionScreen";
import { CITIES_DIRECTORY, CityOption } from "../lib/constants";

type ScreenState = "welcome" | "city-select" | "transition" | "dashboard";

export default function Home() {
  // City state
  const [selectedCity, setSelectedCity] = useState<CityOption>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("deepaq_selected_city");
        if (stored) {
          const parsed: CityOption = JSON.parse(stored);
          if (parsed && parsed.name) return parsed;
        }
      } catch {}
    }
    return CITIES_DIRECTORY[0];
  });

  const [savedCityName, setSavedCityName] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("deepaq_selected_city");
        if (stored) {
          const parsed: CityOption = JSON.parse(stored);
          if (parsed && parsed.name) return parsed.name;
        }
      } catch {}
    }
    return null;
  });

  // Screen state machine: if user has already visited, go directly to dashboard
  const [screen, setScreen] = useState<ScreenState>(() => {
    if (typeof window !== "undefined") {
      try {
        const visited = localStorage.getItem("deepaq_visited");
        if (visited === "true") return "dashboard";
      } catch {}
    }
    return "dashboard"; // Production default: fast direct entry
  });

  // Active view section
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load telemetry data tied to the currently selected city
  const {
    dashboard,
    prediction,
    forecast,
    health,
    forecastHours,
    loading,
    refreshing,
    error,
    lastUpdated,
    latencyMs,
    autoRefresh,
    setAutoRefresh,
    setForecastHours,
    refreshData,
  } = useDashboardData(selectedCity);

  // Switch view tabs smoothly
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle City Selection
  const handleSelectCity = (city: CityOption) => {
    setSelectedCity(city);
    setSavedCityName(city.name);
    try {
      localStorage.setItem("deepaq_selected_city", JSON.stringify(city));
      localStorage.setItem("deepaq_visited", "true");
    } catch {}
  };

  const handleStartFromWelcome = (city: CityOption) => {
    handleSelectCity(city);
    setScreen("transition");
  };

  const currentPM25 = dashboard?.air_quality?.values?.pm2_5;
  const predictedPM25 = prediction?.prediction?.predicted_value;
  const apiHealthy = health?.status === "healthy" || dashboard !== null;
  const isDataReady = !loading && dashboard !== null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-200">
      {/* SCREEN 1: WELCOME SCREEN */}
      {screen === "welcome" && (
        <>
          <AtmosphericBackground />
          <WelcomeScreen
            onStart={() => setScreen("city-select")}
            savedCityName={savedCityName}
            onDirectLaunchSaved={() => setScreen("dashboard")}
          />
        </>
      )}

      {/* SCREEN 2: CITY SELECTION SCREEN */}
      {screen === "city-select" && (
        <>
          <AtmosphericBackground />
          <CitySelectionScreen
            onSelectCity={handleStartFromWelcome}
            onBack={() => setScreen("welcome")}
            initialSelectedId={selectedCity.id}
          />
        </>
      )}

      {/* SCREEN 3: TRANSITION SCREEN */}
      {screen === "transition" && (
        <>
          <AtmosphericBackground />
          <TransitionScreen
            city={selectedCity}
            isDataReady={isDataReady}
            error={error}
            onRetry={refreshData}
            onComplete={() => {
              try {
                localStorage.setItem("deepaq_visited", "true");
              } catch {}
              setScreen("dashboard");
            }}
            onBackToCitySelect={() => setScreen("city-select")}
          />
        </>
      )}

      {/* SCREEN 4: PRODUCTION ENVIRONMENTAL INTELLIGENCE PLATFORM */}
      {screen === "dashboard" && (
        <div className="relative min-h-screen bg-[var(--bg-primary)] flex flex-col">
          {/* Sidebar Rail */}
          <Sidebar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            apiHealthy={apiHealthy}
            latencyMs={latencyMs}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            selectedCity={selectedCity}
            onOpenCitySelect={() => setActiveSection("explore")}
            onOpenWelcome={() => setScreen("welcome")}
          />

          {/* Main Content Area */}
          <div
            className={`flex flex-col min-h-screen pt-12 lg:pt-0 transition-all duration-300 ${
              sidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
            }`}
          >
            {/* Top Header */}
            <Header
              apiHealthy={apiHealthy}
              refreshing={refreshing}
              lastUpdated={lastUpdated}
              latencyMs={latencyMs}
              autoRefresh={autoRefresh}
              onRefresh={refreshData}
              onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
              selectedCity={selectedCity}
              onSelectCity={handleSelectCity}
              activeSection={activeSection}
              onNavigate={handleNavigate}
            />

            {/* Non-Pilot City ML Scope Notice */}
            {!selectedCity.pilot && (
              <div className="max-w-[1550px] w-full mx-auto px-4 sm:px-6 md:px-7 pt-4">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3.5 text-xs font-mono text-[var(--text-secondary)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[var(--accent-primary)] shrink-0" />
                    <span>
                      <strong className="text-[var(--text-primary)]">Domain Scope ({selectedCity.name}):</strong> Live atmospheric telemetry is actively ingested for {selectedCity.name}. ML Random Forest weights are calibrated on the <strong>Chandigarh reference basin</strong>.
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelectCity(CITIES_DIRECTORY[0])}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer text-[11px] font-medium"
                  >
                    <span>Switch to Chandigarh Pilot</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Dashboard Canvas */}
            <main className="flex-1 px-4 sm:px-6 md:px-7 py-5 space-y-6 max-w-[1550px] w-full mx-auto">
              {/* Telemetry Alert (if fetch failed) */}
              {error && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#C26765]/30 bg-[var(--bg-secondary)] p-3.5 text-[#C26765]">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle size={16} className="text-[#C26765] shrink-0" />
                    <div className="text-xs font-mono">
                      <strong className="font-semibold text-[var(--text-primary)]">
                        Telemetry Notice:
                      </strong>{" "}
                      {error}
                    </div>
                  </div>
                  <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-xs font-mono text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw
                      size={11}
                      className={refreshing ? "animate-spin" : ""}
                    />
                    <span>Retry Sync</span>
                  </button>
                </div>
              )}

              {/* VIEW 1: OVERVIEW / HOME VIEW */}
              {activeSection === "overview" && (
                <HomeView
                  city={selectedCity}
                  dashboard={dashboard}
                  forecast={forecast}
                  prediction={prediction}
                  onNavigateTab={handleNavigate}
                />
              )}

              {/* VIEW 2: MULTI-BASIN EXPLORER */}
              {activeSection === "explore" && (
                <ExploreView
                  currentCity={selectedCity}
                  onSelectCity={(city) => {
                    handleSelectCity(city);
                    handleNavigate("overview");
                  }}
                  onNavigateHome={() => handleNavigate("overview")}
                />
              )}

              {/* VIEW 3: ML INTELLIGENCE & BOUNDARY LAYER PHYSICS */}
              {activeSection === "intelligence" && (
                <IntelligenceView
                  city={selectedCity}
                  dashboard={dashboard}
                  forecast={forecast}
                  prediction={prediction}
                  onNavigateTab={handleNavigate}
                />
              )}

              {/* VIEW 4: TRENDS & 72-HOUR PROJECTION */}
              {activeSection === "trends" && (
                <TrendsView
                  city={selectedCity}
                  dashboard={dashboard}
                  forecast={forecast}
                  forecastHours={forecastHours}
                  onSelectHours={setForecastHours}
                />
              )}

              {/* VIEW 5: PUBLIC HEALTH & ACTION PROTOCOLS */}
              {activeSection === "health" && (
                <HealthView
                  city={selectedCity}
                  dashboard={dashboard}
                />
              )}

              {/* VIEW 6: SPATIAL GEOGRAPHY & GIS MAPPING */}
              {activeSection === "geography" && (
                <GeographicIntelligence
                  currentPM25={currentPM25}
                  predictedPM25={predictedPM25}
                />
              )}

              {/* VIEW 7: SCIENTIFIC METHODOLOGY & MODEL CARD */}
              {activeSection === "methodology" && (
                <MethodologyView />
              )}
            </main>

            {/* Global Footer */}
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  MapPin,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// Dedicated Platform Views
import { HomeView } from "../components/views/HomeView";
import { DiwaliView } from "../components/views/DiwaliView";
import { ExploreView } from "../components/views/ExploreView";
import { IntelligenceView } from "../components/views/IntelligenceView";
import { TrendsView } from "../components/views/TrendsView";
import { HealthView } from "../components/views/HealthView";
import { MethodologyView } from "../components/views/MethodologyView";
import { GeographicIntelligence } from "../components/GeographicIntelligence";

// Educational Loading Experience with Respiratory Facts
import { EducationalLoader } from "../components/ui/EducationalLoader";

// Cinematic Entry Experience Components (Optional on-demand access)
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

  // Screen state machine: Production defaults directly to the main dashboard
  const [screen, setScreen] = useState<ScreenState>("dashboard");

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
    error,
    refreshData,
    setForecastHours,
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
      {/* GENUINE LOADING SCREEN: PM2.5 RESPIRATORY HEALTH EDUCATION */}
      {loading && !dashboard && (
        <EducationalLoader message={`Retrieving atmospheric telemetry for ${selectedCity.name}...`} />
      )}

      {/* SCREEN 1: WELCOME SCREEN (ACCESSIBLE VIA LOGO CLICK) */}
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
            onComplete={() => setScreen("dashboard")}
            onBackToCitySelect={() => setScreen("city-select")}
          />
        </>
      )}

      {/* SCREEN 4: PRODUCTION HACKATHON-WINNING ENVIRONMENTAL PLATFORM */}
      {screen === "dashboard" && (
        <div className="relative min-h-screen bg-[var(--bg-primary)] flex flex-col">
          {/* Navigation Sidebar Rail */}
          <Sidebar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            apiHealthy={apiHealthy}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            selectedCity={selectedCity}
            onOpenCitySelect={() => setActiveSection("explore")}
            onOpenWelcome={() => setScreen("welcome")}
          />

          {/* Main Dashboard Canvas Area */}
          <div
            className={`flex flex-col min-h-screen pt-12 lg:pt-0 transition-all duration-300 ${
              sidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
            }`}
          >
            {/* Minimalist Top Header (Zero Developer Buttons) */}
            <Header
              apiHealthy={apiHealthy}
              selectedCity={selectedCity}
              onSelectCity={handleSelectCity}
              activeSection={activeSection}
              onNavigate={handleNavigate}
            />

            {/* Non-Pilot City Machine Learning Notice */}
            {!selectedCity.pilot && (
              <div className="max-w-[1550px] w-full mx-auto px-4 sm:px-6 md:px-7 pt-4">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3.5 text-xs text-[var(--text-secondary)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[var(--accent-primary)] shrink-0" />
                    <span>
                      <strong className="text-[var(--text-primary)]">Domain Scope ({selectedCity.name}):</strong> Live atmospheric telemetry is actively feeding from Open-Meteo. Our primary Random Forest weights are trained on the <strong>Chandigarh reference basin</strong>.
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelectCity(CITIES_DIRECTORY[0])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer text-xs font-semibold"
                  >
                    <span>Switch to Chandigarh Pilot</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Main Content View Container */}
            <main className="flex-1 px-4 sm:px-6 md:px-7 py-6 space-y-6 max-w-[1550px] w-full mx-auto">
              {/* Subtle Stale Telemetry Notice (If offline) */}
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 font-medium">
                  <AlertCircle size={15} className="text-amber-600 shrink-0" />
                  <span>Showing cached observation. Reconnecting to atmospheric feed...</span>
                </div>
              )}

              {/* VIEW 1: OVERVIEW / HOMEPAGE */}
              {activeSection === "overview" && (
                <HomeView
                  city={selectedCity}
                  dashboard={dashboard}
                  forecast={forecast}
                  prediction={prediction}
                  onNavigateTab={handleNavigate}
                />
              )}

              {/* VIEW 2: DIWALI ATMOSPHERIC SCIENCE & FESTIVAL HUB */}
              {activeSection === "diwali" && (
                <DiwaliView
                  city={selectedCity}
                  dashboard={dashboard}
                  prediction={prediction}
                  onNavigateTab={handleNavigate}
                />
              )}

              {/* VIEW 3: 24-HOUR & 72-HOUR FORECAST TRENDS */}
              {activeSection === "trends" && (
                <TrendsView
                  city={selectedCity}
                  dashboard={dashboard}
                  forecast={forecast}
                  forecastHours={forecastHours}
                  onSelectHours={setForecastHours}
                />
              )}

              {/* VIEW 4: MULTI-BASIN ALL-INDIA EXPLORER */}
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

              {/* VIEW 5: ML PREDICTION & BOUNDARY LAYER PHYSICS */}
              {activeSection === "intelligence" && (
                <IntelligenceView
                  city={selectedCity}
                  dashboard={dashboard}
                  forecast={forecast}
                  prediction={prediction}
                  onNavigateTab={handleNavigate}
                />
              )}

              {/* VIEW 6: PUBLIC HEALTH & ACTION PROTOCOLS */}
              {activeSection === "health" && (
                <HealthView
                  city={selectedCity}
                  dashboard={dashboard}
                />
              )}

              {/* VIEW 7: SPATIAL GEOGRAPHY & GIS MAPPING */}
              {activeSection === "geography" && (
                <GeographicIntelligence
                  currentPM25={currentPM25}
                  predictedPM25={predictedPM25}
                />
              )}

              {/* VIEW 8: SCIENTIFIC METHODOLOGY & MODEL CARD */}
              {activeSection === "methodology" && (
                <MethodologyView />
              )}
            </main>

            {/* Global Editorial Footer */}
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}

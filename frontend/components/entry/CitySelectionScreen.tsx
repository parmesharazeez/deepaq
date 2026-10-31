"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Navigation,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { CITIES_DIRECTORY, CityOption, PILOT_METADATA } from "../../lib/constants";
import { Logo } from "../ui/Logo";

interface CitySelectionScreenProps {
  onSelectCity: (city: CityOption) => void;
  onBack: () => void;
  initialSelectedId?: string;
}

export function CitySelectionScreen({
  onSelectCity,
  onBack,
  initialSelectedId = "chandigarh",
}: CitySelectionScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<CityOption>(() => {
    return (
      CITIES_DIRECTORY.find((c) => c.id === initialSelectedId) ||
      CITIES_DIRECTORY[0]
    );
  });
  const [locating, setLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Filter cities by search term
  const filteredCities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return CITIES_DIRECTORY;
    return CITIES_DIRECTORY.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Handle Geolocation
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice("Geolocation is not supported by your browser. Please select manually.");
      return;
    }

    setLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const distKm = Math.round(
          Math.sqrt(
            Math.pow((lat - PILOT_METADATA.latitude) * 111, 2) +
            Math.pow((lon - PILOT_METADATA.longitude) * 96, 2)
          )
        );

        if (distKm <= 120) {
          setSelectedCity(CITIES_DIRECTORY[0]);
          setLocationNotice(`Detected proximity to Chandigarh (${distKm} km). Selected Chandigarh ML Pilot.`);
        } else {
          setLocationNotice(
            `Location detected at ${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E (~${distKm} km from Chandigarh). Note: DEEPAQ ML model is currently calibrated specifically for the Chandigarh pilot basin.`
          );
        }
      },
      () => {
        setLocating(false);
        setLocationNotice("Location access was not granted. Manual selection is always available.");
      },
      { timeout: 8000 }
    );
  };

  const handleConfirm = () => {
    try {
      localStorage.setItem("deepaq_selected_city", JSON.stringify(selectedCity));
    } catch {
      // Ignore storage errors
    }
    onSelectCity(selectedCity);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between px-4 sm:px-8 lg:px-16 py-8 sm:py-10 z-10 max-w-4xl mx-auto w-full select-none">
      {/* Top Navigation */}
      <div className="flex items-center justify-between w-full border-b border-[#30312C] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-[#A5A69E] hover:text-[#F1F0E9] transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>

        <Logo size="sm" showWordmark={true} />
      </div>

      {/* Main Content Area */}
      <main className="my-auto py-8 sm:py-12 max-w-xl mx-auto w-full">
        {/* Title & Subtitle */}
        <div className="text-center mb-8 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A5B39A] font-medium">
            Geographic Scope
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#F1F0E9]">
            Where should we look?
          </h2>
          <p className="text-xs sm:text-sm text-[#A5A69E] font-normal leading-relaxed max-w-md mx-auto">
            Select a target basin. DEEPAQ&apos;s trained Random Forest model is actively deployed and calibrated for the Chandigarh pilot domain.
          </p>
        </div>

        {/* Search Bar & Use Location Row */}
        <div className="space-y-3 mb-6">
          <div className="relative flex items-center">
            <Search
              size={15}
              className="absolute left-3.5 text-[#70716A] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, state or atmospheric basin..."
              className="w-full rounded-md border border-[#30312C] bg-[#191A17] pl-10 pr-10 py-2.5 text-sm font-sans text-[#F1F0E9] placeholder-[#70716A] focus:outline-none focus:border-[#A5B39A] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 text-[#70716A] hover:text-[#F1F0E9]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <button
              onClick={handleUseLocation}
              disabled={locating}
              className="flex items-center gap-1.5 text-[#7E92A0] hover:text-[#A5B39A] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Navigation size={12} className={locating ? "animate-spin" : ""} />
              <span>{locating ? "Locating..." : "Use Current Location"}</span>
            </button>

            <span className="text-[11px] text-[#70716A]">
              {filteredCities.length} domain{filteredCities.length === 1 ? "" : "s"} listed
            </span>
          </div>

          {/* Location Notice Message */}
          {locationNotice && (
            <div className="rounded-md border border-[#30312C] bg-[#20211E] p-3 text-xs font-mono text-[#A5A69E] flex items-start gap-2">
              <Info size={14} className="text-[#7E92A0] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">{locationNotice}</div>
            </div>
          )}
        </div>

        {/* Cities Directory List */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {filteredCities.map((city) => {
            const isSelected = selectedCity.id === city.id;
            const isPilot = city.pilot;

            return (
              <div
                key={city.id}
                onClick={() => setSelectedCity(city)}
                className={`group rounded-md border p-3.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "border-[#A5B39A] bg-[#20211E]"
                    : "border-[#30312C] bg-[#191A17] hover:bg-[#20211E]/70"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`mt-0.5 p-1.5 rounded transition-colors ${
                      isSelected
                        ? "bg-[#A5B39A]/15 text-[#A5B39A]"
                        : "bg-[#20211E] text-[#70716A] group-hover:text-[#A5A69E]"
                    }`}
                  >
                    <MapPin size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-medium tracking-tight text-[#F1F0E9]">
                        {city.name}
                      </h4>
                      <span className="text-[11px] font-mono text-[#70716A]">
                        ({city.state})
                      </span>
                      {isPilot ? (
                        <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#A5B39A]/15 text-[#A5B39A] border border-[#A5B39A]/30">
                          ML PILOT ACTIVE
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#20211E] text-[#70716A] border border-[#30312C]">
                          EXPANSION
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#A5A69E] truncate">
                      {city.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#70716A] hidden sm:inline">
                    {city.latitude}° N
                  </span>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#A5B39A] bg-[#A5B39A] text-[#111210]"
                        : "border-[#30312C] bg-transparent"
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCities.length === 0 && (
            <div className="rounded-md border border-[#30312C] bg-[#191A17] p-8 text-center font-mono space-y-2">
              <AlertCircle size={18} className="mx-auto text-[#70716A]" />
              <p className="text-xs text-[#A5A69E]">
                No matching domain found for &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#A5B39A] hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Selected City Clarification / Scientific Rule Card */}
        <div className="mt-5 rounded-md border border-[#30312C] bg-[#191A17] p-3.5 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#70716A]">TARGET:</span>
            <span className="text-[#F1F0E9] font-semibold">{selectedCity.name}</span>
          </div>

          {!selectedCity.mlSupported ? (
            <div className="flex items-start gap-2 text-[11px] text-[#C4A977] leading-relaxed pt-1.5 border-t border-[#30312C]">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> The DEEPAQ Random Forest inference model is currently calibrated specifically on chronological data for the <strong>Chandigarh pilot basin</strong>. Exploring other cities will display available regional weather integration, while ML inference targets Chandigarh.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[11px] text-[#A5B39A] pt-1.5 border-t border-[#30312C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A5B39A]" />
              <span>Full 1-hour ML prediction, 72-hour forecast, and telemetry active for this domain.</span>
            </div>
          )}
        </div>

        {/* Launch Button */}
        <div className="mt-6">
          <button
            onClick={handleConfirm}
            className="w-full group flex items-center justify-center gap-2 rounded-md bg-[#A5B39A] hover:bg-[#B6C4AB] py-3 px-5 font-semibold text-sm text-[#111210] transition-colors cursor-pointer"
          >
            <span>Proceed to Atmospheric Intelligence</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="pt-4 border-t border-[#30312C] text-center text-[10.5px] font-mono text-[#70716A]">
        Domain selections persist across visits. No account required.
      </footer>
    </div>
  );
}

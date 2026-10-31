"use client";

import React, { useEffect } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  MapPin,
} from "lucide-react";
import { BRAND, PILOT_METADATA } from "../../lib/constants";
import { Logo } from "../ui/Logo";

interface WelcomeScreenProps {
  onStart: () => void;
  savedCityName?: string | null;
  onDirectLaunchSaved?: () => void;
}

export function WelcomeScreen({
  onStart,
  savedCityName,
  onDirectLaunchSaved,
}: WelcomeScreenProps) {
  // Press Enter to proceed immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-8 sm:py-12 z-10 max-w-6xl mx-auto w-full select-none">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between w-full">
        <Logo size="lg" />

        {/* Pilot Territory Metadata */}
        <div className="hidden sm:flex items-center gap-2 rounded-md border border-[#30312C] bg-[#191A17] px-3 py-1.5 text-xs font-mono text-[#A5A69E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A5B39A]" />
          <span>Active Pilot: {PILOT_METADATA.city} ({PILOT_METADATA.latitude}° N)</span>
        </div>
      </header>

      {/* Main Hero Narrative */}
      <main className="my-auto py-12 sm:py-20 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Subtle Brand Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#30312C] bg-[#191A17] px-3.5 py-1 text-xs font-mono text-[#A5B39A] mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A5B39A]" />
          <span className="tracking-wide uppercase text-[11px] font-medium">
            {BRAND.tagline}
          </span>
        </div>

        {/* Editorial Headlines */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.035em] text-[#F1F0E9] leading-[1.08] max-w-2xl">
          {BRAND.welcomeHeadline}
        </h1>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.035em] text-[#A5B39A] mt-2 sm:mt-3 leading-[1.12]">
          {BRAND.welcomeSupporting}
        </h2>

        {/* Short Product Description */}
        <p className="mt-6 sm:mt-8 max-w-xl text-sm sm:text-base text-[#A5A69E] font-normal leading-relaxed">
          {BRAND.description}
        </p>

        {/* Action Button & Saved City Quick Access */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onStart}
            className="group w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-md bg-[#A5B39A] hover:bg-[#B6C4AB] px-7 py-3 text-sm font-semibold text-[#111210] transition-colors cursor-pointer"
          >
            <span>Explore DEEPAQ</span>
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>

          {savedCityName && onDirectLaunchSaved && (
            <button
              onClick={onDirectLaunchSaved}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md border border-[#30312C] bg-[#191A17] hover:bg-[#20211E] px-5 py-3 text-xs sm:text-sm font-mono text-[#A5A69E] hover:text-[#F1F0E9] transition-colors cursor-pointer"
            >
              <MapPin size={13} className="text-[#A5B39A]" />
              <span>Resume with {savedCityName}</span>
            </button>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-mono text-[#70716A]">
          <kbd className="px-1.5 py-0.5 rounded border border-[#30312C] bg-[#191A17] text-[10px] text-[#A5A69E]">
            ↵ Enter
          </kbd>
          <span>to begin</span>
        </div>

        {/* Three Value Pillars */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl text-left">
          <div className="rounded-lg border border-[#30312C] bg-[#191A17] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-[#A5B39A] text-xs font-semibold">
              <Activity size={14} />
              <span>1-Hour ML Inference</span>
            </div>
            <p className="text-xs text-[#A5A69E] leading-relaxed">
              Random Forest model predicts short-term aerosol spikes before retrospective 24h indices update.
            </p>
          </div>

          <div className="rounded-lg border border-[#30312C] bg-[#191A17] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-[#7E92A0] text-xs font-semibold">
              <Layers size={14} />
              <span>Boundary Layer Physics</span>
            </div>
            <p className="text-xs text-[#A5A69E] leading-relaxed">
              Fuses surface temperature, humidity, wind azimuth, and diurnal solar cycles with particulate lags.
            </p>
          </div>

          <div className="rounded-lg border border-[#30312C] bg-[#191A17] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-[#C4A977] text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Scientific Transparency</span>
            </div>
            <p className="text-xs text-[#A5A69E] leading-relaxed">
              Zero synthetic heatmaps or fake sensors. Rigorous chronological 80/20 held-out verification.
            </p>
          </div>
        </div>
      </main>

      {/* Minimalist Footer */}
      <footer className="pt-6 border-t border-[#30312C] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#70716A]">
        <div>
          <span>DEEPAQ Atmospheric Intelligence</span>
          <span className="mx-2">·</span>
          <span>No authentication required</span>
        </div>
        <div>
          <span>Pilot Location: Chandigarh, India</span>
        </div>
      </footer>
    </div>
  );
}

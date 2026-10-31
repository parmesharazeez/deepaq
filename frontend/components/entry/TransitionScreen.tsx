"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Layers,
  Cpu,
  Activity,
} from "lucide-react";
import { CityOption } from "../../lib/constants";
import { Logo } from "../ui/Logo";

interface TransitionScreenProps {
  city: CityOption;
  isDataReady: boolean;
  error?: string | null;
  onRetry: () => void;
  onComplete: () => void;
  onBackToCitySelect: () => void;
}

const TRANSITION_STEPS = [
  { label: "Connecting to atmospheric observation models...", icon: Layers },
  { label: "Ingesting numerical weather prediction parameters...", icon: Activity },
  { label: "Synthesizing autoregressive particulate lag vectors...", icon: Cpu },
  { label: "Executing Random Forest 1-hour PM2.5 inference...", icon: Activity },
  { label: "Atmospheric intelligence synchronized.", icon: CheckCircle2 },
];

export function TransitionScreen({
  city,
  isDataReady,
  error,
  onRetry,
  onComplete,
  onBackToCitySelect,
}: TransitionScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Advance loading steps smoothly
  useEffect(() => {
    if (error) return;

    if (currentStep < TRANSITION_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else if (isDataReady) {
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(completeTimer);
    }
  }, [currentStep, isDataReady, error, onComplete]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between px-6 sm:px-10 py-10 z-10 max-w-3xl mx-auto w-full select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full border-b border-[#30312C] pb-4 text-xs font-mono text-[#70716A]">
        <button
          onClick={onBackToCitySelect}
          className="flex items-center gap-1.5 text-[#A5A69E] hover:text-[#F1F0E9] transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Change Domain</span>
        </button>

        <Logo size="sm" showWordmark={true} />
      </div>

      {/* Main Transition Canvas */}
      <main className="my-auto py-12 flex flex-col items-center text-center max-w-md mx-auto w-full">
        {/* Subtle, restrained status indicator */}
        {!error ? (
          <div className="relative mb-8 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-[#30312C] flex items-center justify-center bg-[#191A17]">
              <RefreshCw size={20} className="animate-spin text-[#A5B39A]" />
            </div>
          </div>
        ) : (
          <div className="relative mb-8 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-[#C26765]/40 flex items-center justify-center bg-[#191A17]">
              <AlertTriangle size={20} className="text-[#C26765]" />
            </div>
          </div>
        )}

        {/* Domain Title */}
        <div className="space-y-1.5 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A5B39A] font-medium">
            Synchronizing Basin
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F1F0E9]">
            {city.name}
          </h2>
          <p className="text-xs font-mono text-[#70716A]">
            {city.latitude}° N, {city.longitude}° E · {city.pilot ? "Pilot Basin" : "Expansion Domain"}
          </p>
        </div>

        {/* Step-by-Step Transition Telemetry Log */}
        {!error ? (
          <div className="w-full space-y-2.5 font-mono text-left bg-[#191A17] border border-[#30312C] rounded-lg p-4">
            {TRANSITION_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs transition-opacity duration-200 ${
                    isPast
                      ? "text-[#A5B39A] opacity-100"
                      : isCurrent
                      ? "text-[#F1F0E9] opacity-100 font-medium"
                      : "text-[#70716A] opacity-40"
                  }`}
                >
                  <div className="shrink-0">
                    {isPast ? (
                      <CheckCircle2 size={13} className="text-[#A5B39A]" />
                    ) : isCurrent ? (
                      <RefreshCw size={13} className="animate-spin text-[#A5B39A]" />
                    ) : (
                      <StepIcon size={13} />
                    )}
                  </div>
                  <span className="truncate text-[11px]">{step.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Graceful Error State */
          <div className="w-full rounded-lg border border-[#C26765]/30 bg-[#191A17] p-4 text-left font-mono space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C26765]">
              <AlertTriangle size={15} />
              <span>Data Stream Disconnected</span>
            </div>
            <p className="text-xs text-[#A5A69E] leading-relaxed">
              {error || "Unable to retrieve real-time atmospheric observations from the provider API."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#20211E] text-[#F1F0E9] border border-[#30312C] text-xs font-medium hover:bg-[#262723] transition-colors cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Retry Connection</span>
              </button>
              <button
                onClick={onBackToCitySelect}
                className="text-xs text-[#A5A69E] hover:text-[#F1F0E9] underline cursor-pointer"
              >
                Return to City Selection
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Status */}
      <footer className="pt-4 border-t border-[#30312C] flex items-center justify-between text-[11px] font-mono text-[#70716A]">
        <span>Atmospheric Intelligence Engine</span>
        <span className="text-[#A5B39A]">Synchronized</span>
      </footer>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HeartPulse, Activity } from "lucide-react";

const RESPIRATORY_FACTS = [
  {
    title: "Deep Alveolar Penetration",
    fact: "PM2.5 particles are ~30 times thinner than human hair. They bypass nasal cilia and penetrate deep into the microscopic alveoli where oxygen enters your bloodstream.",
    tag: "Respiratory Pathology",
  },
  {
    title: "Airway Inflammation & Asthma",
    fact: "Fine particulate matter triggers immediate epithelial inflammation in bronchial airways, precipitating acute asthma attacks, wheezing, and reduced lung capacity.",
    tag: "Clinical Impact",
  },
  {
    title: "Cardiovascular Systemic Strain",
    fact: "Sub-micron particulates cross the alveolar-capillary barrier into the circulatory system, promoting systemic inflammation, arterial constriction, and elevated cardiac risks.",
    tag: "Vascular Health",
  },
  {
    title: "Vulnerability in Developing Lungs",
    fact: "Children breathe 50% more air per kilogram of body weight than adults, causing significantly higher relative aerosol deposition during outdoor playtime.",
    tag: "Pediatric Vulnerability",
  },
  {
    title: "Senior Cardiovascular Vulnerability",
    fact: "In adults aged 65 and older, elevated particulate spikes place acute stress on pre-existing hypertension, ischemic heart disease, and chronic bronchitis.",
    tag: "Senior Exposure",
  },
  {
    title: "Diwali Thermal Inversion Entrapment",
    fact: "Post-Diwali cold night air forms a thermal inversion ceiling below 250 meters, trapping pyrotechnic and biomass smoke at human breathing level for hours.",
    tag: "Atmospheric Physics",
  },
];

interface EducationalLoaderProps {
  message?: string;
  onCancel?: () => void;
}

export function EducationalLoader({ message = "Calibrating atmospheric intelligence..." }: EducationalLoaderProps) {
  const [factIndex, setFactIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Rotate facts every 3.5 seconds
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % RESPIRATORY_FACTS.length);
    }, 3500);

    // Smooth subtle progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 12 : 92));
    }, 300);

    return () => {
      clearInterval(factInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentFact = RESPIRATORY_FACTS[factIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[var(--bg-primary)]/90 backdrop-blur-md transition-colors duration-300">
      <div className="relative w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-7 sm:p-9 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
        {/* Brand Monogram */}
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center h-14 w-14 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-xs">
            <Image
              src="/deepaq-icon.png"
              alt="DEEPAQ"
              width={34}
              height={34}
              priority
              className="object-contain"
            />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[var(--accent-primary)] ring-2 ring-[var(--bg-secondary)]" />
          </div>
        </div>

        {/* Status Heading */}
        <div className="space-y-1">
          <span className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-[var(--accent-primary)] font-semibold flex items-center justify-center gap-1.5">
            <Activity size={12} className="text-[var(--accent-primary)]" />
            <span>DEEPAQ Atmospheric Engine</span>
          </span>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            {message}
          </h2>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full h-1 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Educational Fact Card */}
        <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-left space-y-2 transition-all duration-300">
          <div className="flex items-center justify-between text-[10.5px] font-mono">
            <span className="flex items-center gap-1.5 text-[var(--accent-primary)] font-medium uppercase tracking-wider">
              <HeartPulse size={12} />
              <span>{currentFact.tag}</span>
            </span>
            <span className="text-[var(--text-muted)]">
              Fact {factIndex + 1} of {RESPIRATORY_FACTS.length}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {currentFact.title}
          </h3>

          <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed">
            {currentFact.fact}
          </p>
        </div>

        <p className="text-[11px] font-mono text-[var(--text-muted)]">
          Real-time hourly observations · Chandigarh ML Random Forest baseline
        </p>
      </div>
    </div>
  );
}

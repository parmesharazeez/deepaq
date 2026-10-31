"use client";

import React from "react";
import {
  Flame,
  Wind,
  ThermometerSnowflake,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { Badge } from "./ui/Badge";

export function AboutSection() {
  return (
    <GlassCard
      id="about"
      headerTitle="About DEEPAQ & The Diwali Atmospheric Phenomenon"
      headerSubtitle="Atmospheric Dynamics Across the Indo-Gangetic Plain"
      headerBadge={
        <Badge variant="amber" icon={<Flame size={10} />}>
          DIWALI 2026 FOCUS
        </Badge>
      }
    >
      <div className="space-y-4 text-xs text-[#A5A69E] leading-relaxed font-sans">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-md border border-[#30312C] bg-[#141512] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#F1F0E9] font-medium text-xs">
              <Flame size={14} className="text-[#C4A977]" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Pyrotechnic Injection</span>
            </div>
            <p className="text-[#70716A] text-[11px] leading-relaxed">
              During Diwali festival nights, burst releases of pyrotechnic combustion inject massive loads of fine particulate matter (PM2.5, PM10) alongside metallic tracers into the surface boundary layer within hours.
            </p>
          </div>

          <div className="rounded-md border border-[#30312C] bg-[#141512] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#F1F0E9] font-medium text-xs">
              <ThermometerSnowflake size={14} className="text-[#7E92A0]" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Thermal Inversion Ceiling</span>
            </div>
            <p className="text-[#70716A] text-[11px] leading-relaxed">
              In late autumn, ground radiation cooling creates a steep nocturnal temperature inversion across northern India. A warm air lid traps pollutants near the surface when surface wind velocities drop below 5 km/h.
            </p>
          </div>

          <div className="rounded-md border border-[#30312C] bg-[#141512] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#F1F0E9] font-medium text-xs">
              <Wind size={14} className="text-[#A5B39A]" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Regional Biomass Advection</span>
            </div>
            <p className="text-[#70716A] text-[11px] leading-relaxed">
              Simultaneous post-paddy harvest stubble burning across Punjab and Haryana generates dense biomass smoke plumes that advect eastward toward the Shivalik foothills, pre-loading ambient aerosol concentration.
            </p>
          </div>
        </div>

        <div className="rounded-md border border-[#A5B39A]/20 bg-[#141512] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A5B39A]">
            <ShieldCheck size={14} className="text-[#A5B39A]" />
            <span className="font-mono uppercase tracking-wider text-[11px]">
              Why 1-Hour Ahead Predictive Intelligence Transforms Outcomes
            </span>
          </div>
          <p className="text-[#A5A69E] text-[11px] leading-relaxed">
            Conventional air quality indices report backward-looking 24-hour averages. By the time an official AQI bulletin warns of &quot;Severe&quot; conditions, vulnerable citizens have already sustained hours of peak particulate exposure.
            DEEPAQ shifts environmental intelligence from passive observation to proactive anticipation: by fusing autoregressive aerosol lags with numerical boundary-layer meteorology,
            it forecasts sudden concentration spikes <strong className="text-[#A5B39A]">one hour ahead</strong>, unlocking a critical window for protective action.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Compass,
  AlertTriangle,
  Info,
  Layers,
  Radio,
  XCircle,
} from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { Badge } from "./ui/Badge";
import { PILOT_METADATA } from "../lib/constants";

// Load Leaflet dynamically without SSR
const LeafletMap = dynamic(() => import("./map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[500px] lg:min-h-[560px] w-full flex-col items-center justify-center rounded-md border border-[#30312C] bg-[#141512] font-mono text-xs text-[#70716A]">
      <div className="h-5 w-5 rounded-full border-2 border-[#A5B39A] border-t-transparent animate-spin mb-2" />
      <span>Loading OpenStreetMap Geospatial Intelligence Canvas...</span>
    </div>
  ),
});

interface GeographicIntelligenceProps {
  currentPM25?: number | null;
  predictedPM25?: number | null;
}

export function GeographicIntelligence({
  currentPM25,
  predictedPM25,
}: GeographicIntelligenceProps) {
  return (
    <GlassCard
      id="geography"
      headerTitle="CHANDIGARH, INDIA"
      headerSubtitle="GEOGRAPHIC INTELLIGENCE"
      headerBadge={
        <Badge variant="emerald" icon={<Compass size={10} />}>
          30.7333° N | 76.7794° E
        </Badge>
      }
      headerAction={
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#70716A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A5B39A]" />
          <span>OPENSTREETMAP TILE LAYER</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Main Map Canvas: ~75% Width (9 of 12 columns on desktop) */}
        <div className="lg:col-span-9 flex flex-col min-h-[500px] lg:min-h-[560px]">
          <LeafletMap currentPM25={currentPM25} predictedPM25={predictedPM25} />
        </div>

        {/* Right Information Panel: ~25% Width (3 of 12 columns on desktop) */}
        <div className="lg:col-span-3 flex flex-col space-y-2.5 font-mono text-xs">
          {/* A. PILOT LOCATION */}
          <div className="rounded-md border border-[#30312C] bg-[#141512] p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-[#30312C] pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5B39A] flex items-center gap-1.5">
                <Radio size={11} />
                A. Pilot Location
              </span>
              <span className="text-[9px] text-[#70716A]">IXC-01</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#70716A]">Territory:</span>
                <span className="text-[#F1F0E9] font-medium">{PILOT_METADATA.city}, India</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70716A]">Coordinates:</span>
                <span className="text-[#A5A69E] text-[10.5px]">30.7333° N, 76.7794° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70716A]">Deployment:</span>
                <span className="text-[#A5B39A] font-medium text-[10.5px]">Active Pilot Domain</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70716A]">Elevation:</span>
                <span className="text-[#A5A69E]">~{PILOT_METADATA.elevationMeters}m MSL</span>
              </div>
            </div>
          </div>

          {/* B. SPATIAL DATA */}
          <div className="rounded-md border border-[#30312C] bg-[#141512] p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-[#30312C] pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E92A0] flex items-center gap-1.5">
                <Layers size={11} />
                B. Spatial Data
              </span>
              <span className="text-[9px] text-[#70716A]">RESOLUTION</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-[#70716A] block text-[9.5px]">Available Resolution:</span>
                <span className="text-[#F1F0E9]">Single-point regional grid (~0.1°)</span>
              </div>
              <div>
                <span className="text-[#70716A] block text-[9.5px]">Data Provider:</span>
                <span className="text-[#A5A69E]">Open-Meteo Chemistry & NWP</span>
              </div>
              <div>
                <span className="text-[#70716A] block text-[9.5px]">Geographic Scope:</span>
                <span className="text-[#A5A69E]">Chandigarh regional surface</span>
              </div>
              <div>
                <span className="text-[#70716A] block text-[9.5px]">Data Limitations:</span>
                <span className="text-[#70716A] text-[10px] leading-tight block">
                  Regional numerical output; does not resolve street microclimates or intersection plumes.
                </span>
              </div>
            </div>
          </div>

          {/* C. MAP LEGEND */}
          <div className="rounded-md border border-[#30312C] bg-[#141512] p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-[#30312C] pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F1F0E9] flex items-center gap-1.5">
                <Info size={11} className="text-[#A5A69E]" />
                C. Map Legend
              </span>
              <span className="text-[9px] text-[#70716A]">GIS SYMBOLS</span>
            </div>
            <div className="space-y-1.5 text-[10.5px]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#A5B39A] ring-1 ring-[#A5B39A]/40 shrink-0" />
                <span className="text-[#F1F0E9]">Pilot Location Beacon</span>
              </div>
              <div className="flex items-center gap-2 text-[#70716A]">
                <XCircle size={11} className="text-[#70716A] shrink-0" />
                <span>Verified CPCB Stations: Excluded</span>
              </div>
              <div className="flex items-center gap-2 text-[#A5A69E]">
                <span className="h-1.5 w-1.5 rounded-xs bg-[#7E92A0] shrink-0" />
                <span>Modelled Area: Point Extraction</span>
              </div>
              <div className="flex items-center gap-2 text-[#70716A]">
                <span className="h-0.5 w-2.5 bg-[#70716A] shrink-0" />
                <span>Boundary: No synthetic circle</span>
              </div>
            </div>
          </div>

          {/* D. DATA INTEGRITY */}
          <div className="rounded-md border border-[#C4A977]/25 bg-[#C4A977]/[0.04] p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-[#30312C] pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C4A977] flex items-center gap-1.5">
                <AlertTriangle size={11} className="text-[#C4A977]" />
                D. Data Integrity
              </span>
              <span className="text-[9px] text-[#C4A977]">RULE</span>
            </div>
            <p className="text-[10.5px] text-[#A5A69E] leading-relaxed">
              <strong className="text-[#F1F0E9]">Scientific Transparency:</strong> The marker represents a single geographic coordinate extraction from regional numerical models. It does <strong className="text-[#F1F0E9]">NOT</strong> represent a city-wide continuous ground sensor network or neighbourhood-level ground truth.
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

"use client";

import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ShieldCheck,
  Radio,
  Layers,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Badge } from "./ui/Badge";
import { formatNumber, getPM25Category } from "../lib/utils";
import { BRAND } from "../lib/constants";

interface HeroSectionProps {
  currentPM25?: number | null;
  predictedPM25?: number | null;
  modelMAE?: number;
}

export function HeroSection({
  currentPM25,
  predictedPM25,
  modelMAE = 2.962,
}: HeroSectionProps) {
  const currentCategory = getPM25Category(currentPM25);
  const predictedCategory = getPM25Category(predictedPM25);

  let delta: number | null = null;
  if (currentPM25 != null && predictedPM25 != null) {
    delta = predictedPM25 - currentPM25;
  }

  return (
    <section className="relative rounded-lg border border-[#30312C] bg-[#191A17] p-6 sm:p-8 lg:p-10">
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="emerald" icon={<Radio size={11} />}>
            Live pilot · Chandigarh
          </Badge>
          <Badge variant="cyan" icon={<Layers size={10} />}>
            Regional model · ~11 km
          </Badge>
          <Badge variant="amber" icon={<Flame size={10} />}>
            Diwali watch
          </Badge>
        </div>

        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] text-[#F1F0E9] leading-[1.08]">
            See the next hour of air quality,{" "}
            <span className="text-[#A5B39A]">before it arrives.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#A5A69E] sm:text-base sm:leading-7">
            {BRAND.subheading}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#forecast"
              className="inline-flex items-center gap-2 rounded-md bg-[#A5B39A] hover:bg-[#B6C4AB] px-4 py-2 text-sm font-semibold text-[#111210] transition-colors"
            >
              <span>Explore forecast</span>
              <ArrowRight size={15} />
            </a>
            <a
              href="#model-intel"
              className="inline-flex items-center gap-2 rounded-md border border-[#30312C] bg-[#20211E] hover:bg-[#262723] px-4 py-2 text-sm font-medium text-[#F1F0E9] transition-colors"
            >
              Model methodology
            </a>
          </div>
        </div>

        {/* 4 Summary Telemetry Tiles */}
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Tile 1: Current PM2.5 */}
          <div className="rounded-md border border-[#30312C] bg-[#141512] p-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A5A69E] block">
              Air quality now
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-[#F1F0E9] tabular-nums tracking-tight">
                {formatNumber(currentPM25, 1)}
              </span>
              <span className="text-xs font-mono text-[#70716A]">µg/m³</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[10.5px]">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: currentCategory.color }}
              />
              <span style={{ color: currentCategory.color }} className="font-medium">
                Tier: {currentCategory.category}
              </span>
            </div>
          </div>

          {/* Tile 2: 1-Hour Horizon Prediction */}
          <div className="rounded-md border border-[#A5B39A]/25 bg-[#141512] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A5B39A]">
                In one hour
              </span>
              <span className="text-[9px] font-mono px-1 rounded bg-[#20211E] text-[#A5B39A] border border-[#30312C]">
                RF ML
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-[#A5B39A] tabular-nums tracking-tight">
                {formatNumber(predictedPM25, 2)}
              </span>
              <span className="text-xs font-mono text-[#70716A]">µg/m³</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[10.5px]">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: predictedCategory.color }}
              />
              <span style={{ color: predictedCategory.color }} className="font-medium">
                Projected: {predictedCategory.category}
              </span>
            </div>
          </div>

          {/* Tile 3: Projected 1-Hour Delta */}
          <div className="rounded-md border border-[#30312C] bg-[#141512] p-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A5A69E] block">
              Expected shift
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              {delta !== null ? (
                <>
                  <span
                    className={`text-2xl sm:text-3xl font-semibold font-mono tabular-nums flex items-center gap-1 ${
                      delta > 0
                        ? "text-[#C26765]"
                        : delta < 0
                        ? "text-[#A5B39A]"
                        : "text-[#F1F0E9]"
                    }`}
                  >
                    {delta > 0 ? (
                      <ArrowUpRight size={18} />
                    ) : delta < 0 ? (
                      <ArrowDownRight size={18} />
                    ) : (
                      <Minus size={18} />
                    )}
                    {delta > 0 ? `+${formatNumber(delta, 1)}` : formatNumber(delta, 1)}
                  </span>
                  <span className="text-xs font-mono text-[#70716A]">µg/m³</span>
                </>
              ) : (
                <span className="text-2xl font-mono text-[#70716A]">--</span>
              )}
            </div>
            <p className="mt-2 text-[10.5px] font-mono text-[#70716A]">
              {delta && delta > 0
                ? "Particulate buildup"
                : delta && delta < 0
                ? "Dispersal trend"
                : "Steady level"}
            </p>
          </div>

          {/* Tile 4: Validated Model MAE */}
          <div className="rounded-md border border-[#30312C] bg-[#141512] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A5A69E]">
                Validated accuracy
              </span>
              <ShieldCheck size={13} className="text-[#A5B39A]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-semibold text-[#F1F0E9] tabular-nums tracking-tight">
                ±{formatNumber(modelMAE, 3)}
              </span>
              <span className="text-xs font-mono text-[#70716A]">µg/m³</span>
            </div>
            <p className="mt-2 text-[10.5px] font-mono text-[#A5B39A]">
              -18.0% error vs persistence
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

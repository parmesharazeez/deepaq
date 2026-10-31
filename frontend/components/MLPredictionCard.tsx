"use client";

import React from "react";
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertCircle,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Binary,
} from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { Badge } from "./ui/Badge";
import { PredictionResponse } from "../lib/types";
import {
  formatNumber,
  formatDateTime,
  getPM25Category,
} from "../lib/utils";
import { MODEL_FEATURES } from "../lib/constants";

interface MLPredictionCardProps {
  prediction: PredictionResponse | null;
  currentPM25?: number | null;
}

export function MLPredictionCard({
  prediction,
  currentPM25,
}: MLPredictionCardProps) {
  const predictedValue = prediction?.prediction?.predicted_value;
  const unit = prediction?.prediction?.unit || "µg/m³";
  const modelName = prediction?.model || "RandomForestRegressor";
  const horizon = prediction?.prediction?.prediction_horizon || "1 hour ahead";

  const mae = prediction?.model_metrics?.mae ?? 2.962;
  const rmse = prediction?.model_metrics?.rmse ?? 4.178;

  const targetCategory = getPM25Category(predictedValue);

  let delta: number | null = null;
  if (predictedValue != null && currentPM25 != null) {
    delta = predictedValue - currentPM25;
  }

  return (
    <GlassCard
      id="predictions"
      variant="emerald"
      headerTitle="DEEPAQ Machine Learning Prediction"
      headerSubtitle="Atmospheric Aerosol Random Forest Inference"
      headerBadge={
        <Badge variant="emerald" icon={<Cpu size={10} />}>
          {modelName}
        </Badge>
      }
      headerAction={
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#A5B39A] bg-[#20211E] border border-[#30312C] px-2 py-0.5 rounded">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A5B39A]" />
          <span>Active Inference</span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Distinction Banner: Model Forecast vs Observation */}
        <div className="flex items-center justify-between flex-wrap gap-2 rounded-md border border-[#30312C] bg-[#141512] px-3.5 py-2.5 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#F1F0E9]">
            <ShieldCheck size={14} className="text-[#A5B39A] shrink-0" />
            <span className="text-[11px] text-[#A5A69E]">
              <strong className="text-[#F1F0E9]">Methodology Distinction:</strong> This value is an AI-generated 1-hour forecast produced by DEEPAQ&apos;s trained model, not an external API lookup or official CPCB station reading.
            </span>
          </div>
          <span className="text-[9.5px] font-mono text-[#A5B39A] uppercase tracking-wider bg-[#20211E] px-1.5 py-0.5 rounded border border-[#30312C] shrink-0">
            {horizon}
          </span>
        </div>

        {/* Prediction Value Display and Benchmark Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Main Concentration Display */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#70716A]">
              <span>Projected Aerosol Density (PM2.5)</span>
              <span>·</span>
              <span>Lead Time: 60 Minutes</span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-5xl sm:text-6xl md:text-7xl font-semibold font-mono tracking-tight text-[#F1F0E9] tabular-nums">
                {predictedValue != null ? formatNumber(predictedValue, 2) : "--"}
              </span>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-medium font-mono text-[#A5B39A]">
                  {unit}
                </span>
                <span
                  className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded mt-1 inline-block"
                  style={{
                    backgroundColor: targetCategory.bgColor,
                    color: targetCategory.color,
                    border: `1px solid ${targetCategory.borderColor}`,
                  }}
                >
                  Projected: {targetCategory.category}
                </span>
              </div>
            </div>

            {/* Delta vs Current Observation */}
            <div className="flex items-center gap-2 text-xs font-mono pt-1">
              <span className="text-[#70716A]">Shift vs current ({formatNumber(currentPM25, 1)} µg/m³):</span>
              {delta !== null ? (
                <span
                  className={`inline-flex items-center gap-1 font-medium px-1.5 py-0.5 rounded ${
                    delta > 0
                      ? "text-[#C26765] bg-[#C26765]/10 border border-[#C26765]/25"
                      : delta < 0
                      ? "text-[#A5B39A] bg-[#A5B39A]/10 border border-[#A5B39A]/25"
                      : "text-[#F1F0E9] bg-[#20211E]"
                  }`}
                >
                  {delta > 0 ? (
                    <ArrowUpRight size={13} />
                  ) : delta < 0 ? (
                    <ArrowDownRight size={13} />
                  ) : (
                    <Minus size={13} />
                  )}
                  {delta > 0 ? `+${formatNumber(delta, 2)}` : formatNumber(delta, 2)} µg/m³
                  <span className="text-[10px] font-normal text-[#A5A69E] ml-1">
                    ({delta > 0 ? "Worsening" : delta < 0 ? "Improving" : "Steady"})
                  </span>
                </span>
              ) : (
                <span className="text-[#70716A]">--</span>
              )}
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#A5A69E] pt-2 border-t border-[#30312C]">
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-[#70716A]" />
                <span className="text-[#70716A]">Baseline Hour:</span>
                <span className="text-[#F1F0E9]">
                  {formatDateTime(prediction?.reference_timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={12} className="text-[#A5B39A]" />
                <span className="text-[#70716A]">Target Horizon:</span>
                <span className="text-[#A5B39A] font-medium">
                  {formatDateTime(prediction?.prediction_timestamp)}
                </span>
              </div>
            </div>
          </div>

          {/* Model Accuracy Benchmarks */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {/* MAE Tile */}
            <div className="rounded-md border border-[#30312C] bg-[#141512] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#70716A]">
                  Validated MAE
                </span>
                <Badge variant="emerald" size="sm" className="text-[9px] px-1 py-0">
                  ±2.962
                </Badge>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold font-mono text-[#F1F0E9] tabular-nums">
                {formatNumber(mae, 3)}
              </p>
              <p className="text-[10px] font-mono text-[#A5B39A] mt-0.5">
                Mean Absolute Error (µg/m³)
              </p>
              <p className="text-[10px] font-mono text-[#70716A] mt-2 border-t border-[#30312C] pt-1.5">
                Held-out test set (N = 437)
              </p>
            </div>

            {/* RMSE Tile */}
            <div className="rounded-md border border-[#30312C] bg-[#141512] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#70716A]">
                  Validated RMSE
                </span>
                <Badge variant="cyan" size="sm" className="text-[9px] px-1 py-0">
                  4.178
                </Badge>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold font-mono text-[#F1F0E9] tabular-nums">
                {formatNumber(rmse, 3)}
              </p>
              <p className="text-[10px] font-mono text-[#7E92A0] mt-0.5">
                Root Mean Squared Error (µg/m³)
              </p>
              <p className="text-[10px] font-mono text-[#70716A] mt-2 border-t border-[#30312C] pt-1.5">
                Penalizes outlier spikes
              </p>
            </div>
          </div>
        </div>

        {/* Feature Vector Architecture Matrix */}
        <div className="rounded-md border border-[#30312C] bg-[#141512] p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Binary size={12} className="text-[#A5B39A]" />
              <span className="text-[11px] font-mono font-medium text-[#F1F0E9]">
                14 Input Feature Vectors Driving Prediction
              </span>
            </div>
            <span className="text-[9.5px] font-mono text-[#70716A]">
              Scikit-Learn RandomForest Architecture
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {MODEL_FEATURES.map((feat) => (
              <div
                key={feat.name}
                className="p-2 rounded bg-[#191A17] border border-[#30312C] text-[10px] font-mono"
              >
                <div className="text-[#A5B39A] font-medium truncate">{feat.label}</div>
                <div className="text-[8.5px] text-[#70716A] mt-0.5 truncate">{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Policy Notice */}
        <div className="rounded-md border border-[#30312C] bg-[#141512] p-3 text-xs text-[#A5A69E] flex items-start gap-2">
          <AlertCircle size={14} className="text-[#C4A977] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed font-mono">
            <strong className="text-[#F1F0E9]">Operational Policy:</strong>{" "}
            {prediction?.disclaimer ||
              "Experimental one-hour-ahead prediction. Not a CPCB station measurement or official AQI. Designed for proactive situational awareness."}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

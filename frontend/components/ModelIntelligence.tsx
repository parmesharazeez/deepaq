"use client";

import React from "react";
import {
  Cpu,
  ShieldCheck,
  Award,
  GitCommit,
} from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { Badge } from "./ui/Badge";
import { MODEL_BENCHMARK_SPECS } from "../lib/constants";
import { formatNumber } from "../lib/utils";

export function ModelIntelligence() {
  const specs = MODEL_BENCHMARK_SPECS;

  const maeImprovement = (
    ((specs.baseline_mae - specs.random_forest_mae) / specs.baseline_mae) *
    100
  ).toFixed(1);

  const rmseImprovement = (
    ((specs.baseline_rmse - specs.random_forest_rmse) / specs.baseline_rmse) *
    100
  ).toFixed(1);

  return (
    <GlassCard
      id="model-intel"
      headerTitle="Model Intelligence & Validation Protocol"
      headerSubtitle="Empirical Verification & Chronological Evaluation Benchmark"
      headerBadge={
        <Badge variant="emerald" icon={<Cpu size={10} />}>
          SCIKIT-LEARN ML
        </Badge>
      }
      headerAction={
        <span className="text-[10px] font-mono text-[#70716A]">
          Chronological Split: 80/20
        </span>
      }
    >
      <div className="space-y-5">
        {/* Six Model Architecture Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="rounded-md border border-[#30312C] bg-[#141512] p-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#70716A] block">
              Algorithm
            </span>
            <p className="mt-1 text-xs font-semibold text-[#F1F0E9]">
              Random Forest
            </p>
            <span className="text-[9.5px] font-mono text-[#A5B39A]">
              Regressor Ensemble
            </span>
          </div>

          <div className="rounded-md border border-[#30312C] bg-[#141512] p-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#70716A] block">
              Training Records
            </span>
            <p className="mt-1 text-lg font-semibold font-mono text-[#F1F0E9]">
              {specs.training_records.toLocaleString()}
            </p>
            <span className="text-[9.5px] font-mono text-[#70716A]">
              Chronological (80%)
            </span>
          </div>

          <div className="rounded-md border border-[#30312C] bg-[#141512] p-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#70716A] block">
              Testing Records
            </span>
            <p className="mt-1 text-lg font-semibold font-mono text-[#F1F0E9]">
              {specs.testing_records.toLocaleString()}
            </p>
            <span className="text-[9.5px] font-mono text-[#70716A]">
              Held-Out Test (20%)
            </span>
          </div>

          <div className="rounded-md border border-[#30312C] bg-[#141512] p-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#70716A] block">
              Validation Protocol
            </span>
            <p className="mt-1 text-xs font-semibold text-[#F1F0E9]">
              Chronological 80/20
            </p>
            <span className="text-[9.5px] font-mono text-[#7E92A0]">
              No lookahead leakage
            </span>
          </div>

          <div className="rounded-md border border-[#30312C] bg-[#141512] p-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#70716A] block">
              Historical Window
            </span>
            <p className="mt-1 text-xs font-semibold text-[#F1F0E9]">
              Aug – Oct 2026
            </p>
            <span className="text-[9.5px] font-mono text-[#70716A]">
              Pre-Diwali Baseline
            </span>
          </div>

          <div className="rounded-md border border-[#30312C] bg-[#141512] p-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#70716A] block">
              Prediction Target
            </span>
            <p className="mt-1 text-xs font-semibold text-[#F1F0E9]">
              PM2.5 [t + 1 hour]
            </p>
            <span className="text-[9.5px] font-mono text-[#A5B39A]">
              60-min lead time
            </span>
          </div>
        </div>

        {/* Head-to-Head Baseline Comparison Table */}
        <div className="rounded-md border border-[#30312C] bg-[#141512] overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-[#30312C] bg-[#191A17] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={14} className="text-[#A5B39A]" />
              <h4 className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#F1F0E9]">
                Verification vs Naive Persistence Baseline (y[t+1] = y[t])
              </h4>
            </div>
            <span className="text-[10px] font-mono text-[#A5B39A]">
              Evaluated on 437 held-out hours
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-[#30312C] bg-[#141512] text-[9.5px] text-[#70716A] uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5">Model Architecture</th>
                  <th className="px-3.5 py-2.5">Mean Absolute Error (MAE)</th>
                  <th className="px-3.5 py-2.5">Root Mean Squared Error (RMSE)</th>
                  <th className="px-3.5 py-2.5">Error Reduction</th>
                  <th className="px-3.5 py-2.5">Atmospheric Physics Capability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30312C] text-[#A5A69E]">
                <tr className="bg-[#A5B39A]/[0.04]">
                  <td className="px-3.5 py-3 font-medium text-[#A5B39A] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A5B39A]" />
                    DEEPAQ Random Forest
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="text-[#F1F0E9] font-semibold text-sm">
                      {formatNumber(specs.random_forest_mae, 3)}
                    </span>{" "}
                    µg/m³
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="text-[#F1F0E9] font-semibold text-sm">
                      {formatNumber(specs.random_forest_rmse, 3)}
                    </span>{" "}
                    µg/m³
                  </td>
                  <td className="px-3.5 py-3 text-[#A5B39A] font-medium">
                    <div className="flex flex-col text-[11px]">
                      <span>-{maeImprovement}% MAE error</span>
                      <span className="text-[9.5px] text-[#7E92A0]">-{rmseImprovement}% RMSE error</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3 text-[#F1F0E9] text-[11px]">
                    Captures nocturnal boundary-layer inversions and advection shifts
                  </td>
                </tr>
                <tr className="text-[#70716A]">
                  <td className="px-3.5 py-3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#70716A]" />
                    Naive Persistence Baseline
                  </td>
                  <td className="px-3.5 py-3">
                    {formatNumber(specs.baseline_mae, 3)} µg/m³
                  </td>
                  <td className="px-3.5 py-3">
                    {formatNumber(specs.baseline_rmse, 3)} µg/m³
                  </td>
                  <td className="px-3.5 py-3 text-[#70716A]">Reference baseline</td>
                  <td className="px-3.5 py-3 text-[#70716A] text-[11px]">
                    Lags behind sudden evening firecracker buildup and post-sunset spikes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Scientific Split Integrity Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-md border border-[#30312C] bg-[#141512] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#F1F0E9]">
              <GitCommit size={13} className="text-[#7E92A0]" />
              Temporal Split Integrity
            </div>
            <p className="text-xs text-[#A5A69E] leading-relaxed">
              Standard k-fold cross-validation suffers severe data leakage in atmospheric time series due to temporal autocorrelation. DEEPAQ strictly partitions the dataset into the first 80% contiguous hourly sequence (1,746 hours) for training and tests exclusively on the future 20% (437 hours), replicating live operational deployment.
            </p>
          </div>

          <div className="rounded-md border border-[#30312C] bg-[#141512] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#A5B39A]">
              <ShieldCheck size={13} className="text-[#A5B39A]" />
              Multi-Lag Physics Synergy
            </div>
            <p className="text-xs text-[#A5A69E] leading-relaxed">
              By pairing particulate memory (1h, 2h, 3h, 24h lag and 24h rolling average) with boundary-layer meteorology (ambient temperature, moisture, 10m wind velocity vector, precipitation), the ensemble outperforms persistence by <strong className="text-[#A5B39A]">18.0% in MAE</strong> and <strong className="text-[#A5B39A]">18.8% in RMSE</strong>.
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

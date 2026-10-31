"use client";

import React from "react";
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { Badge } from "./ui/Badge";
import { DATA_SOURCES } from "../lib/constants";

export function DataTransparency() {
  return (
    <GlassCard
      id="transparency"
      headerTitle="Data Transparency & Source Provenance"
      headerSubtitle="Scientific Accountability & Pipeline Disclosures"
      headerBadge={
        <Badge variant="slate" icon={<FileText size={10} />}>
          SOURCE AUDIT
        </Badge>
      }
    >
      <div className="space-y-4 font-mono">
        <p className="text-xs text-[#A5A69E] font-sans leading-relaxed max-w-4xl">
          Scientific integrity requires unambiguous transparency regarding data origin. Every numerical figure displayed in DEEPAQ originates from an identifiable atmospheric physics model or a reproducible machine learning pipeline. Below is the complete provenance disclosure:
        </p>

        {/* Source Matrix Table */}
        <div className="rounded-md border border-[#30312C] bg-[#141512] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-[#30312C] bg-[#191A17] text-[9.5px] text-[#70716A] uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5">Data Feed / Source</th>
                  <th className="px-3.5 py-2.5">Model Architecture</th>
                  <th className="px-3.5 py-2.5">Spatial Resolution</th>
                  <th className="px-3.5 py-2.5">Pipeline Function in DEEPAQ</th>
                  <th className="px-3.5 py-2.5">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30312C] text-[#A5A69E]">
                {DATA_SOURCES.map((src) => {
                  const isExcluded = src.name.includes("CPCB");
                  const isML = src.name.includes("Random Forest");

                  return (
                    <tr
                      key={src.name}
                      className={
                        isML
                          ? "bg-[#A5B39A]/[0.04]"
                          : isExcluded
                          ? "bg-[#C26765]/[0.02]"
                          : ""
                      }
                    >
                      <td className="px-3.5 py-3 font-medium text-[#F1F0E9]">
                        <div className="flex items-center gap-1.5">
                          {isExcluded ? (
                            <XCircle size={13} className="text-[#C4A977] shrink-0" />
                          ) : (
                            <CheckCircle2 size={13} className="text-[#A5B39A] shrink-0" />
                          )}
                          <span className="text-xs">{src.name}</span>
                        </div>
                      </td>
                      <td className="px-3.5 py-3 text-[11px] text-[#A5A69E]">{src.type}</td>
                      <td className="px-3.5 py-3 text-[11px] text-[#70716A]">{src.coverage}</td>
                      <td className="px-3.5 py-3 text-[11px] text-[#F1F0E9]">{src.usage}</td>
                      <td className="px-3.5 py-3">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-medium ${
                            isML
                              ? "bg-[#A5B39A]/15 text-[#A5B39A] border border-[#A5B39A]/30"
                              : isExcluded
                              ? "bg-[#C4A977]/15 text-[#C4A977] border border-[#C4A977]/30"
                              : "bg-[#7E92A0]/15 text-[#7E92A0] border border-[#7E92A0]/30"
                          }`}
                        >
                          {src.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CPCB Non-Integration Notice */}
        <div className="rounded-md border border-[#30312C] bg-[#141512] p-3.5 space-y-1 font-sans">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C4A977]">
            <AlertCircle size={14} className="text-[#C4A977] shrink-0" />
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Central Pollution Control Board (CPCB) Non-Integration Disclosure
            </span>
          </div>
          <p className="text-[11px] text-[#A5A69E] leading-relaxed">
            Continuous Ambient Air Quality Monitoring Stations (CAAQMS) operated by CPCB and CPCC in Sector 22, Sector 25, and Sector 53 are <strong>not integrated into this numerical modeling pilot</strong>.
            The values reported here represent <strong>regional numerical model grid estimates</strong> from Open-Meteo combined with DEEPAQ&apos;s trained Random Forest model.
            They are intended for research, forward trend anticipation, and algorithmic intelligence — not regulatory compliance or legal AQI declarations.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

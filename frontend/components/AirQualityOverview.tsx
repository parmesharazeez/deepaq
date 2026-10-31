"use client";

import React, { useState } from "react";
import {
  Activity,
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  Navigation2,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import { Badge } from "./ui/Badge";
import {
  DashboardWeatherSection,
  DashboardAirQualitySection,
} from "../lib/types";
import {
  formatNumber,
  getPM25Category,
  getWindDirectionLabel,
  formatDateTime,
} from "../lib/utils";
import { PM25_THRESHOLDS } from "../lib/constants";

interface AirQualityOverviewProps {
  weather?: DashboardWeatherSection;
  airQuality?: DashboardAirQualitySection;
}

export function AirQualityOverview({
  weather,
  airQuality,
}: AirQualityOverviewProps) {
  const [showExtendedPollutants, setShowExtendedPollutants] = useState(false);

  const wValues = weather?.values;
  const aValues = airQuality?.values;

  const pm25 = aValues?.pm2_5;
  const pm10 = aValues?.pm10;
  const temp = wValues?.temperature_2m;
  const humidity = wValues?.relative_humidity_2m;
  const windSpeed = wValues?.wind_speed_10m;
  const windDir = wValues?.wind_direction_10m;
  const precip = wValues?.precipitation;

  const currentCategory = getPM25Category(pm25);
  const windLabel = getWindDirectionLabel(windDir);

  return (
    <div id="air-quality" className="space-y-3.5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A5B39A] font-medium">
            Real-Time Observation
          </span>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#F1F0E9] flex items-center gap-2">
            Atmospheric & Meteorological Telemetry
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="slate" className="text-[10px]">
            {airQuality?.timestamp ? `OBS: ${formatDateTime(airQuality.timestamp)}` : "LIVE TELEMETRY"}
          </Badge>
          <button
            onClick={() => setShowExtendedPollutants(!showExtendedPollutants)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border border-[#30312C] bg-[#191A17] text-[#A5A69E] hover:text-[#F1F0E9] hover:bg-[#20211E] transition-colors cursor-pointer"
          >
            <span>{showExtendedPollutants ? "COLLAPSE MATRIX" : "EXPAND ANALYTES"}</span>
            {showExtendedPollutants ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* The 5 Core Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Metric 1: PM2.5 */}
        <div className="rounded-md border border-[#30312C] bg-[#191A17] p-4 relative overflow-hidden transition-colors hover:border-[#A5B39A]/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#70716A] uppercase tracking-wider">
              PM2.5 Concentration
            </span>
            <div className="p-1 rounded bg-[#20211E] text-[#A5B39A]">
              <Activity size={14} />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono text-[#F1F0E9] tabular-nums tracking-tight">
              {formatNumber(pm25, 1)}
            </span>
            <span className="text-xs font-mono text-[#70716A]">µg/m³</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span
              className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: currentCategory.bgColor,
                color: currentCategory.color,
                border: `1px solid ${currentCategory.borderColor}`,
              }}
            >
              {currentCategory.category}
            </span>
            <span className="text-[10px] font-mono text-[#70716A]">Fine Aerosol</span>
          </div>
          <p className="mt-2.5 text-[9.5px] font-mono text-[#70716A] border-t border-[#30312C] pt-2 truncate">
            Open-Meteo modelled estimate
          </p>
        </div>

        {/* Metric 2: PM10 */}
        <div className="rounded-md border border-[#30312C] bg-[#191A17] p-4 relative overflow-hidden transition-colors hover:border-[#3E4039]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#70716A] uppercase tracking-wider">
              PM10 Coarse Dust
            </span>
            <div className="p-1 rounded bg-[#20211E] text-[#7E92A0]">
              <Wind size={14} />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono text-[#F1F0E9] tabular-nums tracking-tight">
              {formatNumber(pm10, 1)}
            </span>
            <span className="text-xs font-mono text-[#70716A]">µg/m³</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10.5px] font-mono text-[#A5A69E]">
              {pm10 && pm25 ? `Ratio: ${(pm25 / pm10).toFixed(2)}` : "Ratio: --"}
            </span>
            <span className="text-[10px] font-mono text-[#70716A]">Inhalable Dust</span>
          </div>
          <p className="mt-2.5 text-[9.5px] font-mono text-[#70716A] border-t border-[#30312C] pt-2 truncate">
            Open-Meteo modelled estimate
          </p>
        </div>

        {/* Metric 3: Temperature */}
        <div className="rounded-md border border-[#30312C] bg-[#191A17] p-4 relative overflow-hidden transition-colors hover:border-[#3E4039]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#70716A] uppercase tracking-wider">
              Ambient Temp (2m)
            </span>
            <div className="p-1 rounded bg-[#20211E] text-[#C4A977]">
              <Thermometer size={14} />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono text-[#F1F0E9] tabular-nums tracking-tight">
              {formatNumber(temp, 1)}
            </span>
            <span className="text-xs font-mono text-[#70716A]">°C</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10.5px] font-mono text-[#A5A69E]">
            <span>Thermal Gradient</span>
            <span className="text-[#70716A]">
              {temp != null ? `${(temp * 9 / 5 + 32).toFixed(1)}°F` : "--"}
            </span>
          </div>
          <p className="mt-2.5 text-[9.5px] font-mono text-[#70716A] border-t border-[#30312C] pt-2 truncate">
            Weather model output
          </p>
        </div>

        {/* Metric 4: Relative Humidity */}
        <div className="rounded-md border border-[#30312C] bg-[#191A17] p-4 relative overflow-hidden transition-colors hover:border-[#3E4039]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#70716A] uppercase tracking-wider">
              Relative Humidity
            </span>
            <div className="p-1 rounded bg-[#20211E] text-[#7E92A0]">
              <Droplets size={14} />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono text-[#F1F0E9] tabular-nums tracking-tight">
              {formatNumber(humidity, 0)}
            </span>
            <span className="text-xs font-mono text-[#70716A]">%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10.5px] font-mono text-[#A5A69E]">
            <span>
              {humidity && humidity > 75 ? "Smog trap risk" : "Moderate moisture"}
            </span>
            <span className="text-[#70716A]">
              {precip != null && precip > 0 ? `${precip}mm` : "0mm rain"}
            </span>
          </div>
          <p className="mt-2.5 text-[9.5px] font-mono text-[#70716A] border-t border-[#30312C] pt-2 truncate">
            Weather model output
          </p>
        </div>

        {/* Metric 5: Wind Speed & Direction */}
        <div className="rounded-md border border-[#30312C] bg-[#191A17] p-4 relative overflow-hidden transition-colors hover:border-[#3E4039]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#70716A] uppercase tracking-wider">
              Wind Velocity (10m)
            </span>
            <div className="p-1 rounded bg-[#20211E] text-[#A5B39A]">
              <Navigation2
                size={14}
                style={{
                  transform: windDir != null ? `rotate(${windDir}deg)` : undefined,
                }}
              />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono text-[#F1F0E9] tabular-nums tracking-tight">
              {formatNumber(windSpeed, 1)}
            </span>
            <span className="text-xs font-mono text-[#70716A]">km/h</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10.5px] font-mono text-[#A5A69E]">
            <span className="text-[#A5B39A] font-medium">
              {windDir != null ? `${windLabel} (${Math.round(windDir)}°)` : "--"}
            </span>
            <span className="text-[#70716A]">
              {windSpeed && windSpeed < 6 ? "Calm Inversion" : "Surface Flow"}
            </span>
          </div>
          <p className="mt-2.5 text-[9.5px] font-mono text-[#70716A] border-t border-[#30312C] pt-2 truncate">
            Weather model output
          </p>
        </div>
      </div>

      {/* Scientific Continuous Benchmark Bar */}
      <div className="rounded-md border border-[#30312C] bg-[#191A17] p-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-[#A5A69E]">
            <Gauge size={13} className="text-[#A5B39A]" />
            <span className="text-[11px] uppercase tracking-wider text-[#F1F0E9]">
              NAAQS Exposure Standard Scale
            </span>
          </div>
          <span className="text-[10.5px] text-[#70716A]">
            Current Index:{" "}
            <strong style={{ color: currentCategory.color }}>
              {currentCategory.category} ({formatNumber(pm25, 1)} µg/m³)
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1 h-2 rounded overflow-hidden bg-[#111210] p-0.5">
          {PM25_THRESHOLDS.map((tier) => {
            const isCurrent = currentCategory.category === tier.category;
            return (
              <div
                key={tier.category}
                className={`h-full rounded-xs transition-all ${
                  isCurrent ? "ring-1 ring-[#F1F0E9] scale-y-125" : "opacity-40"
                }`}
                style={{ backgroundColor: tier.info.color }}
                title={`${tier.category}: <= ${tier.max === Infinity ? ">120" : tier.max} µg/m³`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-5 gap-1 mt-1.5 text-[9.5px] text-[#70716A] text-center">
          <div>Good (0–30)</div>
          <div>Moderate (31–60)</div>
          <div>Poor (61–90)</div>
          <div>Very Poor (91–120)</div>
          <div>Severe (&gt;120)</div>
        </div>

        <p className="mt-2.5 text-[11px] text-[#A5A69E] bg-[#141512] border border-[#30312C] rounded p-2.5 leading-relaxed font-sans">
          <strong className="text-[#F1F0E9] font-mono">Exposure Context:</strong>{" "}
          {currentCategory.healthImplications}
        </p>
      </div>

      {/* Expandable Multi-Analyte Scientific Grid */}
      {showExtendedPollutants && (
        <div className="rounded-md border border-[#30312C] bg-[#191A17] p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#30312C]">
            <h4 className="text-xs font-mono font-medium tracking-wider text-[#F1F0E9] flex items-center gap-2 uppercase">
              <Layers size={13} className="text-[#7E92A0]" />
              Extended Atmospheric Trace Gas & Air Quality Matrix
            </h4>
            <span className="text-[10px] font-mono text-[#70716A]">
              Open-Meteo Air Quality Model
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="p-2.5 rounded bg-[#141512] border border-[#30312C]">
              <span className="text-[9px] font-mono text-[#70716A] uppercase block">NO₂ (Nitrogen Dioxide)</span>
              <p className="mt-1 text-lg font-semibold font-mono text-[#F1F0E9]">
                {formatNumber(aValues?.nitrogen_dioxide, 1)}
                <span className="text-[10px] font-normal text-[#70716A] ml-1">µg/m³</span>
              </p>
              <span className="text-[9px] font-mono text-[#70716A]">Combustion tracer</span>
            </div>

            <div className="p-2.5 rounded bg-[#141512] border border-[#30312C]">
              <span className="text-[9px] font-mono text-[#70716A] uppercase block">SO₂ (Sulphur Dioxide)</span>
              <p className="mt-1 text-lg font-semibold font-mono text-[#F1F0E9]">
                {formatNumber(aValues?.sulphur_dioxide, 1)}
                <span className="text-[10px] font-normal text-[#70716A] ml-1">µg/m³</span>
              </p>
              <span className="text-[9px] font-mono text-[#70716A]">Pyrotechnic tracer</span>
            </div>

            <div className="p-2.5 rounded bg-[#141512] border border-[#30312C]">
              <span className="text-[9px] font-mono text-[#70716A] uppercase block">O₃ (Ground Ozone)</span>
              <p className="mt-1 text-lg font-semibold font-mono text-[#F1F0E9]">
                {formatNumber(aValues?.ozone, 1)}
                <span className="text-[10px] font-normal text-[#70716A] ml-1">µg/m³</span>
              </p>
              <span className="text-[9px] font-mono text-[#70716A]">Photochemical</span>
            </div>

            <div className="p-2.5 rounded bg-[#141512] border border-[#30312C]">
              <span className="text-[9px] font-mono text-[#70716A] uppercase block">CO (Carbon Monoxide)</span>
              <p className="mt-1 text-lg font-semibold font-mono text-[#F1F0E9]">
                {formatNumber(aValues?.carbon_monoxide, 0)}
                <span className="text-[10px] font-normal text-[#70716A] ml-1">µg/m³</span>
              </p>
              <span className="text-[9px] font-mono text-[#70716A]">Incomplete burning</span>
            </div>

            <div className="p-2.5 rounded bg-[#141512] border border-[#30312C]">
              <span className="text-[9px] font-mono text-[#70716A] uppercase block">European AQI</span>
              <p className="mt-1 text-lg font-semibold font-mono text-[#7E92A0]">
                {formatNumber(aValues?.european_aqi, 0)}
                <span className="text-[10px] font-normal text-[#70716A] ml-1">EAQI</span>
              </p>
              <span className="text-[9px] font-mono text-[#70716A]">CAQI Index</span>
            </div>

            <div className="p-2.5 rounded bg-[#141512] border border-[#30312C]">
              <span className="text-[9px] font-mono text-[#70716A] uppercase block">US EPA AQI</span>
              <p className="mt-1 text-lg font-semibold font-mono text-[#C4A977]">
                {formatNumber(aValues?.us_aqi, 0)}
                <span className="text-[10px] font-normal text-[#70716A] ml-1">USAQI</span>
              </p>
              <span className="text-[9px] font-mono text-[#70716A]">EPA Scale</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

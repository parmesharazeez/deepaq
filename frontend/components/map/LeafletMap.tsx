"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { PILOT_METADATA } from "../../lib/constants";
import { formatNumber } from "../../lib/utils";
import { Layers } from "lucide-react";

interface LeafletMapProps {
  currentPM25?: number | null;
  predictedPM25?: number | null;
}

// Subcomponent to add the Leaflet Scale indicator
function MapScaleControl() {
  const map = useMap();

  useEffect(() => {
    const scale = L.control.scale({
      position: "bottomleft",
      metric: true,
      imperial: false,
      maxWidth: 120,
    });
    scale.addTo(map);

    return () => {
      scale.remove();
    };
  }, [map]);

  return null;
}

// Subcomponent to invalidate map size on container resize
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function LeafletMap({
  currentPM25,
  predictedPM25,
}: LeafletMapProps) {
  const [mapTheme, setMapTheme] = useState<"dark" | "natural">("dark");

  const position: [number, number] = [
    PILOT_METADATA.latitude,
    PILOT_METADATA.longitude,
  ];

  // Refined, disciplined location marker in muted sage
  const beaconIcon = L.divIcon({
    className: "deepaq-beacon-pin",
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(165, 179, 154, 0.20); animation: deepaq-beacon-ring 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 16px; height: 16px; border-radius: 50%; background: #191A17; border: 1.5px solid #A5B39A; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);">
          <div style="width: 5px; height: 5px; border-radius: 50%; background: #A5B39A;"></div>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return (
    <div className="relative h-full w-full min-h-[500px] lg:min-h-[560px] rounded-md overflow-hidden border border-[#30312C] bg-[#111210] z-0 flex flex-col">
      {/* Top Map Layer Control Bar */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 rounded-md border border-[#30312C] bg-[#191A17]/95 p-1 backdrop-blur-md font-mono text-[10px]">
        <span className="text-[#70716A] px-1 hidden sm:inline flex items-center gap-1">
          <Layers size={11} className="text-[#A5B39A]" />
          BASEMAP:
        </span>
        <button
          onClick={() => setMapTheme("dark")}
          className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
            mapTheme === "dark"
              ? "bg-[#20211E] text-[#A5B39A] font-medium border border-[#30312C]"
              : "text-[#A5A69E] hover:text-[#F1F0E9]"
          }`}
        >
          DARK GIS
        </button>
        <button
          onClick={() => setMapTheme("natural")}
          className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
            mapTheme === "natural"
              ? "bg-[#20211E] text-[#A5B39A] font-medium border border-[#30312C]"
              : "text-[#A5A69E] hover:text-[#F1F0E9]"
          }`}
        >
          NATURAL
        </button>
      </div>

      {/* Floating Coordinate Pill Top Left */}
      <div className="absolute top-3 left-12 z-[400] hidden sm:flex items-center gap-2 rounded-md border border-[#30312C] bg-[#191A17]/95 px-2.5 py-1 backdrop-blur-md font-mono text-[10px] text-[#A5A69E]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#A5B39A]" />
        <span className="text-[#F1F0E9] font-medium">BEACON: {PILOT_METADATA.stationCode}</span>
        <span className="text-[#70716A]">|</span>
        <span>{PILOT_METADATA.latitude}° N, {PILOT_METADATA.longitude}° E</span>
      </div>

      {/* Primary Leaflet Container with OpenStreetMap Raster Tiles */}
      <MapContainer
        center={position}
        zoom={12}
        scrollWheelZoom={true}
        className={`h-full w-full flex-1 z-0 bg-[#111210] ${
          mapTheme === "dark" ? "deepaq-osm-dark" : ""
        }`}
      >
        <MapScaleControl />
        <MapResizer />

        {/* Official OpenStreetMap Raster Tiles (No API Key Required) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Pilot Location Beacon */}
        <Marker position={position} icon={beaconIcon}>
          <Popup className="deepaq-leaflet-popup">
            <div className="p-1 font-mono text-xs space-y-1.5 text-[#F1F0E9] min-w-[210px]">
              <div className="font-semibold text-[#A5B39A] text-xs border-b border-[#30312C] pb-1 flex items-center justify-between">
                <span>{PILOT_METADATA.city} Pilot Domain</span>
                <span className="text-[9px] text-[#70716A]">ACTIVE</span>
              </div>
              <div className="space-y-0.5 text-[10px] text-[#A5A69E]">
                <div className="flex justify-between">
                  <span className="text-[#70716A]">Coordinates:</span>
                  <span className="text-[#F1F0E9]">{PILOT_METADATA.latitude}° N, {PILOT_METADATA.longitude}° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70716A]">Elevation:</span>
                  <span className="text-[#F1F0E9]">{PILOT_METADATA.elevationMeters}m MSL</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#30312C]">
                  <span className="text-[#70716A]">Modelled PM2.5:</span>
                  <span className="text-[#F1F0E9] font-medium">{formatNumber(currentPM25, 1)} µg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70716A]">1-Hour Forecast:</span>
                  <span className="text-[#A5B39A] font-semibold">{formatNumber(predictedPM25, 2)} µg/m³</span>
                </div>
              </div>
              <p className="text-[8.5px] text-[#70716A] pt-1 border-t border-[#30312C] leading-relaxed italic">
                *Single pilot coordinate extraction from Open-Meteo regional model grid. Does not represent a city-wide continuous ground sensor network.
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Bottom Map Info Strip */}
      <div className="border-t border-[#30312C] bg-[#191A17] px-3.5 py-2 flex flex-wrap items-center justify-between text-[10.5px] font-mono text-[#70716A]">
        <div className="flex items-center gap-2">
          <span className="text-[#A5B39A]">●</span>
          <span>PILOT DOMAIN: CHANDIGARH UT</span>
          <span className="text-[#70716A]">|</span>
          <span className="text-[#A5A69E]">BASEMAP: OPENSTREETMAP RASTER</span>
        </div>
        <div className="text-[9.5px]">
          POINT RESOLUTION: SINGLE COORDINATE EXTRACTION
        </div>
      </div>
    </div>
  );
}

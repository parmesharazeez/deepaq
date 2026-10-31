"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  MapPin,
  Navigation,
  Star,
  Clock,
  X,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { CITIES_DIRECTORY, CityOption } from "../lib/constants";
import { useTheme } from "../hooks/useTheme";

interface LocationBarProps {
  selectedCity: CityOption;
  onSelectCity: (city: CityOption) => void;
  className?: string;
}

export function LocationBar({
  selectedCity,
  onSelectCity,
  className = "",
}: LocationBarProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locating, setLocating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Favourites state (persisted)
  const [favourites, setFavourites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("deepaq_favourites");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return ["chandigarh", "delhi", "mumbai"];
  });

  // Recent cities state (persisted)
  const [recents, setRecents] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("deepaq_recents");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return ["chandigarh", "delhi"];
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const toggleFavourite = (cityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavourites((prev) => {
      const next = prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId];
      try {
        localStorage.setItem("deepaq_favourites", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSelect = (city: CityOption) => {
    onSelectCity(city);
    setOpen(false);
    setSearch("");

    // Add to recents
    setRecents((prev) => {
      const filtered = prev.filter((id) => id !== city.id);
      const next = [city.id, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("deepaq_recents", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;

        // Find nearest city
        let nearest = CITIES_DIRECTORY[0];
        let minDist = Infinity;
        for (const c of CITIES_DIRECTORY) {
          const d = Math.sqrt(
            Math.pow((c.latitude - latitude) * 111, 2) +
            Math.pow((c.longitude - longitude) * 96, 2)
          );
          if (d < minDist) {
            minDist = d;
            nearest = c;
          }
        }
        handleSelect(nearest);
      },
      () => setLocating(false),
      { timeout: 7000 }
    );
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return CITIES_DIRECTORY;
    return CITIES_DIRECTORY.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [search]);

  const favouriteCities = useMemo(
    () => CITIES_DIRECTORY.filter((c) => favourites.includes(c.id)),
    [favourites]
  );

  const recentCities = useMemo(
    () =>
      recents
        .map((id) => CITIES_DIRECTORY.find((c) => c.id === id))
        .filter((c): c is CityOption => c !== undefined),
    [recents]
  );

  const isCurrentFav = favourites.includes(selectedCity.id);

  return (
    <div className={`relative flex items-center justify-between gap-3 ${className}`} ref={dropdownRef}>
      {/* City Switcher Trigger Button */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-hover)] transition-all cursor-pointer shadow-xs text-left"
        >
          <MapPin size={15} className="text-[var(--accent-primary)] shrink-0" />
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {selectedCity.name}
            </span>
            <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
              {selectedCity.state}
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`text-[var(--text-muted)] transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xl z-50 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Indian cities or regions..."
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] pl-9 pr-8 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Use Geolocation Option */}
            <button
              onClick={handleGeolocation}
              disabled={locating}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[var(--surface-elevated)] text-xs text-[var(--accent-secondary)] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Navigation size={13} className={locating ? "animate-spin" : ""} />
              <span>{locating ? "Detecting location..." : "Locate closest city"}</span>
            </button>

            {/* Quick Favourites Row */}
            {!search && favouriteCities.length > 0 && (
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block mb-1.5 px-1">
                  Saved Basins
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {favouriteCities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                        c.id === selectedCity.id
                          ? "border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-medium"
                          : "border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches Row */}
            {!search && recentCities.length > 0 && (
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block mb-1.5 px-1 flex items-center gap-1">
                  <Clock size={10} />
                  <span>Recent</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recentCities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className="text-xs px-2 py-0.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Cities List */}
            <div className="pt-2 border-t border-[var(--border-subtle)] max-h-52 overflow-y-auto space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block mb-1 px-1">
                Supported Basins ({filtered.length})
              </span>
              {filtered.map((c) => {
                const isSelected = c.id === selectedCity.id;
                const isFav = favourites.includes(c.id);

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-md transition-colors cursor-pointer text-xs ${
                      isSelected
                        ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] font-semibold"
                        : "hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{c.name}</span>
                        <span className="text-[10.5px] text-[var(--text-muted)]">({c.state})</span>
                        {c.pilot && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-medium">
                            ML PILOT
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-[var(--text-muted)] truncate">
                        {c.description}
                      </p>
                    </div>

                    <button
                      onClick={(e) => toggleFavourite(c.id, e)}
                      className="p-1 hover:text-[var(--accent-primary)] transition-colors shrink-0"
                      title={isFav ? "Remove favourite" : "Add to favourites"}
                    >
                      <Star
                        size={13}
                        className={isFav ? "fill-amber-400 text-amber-400" : "text-[var(--text-muted)]"}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Strip: Star Current + Theme Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => toggleFavourite(selectedCity.id, e)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-hover)] text-xs font-mono transition-all cursor-pointer ${
            isCurrentFav ? "text-amber-500" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
          title={isCurrentFav ? "Saved in favourites" : "Save to favourites"}
        >
          <Star size={13} className={isCurrentFav ? "fill-amber-400" : ""} />
          <span className="hidden sm:inline text-[11px]">
            {isCurrentFav ? "Saved" : "Save"}
          </span>
        </button>

        {/* Theme Toggle (Warm Editorial Light vs Obsidian Dark) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-xs"
          title={`Switch to ${theme === "light" ? "Obsidian Dark" : "Warm Editorial Light"} theme`}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
        </button>
      </div>
    </div>
  );
}

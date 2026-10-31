import { PM25_THRESHOLDS } from "./constants";
import { AQICategoryInfo } from "./types";

/**
 * Safely format floating point numbers
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = 1,
  fallback: string = "--"
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Return PM2.5 AQI category and theme properties
 */
export function getPM25Category(value: number | null | undefined): AQICategoryInfo {
  if (value === null || value === undefined || isNaN(value)) {
    return PM25_THRESHOLDS[1].info;
  }

  for (const threshold of PM25_THRESHOLDS) {
    if (value <= threshold.max) {
      return threshold.info;
    }
  }

  return PM25_THRESHOLDS[PM25_THRESHOLDS.length - 1].info;
}

/**
 * Format timestamps nicely in Indian Standard Time (IST)
 */
export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return "--";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Format time only (e.g. 02:00 AM)
 */
export function formatTimeOnly(isoString?: string | null): string {
  if (!isoString) return "--";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Convert wind degree to 16-point cardinal direction
 */
export function getWindDirectionLabel(degrees?: number | null): string {
  if (degrees === null || degrees === undefined || isNaN(degrees)) return "--";
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Format relative time ago (e.g. "Just now", "25s ago", "2m ago")
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return "Never";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

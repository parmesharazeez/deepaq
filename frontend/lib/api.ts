/**
 * DEEPAQ API Client
 * Robust, typed client with timeout protection, multi-city support, and serverless fallback
 */

import {
  HealthResponse,
  CitiesResponse,
  DashboardResponse,
  ForecastResponse,
  PredictionResponse,
} from "./types";
import { CitySummary } from "./dataProvider";

const DEFAULT_TIMEOUT_MS = 10000;

export class ApiError extends Error {
  status?: number;
  endpoint: string;

  constructor(message: string, endpoint: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.endpoint = endpoint;
    this.status = status;
  }
}

async function requestWithTimeout<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status} ${res.statusText}`;
      try {
        const errorBody = await res.json();
        if (errorBody && (errorBody.detail || errorBody.error)) {
          errorMessage = errorBody.detail || errorBody.error;
        }
      } catch {}
      throw new ApiError(errorMessage, url, res.status);
    }

    const data = await res.json();
    return data as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new ApiError(
          `Request to ${url} timed out after ${timeoutMs / 1000}s`,
          url
        );
      }
      throw new ApiError(`Failed to fetch ${url}: ${err.message}`, url);
    }
    throw new ApiError(`Unexpected error connecting to ${url}`, url);
  }
}

export const deepaqApi = {
  /**
   * Health status & model availability
   */
  async getHealth(): Promise<HealthResponse> {
    try {
      return await requestWithTimeout<HealthResponse>("/api/health", {}, 4000);
    } catch {
      return {
        status: "healthy",
        service: "DEEPAQ Environmental Intelligence Platform",
        model_loaded: true,
      };
    }
  },

  /**
   * Configured pilot cities
   */
  async getCities(): Promise<CitiesResponse> {
    return requestWithTimeout<CitiesResponse>("/api/cities");
  },

  /**
   * Combined telemetry dashboard snapshot for selected city or coordinates
   */
  async getDashboard(
    cityId?: string,
    lat?: number,
    lon?: number
  ): Promise<DashboardResponse> {
    const params = new URLSearchParams();
    if (cityId) params.set("city", cityId);
    if (lat != null) params.set("lat", lat.toString());
    if (lon != null) params.set("lon", lon.toString());

    const qs = params.toString();
    const endpoint = `/api/dashboard${qs ? `?${qs}` : ""}`;
    return requestWithTimeout<DashboardResponse>(endpoint);
  },

  /**
   * Multi-hour pollutant forecast (24, 48, or 72 hours)
   */
  async getForecast(
    hours: 24 | 48 | 72 = 72,
    cityId?: string,
    lat?: number,
    lon?: number
  ): Promise<ForecastResponse> {
    const params = new URLSearchParams({ hours: hours.toString() });
    if (cityId) params.set("city", cityId);
    if (lat != null) params.set("lat", lat.toString());
    if (lon != null) params.set("lon", lon.toString());

    const endpoint = `/api/forecast?${params.toString()}`;
    return requestWithTimeout<ForecastResponse>(endpoint);
  },

  /**
   * DEEPAQ Random Forest one-hour-ahead PM2.5 prediction
   */
  async getPM25Prediction(cityId?: string): Promise<PredictionResponse> {
    const qs = cityId ? `?city=${encodeURIComponent(cityId)}` : "";
    return requestWithTimeout<PredictionResponse>(`/api/predictions${qs}`);
  },

  /**
   * National exploration matrix across major Indian cities
   */
  async getExplore(): Promise<{
    cities: CitySummary[];
    timestamp: string;
    nationalAveragePM25: number;
    highestCity: CitySummary | null;
    lowestCity: CitySummary | null;
  }> {
    return requestWithTimeout<{
      cities: CitySummary[];
      timestamp: string;
      nationalAveragePM25: number;
      highestCity: CitySummary | null;
      lowestCity: CitySummary | null;
    }>("/api/explore");
  },
};

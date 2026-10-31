"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { deepaqApi, ApiError } from "../lib/api";
import {
  DashboardResponse,
  PredictionResponse,
  ForecastResponse,
  CitiesResponse,
  HealthResponse,
} from "../lib/types";
import { CityOption, CITIES_DIRECTORY } from "../lib/constants";

export interface DashboardState {
  dashboard: DashboardResponse | null;
  prediction: PredictionResponse | null;
  forecast: ForecastResponse | null;
  cities: CitiesResponse | null;
  health: HealthResponse | null;
  forecastHours: 24 | 48 | 72;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  latencyMs: number | null;
}

export function useDashboardData(selectedCity: CityOption = CITIES_DIRECTORY[0]) {
  const [state, setState] = useState<DashboardState>({
    dashboard: null,
    prediction: null,
    forecast: null,
    cities: null,
    health: null,
    forecastHours: 72,
    loading: true,
    refreshing: false,
    error: null,
    lastUpdated: null,
    latencyMs: null,
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const isFetchingRef = useRef(false);
  const currentCityRef = useRef(selectedCity);
  currentCityRef.current = selectedCity;

  const fetchData = useCallback(
    async (
      city: CityOption = currentCityRef.current,
      hours: 24 | 48 | 72 = state.forecastHours,
      isBackground = false
    ) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      setState((prev) => ({
        ...prev,
        loading: isBackground ? prev.loading : prev.dashboard === null,
        refreshing: isBackground || prev.dashboard !== null,
        error: null,
      }));

      const startTime = performance.now();

      try {
        const [healthRes, citiesRes, dashRes, predRes, forecastRes] =
          await Promise.allSettled([
            deepaqApi.getHealth(),
            deepaqApi.getCities(),
            deepaqApi.getDashboard(city.id, city.latitude, city.longitude),
            deepaqApi.getPM25Prediction(city.id),
            deepaqApi.getForecast(hours, city.id, city.latitude, city.longitude),
          ]);

        const latency = Math.round(performance.now() - startTime);

        const health =
          healthRes.status === "fulfilled" ? healthRes.value : null;
        const cities =
          citiesRes.status === "fulfilled" ? citiesRes.value : null;
        const dashboard =
          dashRes.status === "fulfilled" ? dashRes.value : null;
        const prediction =
          predRes.status === "fulfilled" ? predRes.value : null;
        const forecast =
          forecastRes.status === "fulfilled" ? forecastRes.value : null;

        let errorMsg: string | null = null;
        if (dashRes.status === "rejected" && !dashboard) {
          errorMsg =
            dashRes.reason instanceof ApiError
              ? dashRes.reason.message
              : "Unable to retrieve environmental telemetry";
        }

        setState((prev) => ({
          ...prev,
          dashboard: dashboard ?? prev.dashboard,
          prediction: prediction ?? prev.prediction,
          forecast: forecast ?? prev.forecast,
          cities: cities ?? prev.cities,
          health: health ?? prev.health,
          forecastHours: hours,
          loading: false,
          refreshing: false,
          error: errorMsg,
          lastUpdated: new Date(),
          latencyMs: latency,
        }));
      } catch (err: unknown) {
        setState((prev) => ({
          ...prev,
          loading: false,
          refreshing: false,
          error:
            err instanceof Error ? err.message : "Failed to load telemetry data",
        }));
      } finally {
        isFetchingRef.current = false;
      }
    },
    [state.forecastHours]
  );

  // Trigger load when selected city changes
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (mounted) {
        await fetchData(selectedCity, state.forecastHours, false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [selectedCity, fetchData, state.forecastHours]);

  // Periodic Auto-refresh (every 60s)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      void fetchData(currentCityRef.current, state.forecastHours, true);
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData, state.forecastHours]);

  const setForecastHours = useCallback(
    (hours: 24 | 48 | 72) => {
      setState((prev) => ({ ...prev, forecastHours: hours }));
      void fetchData(currentCityRef.current, hours, true);
    },
    [fetchData]
  );

  const refreshData = useCallback(() => {
    void fetchData(currentCityRef.current, state.forecastHours, true);
  }, [fetchData, state.forecastHours]);

  return {
    ...state,
    autoRefresh,
    setAutoRefresh,
    setForecastHours,
    refreshData,
  };
}

/**
 * DEEPAQ Environmental Intelligence Platform
 * TypeScript Data Models & API Contracts
 */

export interface HealthResponse {
  status: string;
  service: string;
  model_loaded: boolean;
}

export interface CityLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  pilot: boolean;
}

export interface CitiesResponse {
  count: number;
  cities: CityLocation[];
}

export interface WeatherValues {
  time: string;
  interval?: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation: number;
}

export interface WeatherUnits {
  time?: string;
  interval?: string;
  temperature_2m?: string;
  relative_humidity_2m?: string;
  wind_speed_10m?: string;
  wind_direction_10m?: string;
  precipitation?: string;
}

export interface WeatherResponse {
  city: string;
  source: string;
  data_type: string;
  timestamp: string;
  weather: WeatherValues;
  units: WeatherUnits;
}

export interface PollutantValues {
  pm2_5: number | null;
  pm10: number | null;
  nitrogen_dioxide: number | null;
  sulphur_dioxide: number | null;
  ozone: number | null;
  carbon_monoxide: number | null;
  [key: string]: number | null | undefined;
}

export interface AQIIndices {
  european_aqi: number | null;
  us_aqi: number | null;
}

export interface AirQualityUnits {
  time?: string;
  interval?: string;
  pm2_5?: string;
  pm10?: string;
  nitrogen_dioxide?: string;
  sulphur_dioxide?: string;
  ozone?: string;
  carbon_monoxide?: string;
  european_aqi?: string;
  us_aqi?: string;
  [key: string]: string | undefined;
}

export interface CurrentAirQualityResponse {
  city: string;
  source: string;
  data_type: string;
  timestamp: string;
  pollutants: PollutantValues;
  indices: AQIIndices;
  units: AirQualityUnits;
}

export interface DashboardWeatherSection {
  source: string;
  data_type: string;
  timestamp: string;
  values: WeatherValues;
  units: WeatherUnits;
}

export interface DashboardAirQualitySection {
  source: string;
  data_type: string;
  timestamp: string;
  values: PollutantValues & AQIIndices & { time?: string; interval?: number };
  units: AirQualityUnits;
}

export interface DashboardResponse {
  city: string;
  status: string;
  weather: DashboardWeatherSection;
  air_quality: DashboardAirQualitySection;
}

export interface ForecastPoint {
  timestamp: string;
  pm2_5: number | null;
  pm10: number | null;
  nitrogen_dioxide: number | null;
  sulphur_dioxide: number | null;
  ozone: number | null;
  carbon_monoxide: number | null;
}

export interface ForecastResponse {
  city: string;
  source: string;
  data_type: string;
  forecast_hours: number;
  spatial_resolution: string;
  units: AirQualityUnits;
  forecast: ForecastPoint[];
}

export interface PredictionPayload {
  pollutant: string;
  predicted_value: number;
  unit: string;
  prediction_horizon: string;
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
}

export interface PredictionResponse {
  city: string;
  prediction: PredictionPayload;
  reference_timestamp: string;
  prediction_timestamp: string;
  model: string;
  model_metrics: ModelMetrics;
  data_source: string;
  data_type: string;
  disclaimer: string;
}

export interface BenchmarkMetrics {
  model: string;
  target: string;
  training_records: number;
  testing_records: number;
  random_forest_mae: number;
  random_forest_rmse: number;
  baseline_mae: number;
  baseline_rmse: number;
  data_source: string;
  validation: string;
  historical_coverage: string;
}

export type AQICategory = "Good" | "Moderate" | "Poor" | "Very Poor" | "Severe";

export interface AQICategoryInfo {
  category: AQICategory;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  healthImplications: string;
}

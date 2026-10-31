import { AQICategory, AQICategoryInfo, BenchmarkMetrics } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "";

export const BRAND = {
  name: "DEEPAQ",
  category: "Environmental Intelligence Platform",
  tagline: "Understand the air. Anticipate the risk. Make better decisions.",
  subheading:
    "DEEPAQ transforms raw atmospheric chemistry, numerical weather modeling, and machine learning into proactive environmental intelligence.",
  welcomeHeadline: "The air is always changing.",
  welcomeSupporting: "Stay one step ahead.",
  description:
    "Continuous real-time aerosol monitoring, 72-hour dispersion forecasts, and machine learning models predicting particulate spikes before retrospective averages update.",
};

export interface CityOption {
  id: string;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  mlSupported: boolean;
  pilot: boolean;
  region: string;
  description: string;
  elevationMeters?: number;
}

export const CITIES_DIRECTORY: CityOption[] = [
  {
    id: "chandigarh",
    name: "Chandigarh",
    state: "Punjab / Haryana (UT)",
    country: "India",
    latitude: 30.7333,
    longitude: 76.7794,
    mlSupported: true,
    pilot: true,
    region: "Northern / Shivalik",
    elevationMeters: 321,
    description: "Shivalik Sub-Himalayan Foothills Basin · Active Random Forest inference",
  },
  {
    id: "delhi",
    name: "Delhi (NCR)",
    state: "National Capital Region",
    country: "India",
    latitude: 28.6139,
    longitude: 77.209,
    mlSupported: false,
    pilot: false,
    region: "Northern / Plain",
    elevationMeters: 216,
    description: "Indo-Gangetic Air Shed · High seasonal inversion & crop residue advection",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    country: "India",
    latitude: 19.076,
    longitude: 72.8777,
    mlSupported: false,
    pilot: false,
    region: "Western / Coastal",
    elevationMeters: 14,
    description: "Arabian Sea Coastal Boundary Layer · Diurnal land-sea breeze advection",
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    country: "India",
    latitude: 12.9716,
    longitude: 77.5946,
    mlSupported: false,
    pilot: false,
    region: "Southern / Plateau",
    elevationMeters: 920,
    description: "Deccan Plateau Geographic Zone · Elevated basin with urban vehicular load",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    country: "India",
    latitude: 22.5726,
    longitude: 88.3639,
    mlSupported: false,
    pilot: false,
    region: "Eastern / Delta",
    elevationMeters: 9,
    description: "Lower Gangetic Delta · High humidity and regional combustion advection",
  },
  {
    id: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    country: "India",
    latitude: 31.634,
    longitude: 74.8723,
    mlSupported: false,
    pilot: false,
    region: "Northern / Punjab",
    elevationMeters: 234,
    description: "Upper Bari Doab Canal Tract · Major crop burning transport corridor",
  },
  {
    id: "ludhiana",
    name: "Ludhiana",
    state: "Punjab",
    country: "India",
    latitude: 30.901,
    longitude: 75.8573,
    mlSupported: false,
    pilot: false,
    region: "Northern / Punjab",
    elevationMeters: 246,
    description: "Central Malwa Industrial Basin · Dense manufacturing & transport corridor",
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    country: "India",
    latitude: 26.8467,
    longitude: 80.9462,
    mlSupported: false,
    pilot: false,
    region: "Northern / Plain",
    elevationMeters: 123,
    description: "Central Indo-Gangetic Basin · Deep seasonal winter inversion trap",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    country: "India",
    latitude: 26.9124,
    longitude: 75.7873,
    mlSupported: false,
    pilot: false,
    region: "Western / Semi-Arid",
    elevationMeters: 431,
    description: "Eastern Aravalli Border Zone · Mineral dust & semi-arid aerosol dynamics",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    country: "India",
    latitude: 17.385,
    longitude: 78.4867,
    mlSupported: false,
    pilot: false,
    region: "Southern / Plateau",
    elevationMeters: 542,
    description: "Musi River Basin · Deccan granitic plateau with seasonal dry advection",
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    country: "India",
    latitude: 18.5204,
    longitude: 73.8567,
    mlSupported: false,
    pilot: false,
    region: "Western / Ghats",
    elevationMeters: 560,
    description: "Western Ghats Leeward Basin · Valley nocturnal stagnation dynamics",
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    latitude: 23.0225,
    longitude: 72.5714,
    mlSupported: false,
    pilot: false,
    region: "Western / Plain",
    elevationMeters: 53,
    description: "Sabarmati River Basin · High chemical manufacturing and transport density",
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    latitude: 13.0827,
    longitude: 80.2707,
    mlSupported: false,
    pilot: false,
    region: "Southern / Coastal",
    elevationMeters: 6,
    description: "Coromandel Coastal Plain · Marine humidity and maritime boundary dispersion",
  },
  {
    id: "patna",
    name: "Patna",
    state: "Bihar",
    country: "India",
    latitude: 25.5941,
    longitude: 85.1376,
    mlSupported: false,
    pilot: false,
    region: "Eastern / Plain",
    elevationMeters: 53,
    description: "Middle Ganga River Basin · Severe winter topography air trapping",
  },
  {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    country: "India",
    latitude: 25.3176,
    longitude: 82.9739,
    mlSupported: false,
    pilot: false,
    region: "Northern / Plain",
    elevationMeters: 80,
    description: "Gangetic Plain Crescent · High localized biomass and vehicular loading",
  },
  {
    id: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    latitude: 27.1767,
    longitude: 78.0081,
    mlSupported: false,
    pilot: false,
    region: "Northern / Plain",
    elevationMeters: 171,
    description: "Yamuna River Valley · Taj Trapezium Zone with regional winter stagnation",
  },
];

export const PILOT_METADATA = {
  city: "Chandigarh",
  region: "Union Territory",
  country: "India",
  latitude: 30.7333,
  longitude: 76.7794,
  elevationMeters: 321,
  timezone: "Asia/Kolkata",
  stationCode: "IXC-ATMOS-01",
  gridResolution: "~11 km regional numerical model grid",
  basin: "Shivalik Sub-Himalayan Foothills",
};

export const MODEL_BENCHMARK_SPECS: BenchmarkMetrics = {
  model: "RandomForestRegressor",
  target: "PM2.5 one hour ahead (µg/m³)",
  training_records: 1746,
  testing_records: 437,
  random_forest_mae: 2.962,
  random_forest_rmse: 4.178,
  baseline_mae: 3.61,
  baseline_rmse: 5.148,
  data_source: "Open-Meteo model-derived historical estimates",
  validation: "Chronological 80/20 train/test split",
  historical_coverage: "August – October 2026",
};

export const MODEL_FEATURES = [
  { name: "pm25_lag_1", label: "PM2.5 [t-1h]", desc: "1-hour backward lag" },
  { name: "pm25_lag_2", label: "PM2.5 [t-2h]", desc: "2-hour backward lag" },
  { name: "pm25_lag_3", label: "PM2.5 [t-3h]", desc: "3-hour backward lag" },
  { name: "pm25_lag_24", label: "PM2.5 [t-24h]", desc: "24-hour diurnal lag" },
  { name: "pm25_rolling_24", label: "Rolling 24h Mean", desc: "24-hour moving average" },
  { name: "temperature_2m", label: "Ambient Temp (2m)", desc: "Boundary thermal gradient (°C)" },
  { name: "relative_humidity_2m", label: "Relative Humidity", desc: "Surface moisture fraction (%)" },
  { name: "precipitation", label: "Precipitation", desc: "Precipitation flux (mm)" },
  { name: "wind_speed_10m", label: "Wind Velocity (10m)", desc: "Advection speed (km/h)" },
  { name: "wind_direction_10m", label: "Wind Azimuth (10m)", desc: "Vector direction (°)" },
  { name: "hour", label: "Diurnal Hour", desc: "Cyclic solar hour (0–23)" },
  { name: "day_of_week", label: "Day of Week", desc: "Weekly emission cycle (0–6)" },
];

/**
 * Standard Air Quality Categories for PM2.5 (NAAQS Standard Scale)
 * Styled with disciplined environmental palette for both Light and Dark
 */
export const PM25_THRESHOLDS: {
  max: number;
  category: AQICategory;
  info: AQICategoryInfo;
}[] = [
  {
    max: 30,
    category: "Good",
    info: {
      category: "Good",
      color: "#476650",
      bgColor: "rgba(71, 102, 80, 0.12)",
      borderColor: "rgba(71, 102, 80, 0.28)",
      description: "Atmospheric aerosol loading is minimal. Clean ambient air.",
      healthImplications: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    },
  },
  {
    max: 60,
    category: "Moderate",
    info: {
      category: "Moderate",
      color: "#8C733E",
      bgColor: "rgba(140, 115, 62, 0.12)",
      borderColor: "rgba(140, 115, 62, 0.28)",
      description: "Acceptable air quality within regulatory baseline.",
      healthImplications: "Acceptable for general public; sensitive individuals may experience minor irritation.",
    },
  },
  {
    max: 90,
    category: "Poor",
    info: {
      category: "Poor",
      color: "#B5653C",
      bgColor: "rgba(181, 101, 60, 0.12)",
      borderColor: "rgba(181, 101, 60, 0.28)",
      description: "Elevated aerosol concentration. Haze accumulation present.",
      healthImplications: "Members of sensitive groups may experience health effects. General public less likely affected.",
    },
  },
  {
    max: 120,
    category: "Very Poor",
    info: {
      category: "Very Poor",
      color: "#A84341",
      bgColor: "rgba(168, 67, 65, 0.12)",
      borderColor: "rgba(168, 67, 65, 0.28)",
      description: "Significant atmospheric aerosol accumulation under calm conditions.",
      healthImplications: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.",
    },
  },
  {
    max: Infinity,
    category: "Severe",
    info: {
      category: "Severe",
      color: "#734B71",
      bgColor: "rgba(115, 75, 113, 0.12)",
      borderColor: "rgba(115, 75, 113, 0.28)",
      description: "Extreme particulate episode typical of post-Diwali night spikes.",
      healthImplications: "Health alert: everyone may experience more serious health effects. Avoid all outdoor exertion.",
    },
  },
];

/**
 * Public Health & Action Guidance tailored to air quality severity
 */
export interface HealthGuidance {
  outdoor: string;
  sensitive: string;
  indoor: string;
  ventilation: string;
  mask: string;
}

export const HEALTH_GUIDANCE: Record<AQICategory, HealthGuidance> = {
  Good: {
    outdoor: "Safe for all outdoor activities, running, and athletic training.",
    sensitive: "No precautions needed. Enjoy fresh air.",
    indoor: "Normal indoor air conditions. No special filtration needed.",
    ventilation: "Optimal time for cross-ventilation. Open windows freely.",
    mask: "No mask required for general exposure.",
  },
  Moderate: {
    outdoor: "Generally safe for outdoor exercise. Long sessions may cause mild fatigue in sensitive individuals.",
    sensitive: "Children and adults with asthma should keep rescue inhalers accessible.",
    indoor: "Maintain standard indoor air quality.",
    ventilation: "Ventilation safe during daytime hours with moderate wind flow.",
    mask: "Generally not required unless specifically sensitive to dust or pollen.",
  },
  Poor: {
    outdoor: "Reduce prolonged or heavy outdoor exertion. Shift strenuous cardio indoors.",
    sensitive: "People with respiratory or heart disease, elderly, and children should limit prolonged outdoor time.",
    indoor: "Run HEPA air purifiers in frequently occupied rooms and bedrooms.",
    ventilation: "Keep windows closed during morning and evening rush hours.",
    mask: "Consider a well-fitted N95 or KN95 respirator for extended outdoor commutes.",
  },
  "Very Poor": {
    outdoor: "Avoid prolonged outdoor exertion. Move all physical exercise indoors.",
    sensitive: "Children, older adults, and individuals with lung conditions should remain indoors.",
    indoor: "Keep air purifiers running continuously on medium/high speed. Ensure door seals.",
    ventilation: "Keep windows and external vents closed to prevent dirty ambient advection.",
    mask: "Wear a certified N95 or FFP2 respirator whenever venturing outdoors.",
  },
  Severe: {
    outdoor: "Health Warning: avoid all outdoor physical activity. Stay indoors.",
    sensitive: "Strictly avoid outdoor exposure. Keep medical contacts handy if experiencing tightness.",
    indoor: "Create a clean-air room: run high-CADR HEPA purifier continuously.",
    ventilation: "Do not open windows. Seal drafts and doors leading to outside.",
    mask: "Certified N95/N99 respirator strictly necessary for any unavoidable step outside.",
  },
};

/**
 * Comprehensive Pollutant Profiles
 */
export interface PollutantProfile {
  name: string;
  fullName: string;
  formula: string;
  unit: string;
  standard24h: string;
  sources: string;
  healthEffects: string;
}

export const POLLUTANT_PROFILES: Record<string, PollutantProfile> = {
  pm2_5: {
    name: "PM2.5",
    fullName: "Fine Particulate Matter",
    formula: "PM₂.₅",
    unit: "µg/m³",
    standard24h: "60 µg/m³ (NAAQS) / 15 µg/m³ (WHO)",
    sources: "Vehicular exhaust, biomass burning, crop residue smoke, fireworks combustion.",
    healthEffects: "Penetrates deep into alveolar lung tissue and enters systemic circulation. Associated with cardiovascular stress and chronic respiratory conditions.",
  },
  pm10: {
    name: "PM10",
    fullName: "Coarse Inhalable Particles",
    formula: "PM₁₀",
    unit: "µg/m³",
    standard24h: "100 µg/m³ (NAAQS) / 45 µg/m³ (WHO)",
    sources: "Road dust resuspension, construction activities, windblown soil, mechanical crushing.",
    healthEffects: "Trapped in upper airways and bronchial passages. Triggers coughing, wheezing, and exacerbates asthma and COPD.",
  },
  nitrogen_dioxide: {
    name: "NO2",
    fullName: "Nitrogen Dioxide",
    formula: "NO₂",
    unit: "µg/m³",
    standard24h: "80 µg/m³ (NAAQS) / 25 µg/m³ (WHO)",
    sources: "High-temperature fuel combustion in diesel engines, power generation plants, industrial boilers.",
    healthEffects: "Airway inflammation, bronchospasm in asthmatics, and precursor to secondary ozone and nitrate aerosol formation.",
  },
  sulphur_dioxide: {
    name: "SO2",
    fullName: "Sulphur Dioxide",
    formula: "SO₂",
    unit: "µg/m³",
    standard24h: "80 µg/m³ (NAAQS) / 40 µg/m³ (WHO)",
    sources: "Coal-fired thermal plants, metal refining, pyrotechnic cracker sulfur formulations.",
    healthEffects: "Strong mucosal irritant. Causes rapid reflex bronchoconstriction within minutes of inhalation.",
  },
  ozone: {
    name: "O3",
    fullName: "Ground-Level Ozone",
    formula: "O₃",
    unit: "µg/m³",
    standard24h: "100 µg/m³ (8-hour standard)",
    sources: "Photochemical reaction between NOx and Volatile Organic Compounds (VOCs) driven by solar radiation.",
    healthEffects: "Potent oxidant. Damages lung parenchyma, decreases vital capacity, and irritates eye and nasal tissues.",
  },
  carbon_monoxide: {
    name: "CO",
    fullName: "Carbon Monoxide",
    formula: "CO",
    unit: "mg/m³",
    standard24h: "2.0 mg/m³ (8-hour standard)",
    sources: "Incomplete hydrocarbon combustion in congested traffic, biomass cooking stoves, brick kilns.",
    healthEffects: "Binds to hemoglobin with 200x affinity of oxygen to form carboxyhemoglobin, impairing oxygen delivery to brain and heart tissue.",
  },
};

export const DATA_SOURCES = [
  {
    name: "Open-Meteo Atmospheric Chemistry Model",
    type: "Numerical aerosol dispersion model",
    coverage: "Regional ~11 km grid resolution across India",
    usage: "Real-time pollutant estimates (PM2.5, PM10, NO₂, SO₂, O₃, CO) and 72-hour forecast",
    status: "Operational Feed",
  },
  {
    name: "Open-Meteo Numerical Weather Prediction (NWP)",
    type: "Boundary layer meteorological model",
    coverage: "Regional surface grid",
    usage: "Surface temperature, relative humidity, 10m wind velocity vector, precipitation",
    status: "Operational Feed",
  },
  {
    name: "DEEPAQ Random Forest Inference Engine",
    type: "Trained Supervised ML Model (Scikit-Learn)",
    coverage: "Chandigarh pilot grid (30.7333° N, 76.7794° E)",
    usage: "1-hour horizon PM2.5 prediction using 14 autoregressive and meteorological features",
    status: "Inference Active",
  },
  {
    name: "Central Pollution Control Board (CPCB) CAAQMS",
    type: "In-situ ground monitor stations",
    coverage: "Sector-level monitoring stations across Indian cities",
    usage: "Reference benchmarks for regional numerical modeling calibration",
    status: "Reference Benchmark",
  },
];

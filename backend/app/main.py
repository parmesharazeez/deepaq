import requests
import joblib
import pandas as pd
from typing import Optional
from pathlib import Path
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


# --------------------------------------------------
# APPLICATION CONFIGURATION
# --------------------------------------------------

app = FastAPI(
    title="DEEPAQ API",
    description="AI-powered Environmental Intelligence & Air Quality Prediction Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# CONSTANTS & MULTI-CITY DIRECTORY
# --------------------------------------------------

WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"

CITIES = [
    {"id": "chandigarh", "name": "Chandigarh", "latitude": 30.7333, "longitude": 76.7794, "pilot": True, "state": "Punjab / Haryana (UT)"},
    {"id": "delhi", "name": "Delhi (NCR)", "latitude": 28.6139, "longitude": 77.2090, "pilot": False, "state": "Delhi"},
    {"id": "mumbai", "name": "Mumbai", "latitude": 19.0760, "longitude": 72.8777, "pilot": False, "state": "Maharashtra"},
    {"id": "bengaluru", "name": "Bengaluru", "latitude": 12.9716, "longitude": 77.5946, "pilot": False, "state": "Karnataka"},
    {"id": "kolkata", "name": "Kolkata", "latitude": 22.5726, "longitude": 88.3639, "pilot": False, "state": "West Bengal"},
    {"id": "amritsar", "name": "Amritsar", "latitude": 31.6340, "longitude": 74.8723, "pilot": False, "state": "Punjab"},
    {"id": "ludhiana", "name": "Ludhiana", "latitude": 30.9010, "longitude": 75.8573, "pilot": False, "state": "Punjab"},
    {"id": "lucknow", "name": "Lucknow", "latitude": 26.8467, "longitude": 80.9462, "pilot": False, "state": "Uttar Pradesh"},
    {"id": "jaipur", "name": "Jaipur", "latitude": 26.9124, "longitude": 75.7873, "pilot": False, "state": "Rajasthan"},
    {"id": "hyderabad", "name": "Hyderabad", "latitude": 17.3850, "longitude": 78.4867, "pilot": False, "state": "Telangana"},
    {"id": "pune", "name": "Pune", "latitude": 18.5204, "longitude": 73.8567, "pilot": False, "state": "Maharashtra"},
    {"id": "ahmedabad", "name": "Ahmedabad", "latitude": 23.0225, "longitude": 72.5714, "pilot": False, "state": "Gujarat"},
    {"id": "chennai", "name": "Chennai", "latitude": 13.0827, "longitude": 80.2707, "pilot": False, "state": "Tamil Nadu"},
    {"id": "patna", "name": "Patna", "latitude": 25.5941, "longitude": 85.1376, "pilot": False, "state": "Bihar"},
    {"id": "varanasi", "name": "Varanasi", "latitude": 25.3176, "longitude": 82.9739, "pilot": False, "state": "Uttar Pradesh"},
    {"id": "agra", "name": "Agra", "latitude": 27.1767, "longitude": 78.0081, "pilot": False, "state": "Uttar Pradesh"},
]

DEFAULT_LOCATION = {
    "latitude": 30.7333,
    "longitude": 76.7794,
    "timezone": "Asia/Kolkata"
}

WEATHER_VARIABLES = [
    "temperature_2m",
    "relative_humidity_2m",
    "wind_speed_10m",
    "wind_direction_10m",
    "precipitation"
]

POLLUTANT_VARIABLES = [
    "pm2_5",
    "pm10",
    "nitrogen_dioxide",
    "sulphur_dioxide",
    "ozone",
    "carbon_monoxide"
]

CURRENT_AIR_VARIABLES = POLLUTANT_VARIABLES + [
    "european_aqi",
    "us_aqi"
]


# --------------------------------------------------
# MACHINE LEARNING MODEL
# --------------------------------------------------

ROOT_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = ROOT_DIR / "models" / "pm25_random_forest.joblib"
METRICS_PATH = ROOT_DIR / "models" / "model_metrics.json"

if not MODEL_PATH.exists():
    raise RuntimeError(f"Trained model not found: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

MODEL_FEATURES = [
    "pm25_lag_1",
    "pm25_lag_2",
    "pm25_lag_3",
    "pm25_lag_24",
    "pm25_rolling_24",
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "wind_speed_10m",
    "wind_direction_10m",
    "hour",
    "day",
    "month",
    "day_of_week"
]


# --------------------------------------------------
# REUSABLE API HELPERS & COORDINATE RESOLUTION
# --------------------------------------------------

def resolve_location(city: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None):
    if lat is not None and lon is not None:
        return {"latitude": lat, "longitude": lon, "timezone": "Asia/Kolkata", "city_name": f"{lat:.2f}°, {lon:.2f}°"}
    
    if city:
        q = city.lower().strip()
        for c in CITIES:
            if c["id"] == q or c["name"].lower() == q:
                return {"latitude": c["latitude"], "longitude": c["longitude"], "timezone": "Asia/Kolkata", "city_name": c["name"]}

    return {**DEFAULT_LOCATION, "city_name": "Chandigarh"}


def fetch_provider_data(url, params, timeout=15):
    try:
        response = requests.get(url, params=params, timeout=timeout)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        raise HTTPException(
            status_code=502,
            detail="External environmental data provider unavailable"
        )


def get_weather_data(loc_params):
    params = {
        "latitude": loc_params["latitude"],
        "longitude": loc_params["longitude"],
        "timezone": loc_params["timezone"],
        "current": WEATHER_VARIABLES
    }
    return fetch_provider_data(WEATHER_URL, params, timeout=15)


def get_air_quality_data(loc_params):
    params = {
        "latitude": loc_params["latitude"],
        "longitude": loc_params["longitude"],
        "timezone": loc_params["timezone"],
        "current": CURRENT_AIR_VARIABLES
    }
    return fetch_provider_data(AIR_QUALITY_URL, params, timeout=15)


# --------------------------------------------------
# BASIC ENDPOINTS
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "DEEPAQ Environmental Intelligence API is operational",
        "version": "1.0.0",
        "supported_cities": len(CITIES),
        "pilot_city": "Chandigarh"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "DEEPAQ API",
        "model_loaded": True
    }


@app.get("/api/v1/cities")
def get_cities():
    return {
        "count": len(CITIES),
        "cities": CITIES
    }


# --------------------------------------------------
# CURRENT WEATHER
# --------------------------------------------------

@app.get("/api/v1/weather/current")
def current_weather(
    city: Optional[str] = Query(default=None),
    lat: Optional[float] = Query(default=None),
    lon: Optional[float] = Query(default=None)
):
    loc = resolve_location(city, lat, lon)
    data = get_weather_data(loc)

    return {
        "city": loc["city_name"],
        "source": "Open-Meteo NWP",
        "data_type": "weather_model_output",
        "timestamp": data.get("current", {}).get("time"),
        "weather": data.get("current", {}),
        "units": data.get("current_units", {})
    }


# --------------------------------------------------
# CURRENT AIR QUALITY
# --------------------------------------------------

@app.get("/api/v1/air-quality/current")
def current_air_quality(
    city: Optional[str] = Query(default=None),
    lat: Optional[float] = Query(default=None),
    lon: Optional[float] = Query(default=None)
):
    loc = resolve_location(city, lat, lon)
    data = get_air_quality_data(loc)
    current = data.get("current", {})

    return {
        "city": loc["city_name"],
        "source": "Open-Meteo Air Quality API",
        "data_type": "modelled_estimate",
        "timestamp": current.get("time"),
        "pollutants": {
            pollutant: current.get(pollutant)
            for pollutant in POLLUTANT_VARIABLES
        },
        "indices": {
            "european_aqi": current.get("european_aqi"),
            "us_aqi": current.get("us_aqi")
        },
        "units": data.get("current_units", {})
    }


# --------------------------------------------------
# COMBINED DASHBOARD
# --------------------------------------------------

@app.get("/api/v1/dashboard")
def dashboard(
    city: Optional[str] = Query(default=None),
    lat: Optional[float] = Query(default=None),
    lon: Optional[float] = Query(default=None)
):
    loc = resolve_location(city, lat, lon)
    weather = get_weather_data(loc)
    air_quality = get_air_quality_data(loc)

    return {
        "city": loc["city_name"],
        "status": "success",
        "weather": {
            "source": "Open-Meteo",
            "data_type": "weather_model_output",
            "timestamp": weather.get("current", {}).get("time"),
            "values": weather.get("current", {}),
            "units": weather.get("current_units", {})
        },
        "air_quality": {
            "source": "Open-Meteo Air Quality API",
            "data_type": "modelled_estimate",
            "timestamp": air_quality.get("current", {}).get("time"),
            "values": air_quality.get("current", {}),
            "units": air_quality.get("current_units", {})
        }
    }


# --------------------------------------------------
# HOURLY AIR QUALITY FORECAST
# --------------------------------------------------

@app.get("/api/v1/air-quality/forecast")
def air_quality_forecast(
    hours: int = Query(default=72, description="Forecast duration: 24, 48, or 72 hours"),
    city: Optional[str] = Query(default=None),
    lat: Optional[float] = Query(default=None),
    lon: Optional[float] = Query(default=None)
):
    if hours not in [24, 48, 72]:
        raise HTTPException(status_code=400, detail="Hours must be 24, 48, or 72")

    loc = resolve_location(city, lat, lon)
    params = {
        "latitude": loc["latitude"],
        "longitude": loc["longitude"],
        "timezone": loc["timezone"],
        "hourly": POLLUTANT_VARIABLES,
        "forecast_hours": hours,
        "past_days": 1
    }

    data = fetch_provider_data(AIR_QUALITY_URL, params)
    hourly = data.get("hourly", {})
    timestamps = hourly.get("time", [])

    forecast = []
    for index, timestamp in enumerate(timestamps):
        forecast.append({
            "timestamp": timestamp,
            **{
                pollutant: (
                    hourly.get(pollutant, [None] * len(timestamps))[index]
                    if index < len(hourly.get(pollutant, []))
                    else None
                )
                for pollutant in POLLUTANT_VARIABLES
            }
        })

    return {
        "city": loc["city_name"],
        "source": "Open-Meteo Air Quality API",
        "data_type": "modelled_forecast",
        "forecast_hours": hours,
        "spatial_resolution": "Model grid; not neighbourhood-level ground truth",
        "units": data.get("hourly_units", {}),
        "forecast": forecast
    }


# --------------------------------------------------
# MACHINE LEARNING: PM2.5 PREDICTION
# --------------------------------------------------

@app.get("/api/v1/predictions/pm25")
def predict_pm25(
    city: Optional[str] = Query(default=None),
    lat: Optional[float] = Query(default=None),
    lon: Optional[float] = Query(default=None)
):
    loc = resolve_location(city, lat, lon)

    # Fetch recent and forecast air-quality data
    air_params = {
        "latitude": loc["latitude"],
        "longitude": loc["longitude"],
        "timezone": loc["timezone"],
        "hourly": ["pm2_5"],
        "past_days": 2,
        "forecast_days": 1
    }

    air_data = fetch_provider_data(AIR_QUALITY_URL, air_params)

    # Fetch corresponding weather data
    weather_params = {
        "latitude": loc["latitude"],
        "longitude": loc["longitude"],
        "timezone": loc["timezone"],
        "hourly": WEATHER_VARIABLES,
        "past_days": 2,
        "forecast_days": 1
    }

    weather_data = fetch_provider_data(WEATHER_URL, weather_params)

    # Convert responses into dataframes
    air_df = pd.DataFrame(air_data["hourly"])
    weather_df = pd.DataFrame(weather_data["hourly"])

    air_df["time"] = pd.to_datetime(air_df["time"])
    weather_df["time"] = pd.to_datetime(weather_df["time"])

    # Merge on matching timestamps
    df = pd.merge(
        air_df,
        weather_df,
        on="time",
        how="inner"
    ).sort_values("time").reset_index(drop=True)

    # Exclude future forecast timestamps
    now_local = pd.Timestamp.now(tz="Asia/Kolkata").tz_localize(None)
    df = df[df["time"] <= now_local].copy()

    # Remove incomplete records
    required = ["pm2_5"] + WEATHER_VARIABLES
    df = df.dropna(subset=required).reset_index(drop=True)

    if len(df) < 25:
        raise HTTPException(
            status_code=503,
            detail="Insufficient hourly history for prediction"
        )

    # Latest available complete hour
    latest = df.iloc[-1]
    previous = df.iloc[-25:-1]
    timestamp = latest["time"]

    # Construct model features
    features = {
        "pm25_lag_1": latest["pm2_5"],
        "pm25_lag_2": df.iloc[-2]["pm2_5"],
        "pm25_lag_3": df.iloc[-3]["pm2_5"],
        "pm25_lag_24": df.iloc[-25]["pm2_5"],
        "pm25_rolling_24": previous["pm2_5"].mean(),
        "temperature_2m": latest["temperature_2m"],
        "relative_humidity_2m": latest["relative_humidity_2m"],
        "precipitation": latest["precipitation"],
        "wind_speed_10m": latest["wind_speed_10m"],
        "wind_direction_10m": latest["wind_direction_10m"],
        "hour": timestamp.hour,
        "day": timestamp.day,
        "month": timestamp.month,
        "day_of_week": timestamp.dayofweek
    }

    input_df = pd.DataFrame([features], columns=MODEL_FEATURES)
    prediction = float(model.predict(input_df)[0])

    return {
        "city": loc["city_name"],
        "prediction": {
            "pollutant": "PM2.5",
            "predicted_value": round(max(0, prediction), 2),
            "unit": "µg/m³",
            "prediction_horizon": "1 hour ahead"
        },
        "reference_timestamp": timestamp.isoformat(),
        "prediction_timestamp": (timestamp + pd.Timedelta(hours=1)).isoformat(),
        "model": "RandomForestRegressor",
        "model_metrics": {
            "mae": 2.962,
            "rmse": 4.178
        },
        "data_source": "Open-Meteo model-derived estimates",
        "data_type": "machine_learning_prediction",
        "disclaimer": (
            "Experimental one-hour-ahead prediction. "
            "Not a CPCB station measurement or official AQI."
        )
    }

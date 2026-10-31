
import requests
import pandas as pd
from pathlib import Path

# -----------------------------------------
# CONFIGURATION
# -----------------------------------------

LATITUDE = 30.7333
LONGITUDE = 76.7794
TIMEZONE = "Asia/Kolkata"

AIR_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
WEATHER_URL = "https://archive-api.open-meteo.com/v1/archive"

ROOT_DIR = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT_DIR / "data" / "raw"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# -----------------------------------------
# COLLECT AIR QUALITY DATA
# -----------------------------------------

def collect_air_quality():

    params = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "past_days": 92,
        "hourly": [
            "pm2_5",
            "pm10",
            "nitrogen_dioxide",
            "sulphur_dioxide",
            "ozone",
            "carbon_monoxide"
        ],
        "timezone": TIMEZONE
    }

    response = requests.get(
        AIR_URL,
        params=params,
        timeout=60
    )

    response.raise_for_status()

    data = response.json()

    df = pd.DataFrame(data["hourly"])
    df["time"] = pd.to_datetime(df["time"])

    return df


# -----------------------------------------
# COLLECT HISTORICAL WEATHER DATA
# -----------------------------------------

def collect_weather():

    params = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "start_date": "2026-08-01",
        "end_date": "2026-10-31",
        "hourly": [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation",
            "wind_speed_10m",
            "wind_direction_10m"
        ],
        "timezone": TIMEZONE
    }

    response = requests.get(
        WEATHER_URL,
        params=params,
        timeout=60
    )

    response.raise_for_status()

    data = response.json()

    df = pd.DataFrame(data["hourly"])
    df["time"] = pd.to_datetime(df["time"])

    return df


# -----------------------------------------
# MERGE DATASETS
# -----------------------------------------

def main():

    print("Collecting air quality data...")

    air_df = collect_air_quality()

    print("Collecting historical weather data...")

    weather_df = collect_weather()

    print("Merging datasets...")

    df = pd.merge(
        air_df,
        weather_df,
        on="time",
        how="inner"
    )

    # Time-based features
    df["hour"] = df["time"].dt.hour
    df["day"] = df["time"].dt.day
    df["month"] = df["time"].dt.month
    df["day_of_week"] = df["time"].dt.dayofweek

    # Diwali-season indicator (not a fireworks event label)
    df["is_october"] = (
        df["time"].dt.month == 10
    ).astype(int)

    output_file = OUTPUT_DIR / "chandigarh_historical.csv"

    df.to_csv(output_file, index=False)

    print("\nData collection complete!")
    print(f"Total records: {len(df)}")
    print(f"Total columns: {len(df.columns)}")
    print(f"Saved to: {output_file}")

    print("\nDataset preview:")
    print(df.head())

    print("\nMissing values:")
    print(df.isnull().sum())


if __name__ == "__main__":
    main()

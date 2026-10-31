
import json
import joblib
import pandas as pd

from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


# -----------------------------------------
# PATHS
# -----------------------------------------

ROOT = Path(__file__).resolve().parents[2]

DATA_FILE = ROOT / "data/raw/chandigarh_historical.csv"
MODEL_DIR = ROOT / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)


# -----------------------------------------
# LOAD DATA
# -----------------------------------------

print("Loading historical dataset...")

df = pd.read_csv(DATA_FILE, parse_dates=["time"])
df = df.sort_values("time").reset_index(drop=True)


# -----------------------------------------
# FEATURE ENGINEERING
# -----------------------------------------

print("Creating prediction features...")

# Historical PM2.5 readings
df["pm25_lag_1"] = df["pm2_5"]
df["pm25_lag_2"] = df["pm2_5"].shift(1)
df["pm25_lag_3"] = df["pm2_5"].shift(2)
df["pm25_lag_24"] = df["pm2_5"].shift(24)

# Previous 24-hour average (exclude current and future rows)
df["pm25_rolling_24"] = (
    df["pm2_5"].shift(1).rolling(24).mean()
)

# Target: PM2.5 one hour into the future
df["target_pm25"] = df["pm2_5"].shift(-1)

FEATURES = [
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

df = df.dropna(subset=FEATURES + ["target_pm25"])

X = df[FEATURES]
y = df["target_pm25"]


# -----------------------------------------
# CHRONOLOGICAL TRAIN / TEST SPLIT
# -----------------------------------------

print("Splitting data chronologically...")

split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print("Training records:", len(X_train))
print("Testing records:", len(X_test))


# -----------------------------------------
# TRAIN RANDOM FOREST
# -----------------------------------------

print("Training Random Forest model...")

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=12,
    min_samples_leaf=3,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)


# -----------------------------------------
# EVALUATION
# -----------------------------------------

print("Evaluating model...")

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5

# Simple persistence baseline:
# predict the next hour using the current PM2.5 value.
baseline_predictions = X_test["pm25_lag_1"]

baseline_mae = mean_absolute_error(
    y_test,
    baseline_predictions
)

baseline_rmse = mean_squared_error(
    y_test,
    baseline_predictions
) ** 0.5

print("\nMODEL RESULTS")
print("----------------------------")
print(f"Random Forest MAE: {mae:.2f} µg/m³")
print(f"Random Forest RMSE: {rmse:.2f} µg/m³")

print("\nPERSISTENCE BASELINE")
print("----------------------------")
print(f"Baseline MAE: {baseline_mae:.2f} µg/m³")
print(f"Baseline RMSE: {baseline_rmse:.2f} µg/m³")


# -----------------------------------------
# SAVE MODEL AND METRICS
# -----------------------------------------

model_path = MODEL_DIR / "pm25_random_forest.joblib"
metrics_path = MODEL_DIR / "model_metrics.json"

joblib.dump(model, model_path)

metrics = {
    "model": "RandomForestRegressor",
    "target": "PM2.5 one hour ahead",
    "training_records": len(X_train),
    "testing_records": len(X_test),
    "random_forest_mae": round(mae, 3),
    "random_forest_rmse": round(rmse, 3),
    "baseline_mae": round(baseline_mae, 3),
    "baseline_rmse": round(baseline_rmse, 3),
    "data_source": "Open-Meteo model-derived historical estimates",
    "validation": "Chronological 80/20 split"
}

with open(metrics_path, "w") as file:
    json.dump(metrics, file, indent=4)

print("\nTRAINING COMPLETE!")
print("Model saved:", model_path)
print("Metrics saved:", metrics_path)

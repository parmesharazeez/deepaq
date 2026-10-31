# DEEPAQ — Predict Pollution Before It Peaks

DEEPAQ is a multi-city AI-powered air-quality prediction platform focused on neighbourhood-level pollution before, during and after Diwali.

Initial pilot: Chandigarh.

## Problem
Diwali can cause sharp air-pollution spikes. City-wide AQI readings may hide neighbourhood variation. Citizens need advance pollution forecasts to make informed decisions.

## Solution
DEEPAQ combines historical air-quality observations, weather conditions, traffic proxies and Diwali-specific temporal features to forecast pollution trends and provide health advisories.

## Core Features
- Current AQI dashboard
- 24/48/72-hour pollution forecasts
- Diwali vs normal-day comparisons
- Neighbourhood hotspot estimates
- Weather-pollution correlation
- Explainable predictions
- Health advisories
- Multi-city support

## Technology Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- Charts and maps: Recharts, Leaflet
- Backend: Python, FastAPI
- Data: Pandas, NumPy, Requests
- ML: scikit-learn, Random Forest

## Data Sources
- CPCB / verified public air-quality datasets
- Open-Meteo weather APIs
- Traffic and activity proxies where available
- Historical Diwali calendar features

## Scientific Integrity
- Distinguish observed, modelled, estimated and predicted values.
- Never fabricate live AQI readings.
- Missing values remain null, not zero.
- Validate predictions using chronological train/test splits.
- Do not claim neighbourhood accuracy without supporting data.
- Report held-out metrics and uncertainty.

## Current Status
Round 1: Git repository, Python environment, dependencies, API contract and architecture documentation prepared.

Live data integration, trained ML models and frontend implementation remain planned.

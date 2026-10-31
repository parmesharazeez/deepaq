# DEEPAQ API Contracts

## Geographic Scope
Multi-city air-quality intelligence platform.
Chandigarh is the initial development and testing city.

## Base URL
http://localhost:8000

## Supported City Data
Cities must be configured using verified coordinates and available data sources.
Do not assume every city has the same monitoring coverage.

## 1. Health Check
GET /health

## 2. Supported Cities
GET /api/v1/cities

Response:
{
  "cities": [
    {
      "id": "chandigarh",
      "name": "Chandigarh",
      "latitude": 30.7333,
      "longitude": 76.7794
    }
  ]
}

## 3. Current Air Quality
GET /api/v1/air-quality/current?city=chandigarh

## 4. Air Quality Forecast
GET /api/v1/air-quality/forecast?city=chandigarh&hours=72

## 5. Neighbourhood Hotspots
GET /api/v1/air-quality/hotspots?city=chandigarh

## 6. Health Advisory
GET /api/v1/health-advisory?city=chandigarh

## Data Integrity Rules
- Never fabricate live AQI readings.
- Distinguish observed, modelled, estimated and predicted data.
- Include source and timestamp wherever available.
- Do not present coarse-resolution model data as neighbourhood ground truth.
- Use CPCB-compatible AQI calculations when sufficient pollutant data exists.
- Missing values must be null, never zero.
- Include uncertainty wherever possible.
- Return only cities with configured and verified geographic metadata.
- Handle unavailable city data explicitly.

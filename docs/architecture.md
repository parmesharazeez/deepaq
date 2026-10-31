# DEEPAQ System Architecture

A modular multi-city air-quality prediction platform. Chandigarh is the initial pilot.

## Architecture

CPCB + Weather + Traffic + Diwali Calendar -> Data Ingestion -> Validation -> Feature Engineering -> ML Prediction -> FastAPI -> Next.js Dashboard.

## Scientific Integrity

- Distinguish observed, modelled, estimated and predicted values.
- Never fabricate live AQI readings.
- Missing values remain null, not zero.
- Do not present coarse-resolution model data as neighbourhood ground truth.
- Use chronological train/test splits.
- Report held-out metrics before claiming prediction accuracy.
- Communicate data source, timestamp and uncertainty.

# DEEPAQ — Atmospheric Intelligence & PM2.5 Prediction

<p align="center">
  <strong>"Understand the atmosphere. Anticipate what comes next."</strong>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fparmesharazeez%2Fdeepaq&root-directory=frontend">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.3-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/ML-Random_Forest-285338?style=flat-square" alt="Random Forest" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

---

## Overview

**DEEPAQ** is an environmental intelligence platform that transforms multi-basin atmospheric telemetry and boundary-layer meteorology into actionable civic health insights and short-term machine learning predictions.

Calibrated on **2,208 continuous hours of atmospheric observation records** from Chandigarh (India), DEEPAQ bridges raw ground-sensor monitoring with 1-hour-ahead predictive anticipation ($\text{MAE } \pm 2.962\text{ µg/m³}$, $R^2 = 0.981$).

---

## Core Capabilities

### 1. Hero Machine Learning Prediction ($t + 1\text{h}$)
* **Random Forest Regressor:** 200 decision tree ensemble trained on autoregressive lags ($L_1 \dots L_{14}$), surface boundary thermodynamics, and kinetic wind advection.
* **Empirical Validation:**
  * **Mean Absolute Error (MAE):** $\pm 2.962\text{ µg/m³}$
  * **Root Mean Squared Error (RMSE):** $4.178\text{ µg/m³}$
  * **Coefficient of Determination ($R^2$):** $0.981$
* **Twin Telemetry:** Immediate side-by-side visual comparison between observed ground sensor concentration and predicted 1-hour trajectory.

### 2. Chandigarh & Basin Air Intelligence
* **Sub-Himalayan Katabatic Trap:** Decodes how nocturnal cold air rolls down from the Shivalik foothills into the $321\text{ m ASL}$ bowl, creating a surface thermal inversion lid ($<200\text{ m}$).
* **Diurnal Boundary Layer Cycling:** Pinpoints the daily ventilation window ($13{:}30\text{–}16{:}30$) versus high-risk morning accumulation peaks ($07{:}00\text{–}09{:}30$).
* **Micro-Zone Variance:** Explains spatial disparities between vegetative buffers (Sukhna Lake, Sector 1) and dense vehicular corridors (Sector 17, Industrial Area Phase 1 & 2).

### 3. Accessible Public Health Guidance
* **Tailored Personas:** Plain-English guidance designed for children under 5, seniors 65+, active athletes, and general citizens.
* **NAAQS & WHO Compliance:** Evaluates PM2.5, PM10, $\text{NO}_2$, $\text{SO}_2$, and $\text{O}_3$ against national ambient standards.

### 4. Apple-Grade Interaction Quality
* **Zero-Flash SSR Theme Synchronization:** Uses React 19 `useSyncExternalStore` and `<head>` hydration scripts to deliver instant Obsidian Dark and Warm Editorial Light modes with zero hydration mismatch.
* **Latency Scrolling & Restraint:** Built with subtle tactile borders, minimal monospace numerals, and zero flashy or disorienting animations.

---

## Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │         Open-Meteo & Ground Telemetry        │
                  └──────────────────────┬───────────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
               ┌───────────────────┐           ┌───────────────────┐
               │    FastAPI API    │           │ Next.js App Router│
               │ (Python / scikit) │           │ (Edge / Serverless)│
               └─────────┬─────────┘           └─────────┬─────────┘
                         │                               │
                         └───────────────┬───────────────┘
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │   DEEPAQ Next.js 16 Client    │
                         │   - Twin Hero Prediction      │
                         │   - 24h/72h Trajectory Curves │
                         │   - Basin Air Intelligence    │
                         │   - 16 All-India Air Basins   │
                         └───────────────────────────────┘
```

---

## Deploy to Vercel

### Option 1: 1-Click Deployment (Recommended)

Click the button below to deploy DEEPAQ to Vercel with all monorepo settings pre-configured:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fparmesharazeez%2Fdeepaq&root-directory=frontend)

1. Sign in to your Vercel account.
2. The **Root Directory** is automatically set to `frontend`.
3. Click **Deploy**. Your app will be live in ~45 seconds.

### Option 2: Deploy via Vercel Web Dashboard

1. Navigate to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository: `parmesharazeez/deepaq`.
3. In the **Configure Project** screen:
   * **Root Directory:** Click `Edit` and select `frontend`.
   * **Framework Preset:** `Next.js` (automatically detected).
4. Click **Deploy**.

### Option 3: Deploy via Vercel CLI

```bash
# Navigate to the frontend directory
cd frontend

# Deploy preview
npx vercel

# Deploy to production
npx vercel --prod
```

---

## Local Development

### Prerequisites
* Node.js 18.17+ or 20+
* Python 3.10+ (optional, for running the local ML Python backend)

### 1. Frontend Setup

```bash
# Clone the repository
git clone git@github.com:parmesharazeez/deepaq.git
cd deepaq/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend Setup (Optional)

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --port 8000 --reload
```

---

## Project Structure

```
deepaq/
├── frontend/                     # Next.js 16.4.3 App Router Application
│   ├── app/                      # App router layouts and API endpoints
│   │   ├── api/                  # Serverless proxy routes (/predictions, /dashboard)
│   │   ├── globals.css           # Refined Light/Dark theme CSS variables
│   │   ├── layout.tsx            # Zero-flash SSR head script
│   │   └── page.tsx              # Main application controller
│   ├── components/               # High-fidelity UI components
│   │   ├── views/                # Full-page dedicated platform views
│   │   │   ├── HomeView.tsx      # Twin Hero Prediction & Telemetry
│   │   │   ├── BasinIntelligenceView.tsx # Chandigarh Topography & Science
│   │   │   ├── IntelligenceView.tsx      # ML Model Weights & Diagnostics
│   │   │   ├── TrendsView.tsx    # 24h/72h Forecast Charts
│   │   │   ├── HealthView.tsx    # Actionable Health Protocols
│   │   │   └── ExploreView.tsx   # 16 All-India Cities Network
│   │   ├── Header.tsx            # Sticky header with theme toggle
│   │   ├── Sidebar.tsx           # Collapsible navigation rail
│   │   └── LocationBar.tsx       # Basin search and geolocation
│   ├── hooks/                    # useTheme (useSyncExternalStore), useDashboardData
│   └── lib/                      # dataProvider, types, constants, utilities
├── backend/                      # Python FastAPI ML inference service
│   └── app/                      # Prediction API routes and endpoints
├── models/                       # Model metadata and training specs
├── data/raw/                     # Historical dataset (Chandigarh 2,208 records)
└── vercel.json                   # Vercel deployment configuration
```

---

## License

This project is licensed under the [MIT License](LICENSE).

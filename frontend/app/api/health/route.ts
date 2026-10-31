import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "DEEPAQ Environmental Intelligence Platform",
    version: "production",
    data_providers: [
      "Open-Meteo Atmospheric Chemistry Model (~11 km)",
      "Open-Meteo Numerical Weather Prediction (NWP)",
      "DEEPAQ Random Forest Regressor (Chandigarh Basin)",
    ],
    timestamp: new Date().toISOString(),
  });
}

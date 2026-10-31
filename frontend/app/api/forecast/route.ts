import { NextRequest, NextResponse } from "next/server";
import { getLiveForecast } from "@/lib/dataProvider";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const hoursStr = searchParams.get("hours") || "72";
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  const hours = parseInt(hoursStr, 10) || 72;
  const lat = latStr ? parseFloat(latStr) : null;
  const lon = lonStr ? parseFloat(lonStr) : null;

  try {
    const data = await getLiveForecast(city, hours, lat, lon);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch forecast";
    return NextResponse.json(
      { error: message, status: "error" },
      { status: 502 }
    );
  }
}

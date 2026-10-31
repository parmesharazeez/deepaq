import { NextRequest, NextResponse } from "next/server";
import { getLiveDashboard } from "@/lib/dataProvider";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  const lat = latStr ? parseFloat(latStr) : null;
  const lon = lonStr ? parseFloat(lonStr) : null;

  try {
    const data = await getLiveDashboard(city, lat, lon);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch dashboard data";
    return NextResponse.json(
      { error: message, status: "error" },
      { status: 502 }
    );
  }
}

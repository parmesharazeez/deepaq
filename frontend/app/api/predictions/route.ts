import { NextRequest, NextResponse } from "next/server";
import { getLivePrediction } from "@/lib/dataProvider";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  try {
    const data = await getLivePrediction(city);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to calculate prediction";
    return NextResponse.json(
      { error: message, status: "error" },
      { status: 502 }
    );
  }
}

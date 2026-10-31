import { NextResponse } from "next/server";
import { CITIES_DIRECTORY } from "@/lib/constants";

export async function GET() {
  return NextResponse.json({
    count: CITIES_DIRECTORY.length,
    cities: CITIES_DIRECTORY,
  });
}

import { NextResponse } from "next/server";
import { getExploreCities } from "@/lib/dataProvider";

export async function GET() {
  try {
    const data = await getExploreCities();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load national explore data";
    return NextResponse.json(
      { error: message, status: "error" },
      { status: 502 }
    );
  }
}

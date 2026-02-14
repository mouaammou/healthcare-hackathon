import { NextResponse } from "next/server"
import { loadRegions } from "@/lib/parser"
import { computeAllRegions } from "@/lib/riskEngine"

export async function GET() {
  try {
    const rawRegions = loadRegions()
    const processed = computeAllRegions(rawRegions)
    return NextResponse.json(processed)
  } catch (error) {
    console.error("Error processing regions:", error)
    return NextResponse.json(
      { error: "Failed to process region data" },
      { status: 500 }
    )
  }
}

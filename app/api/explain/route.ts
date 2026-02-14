import { NextResponse } from "next/server"
import { loadProcessedRegions } from "@/lib/parser"
import type { ProcessedRegion } from "@/lib/types"

function buildRegionExplanation(region: ProcessedRegion): string {
  const { region_name, overall_level, overall_score, categories, indicators } =
    region
  const highCats = Object.entries(categories)
    .filter(([, c]) => c.level === "HIGH")
    .map(([k]) => k.replace("_", "-"))

  const lines: string[] = [
    `${region_name} is currently at ${overall_level} overall risk (score: ${overall_score.toFixed(1)}).`,
  ]
  if (highCats.length > 0) {
    lines.push(
      `Elevated risk in: ${highCats.join(", ")}.`
    )
  }
  lines.push(
    `Conditions: temperature ${indicators.temperature}°C, humidity ${indicators.humidity}%, water quality index ${indicators.water_quality_index}/100.`
  )
  return lines.join(" ")
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const regionName = searchParams.get("region")

    if (!regionName) {
      return NextResponse.json(
        { error: "Region name is required" },
        { status: 400 }
      )
    }

    const processed = loadProcessedRegions()
    const region = processed.find(
      (r) => r.region_name.toLowerCase() === regionName.toLowerCase()
    )

    if (!region) {
      return NextResponse.json(
        { error: "Region not found" },
        { status: 404 }
      )
    }

    const explanation = buildRegionExplanation(region)

    return NextResponse.json({ region_name: region.region_name, explanation })
  } catch (error) {
    console.error("Error generating explanation:", error)
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    )
  }
}

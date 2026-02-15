import { NextResponse } from "next/server"
import { loadProcessedRegions } from "@/lib/parser"
import type { ProcessedRegion } from "@/lib/types"

function buildRegionExplanation(region: ProcessedRegion): string {
  const { region_name, overall_level, overall_score, categories, indicators } =
    region
  const catLabels: Record<string, string> = {
    vector_borne: "Parasitic Infections",
    water_food_borne: "water- and food-borne",
    respiratory: "viral respiratory",
    zoonotic_plague: "zoonotic and plague",
    climate_emerging: "climate-sensitive and TADs",
  }
  const highCats = Object.entries(categories)
    .filter(([, c]) => c.level === "HIGH")
    .map(([k]) => catLabels[k] ?? k)

  const lines: string[] = [
    `${region_name} is at ${overall_level} endemic risk (score: ${overall_score.toFixed(1)}).`,
  ]
  if (highCats.length > 0) {
    lines.push(`Elevated in: ${highCats.join(", ")}.`)
  }
  lines.push(
    `Drivers: climate ${indicators.temperature}°C, vector suitability ${indicators.humidity}% humidity, water & sanitation index ${indicators.water_quality_index}/100, population ${(indicators.population / 1e6).toFixed(1)}M.`
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

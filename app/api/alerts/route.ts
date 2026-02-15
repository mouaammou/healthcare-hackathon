import { NextResponse } from "next/server"
import { loadProcessedRegions } from "@/lib/parser"
import type { AlertData, ProcessedRegion } from "@/lib/types"

const catLabels: Record<string, string> = {
  vector_borne: "vector-borne",
  water_food_borne: "water- and food-borne",
  respiratory: "viral respiratory",
  zoonotic_plague: "zoonotic and plague",
  climate_emerging: "climate-sensitive and TADs",
}

function buildAlertMessage(region: ProcessedRegion): string {
  const highCats = Object.entries(region.categories)
    .filter(([, c]) => c.level === "HIGH")
    .map(([k]) => catLabels[k] ?? k)
  return `High endemic risk in ${region.region_name} (score: ${region.overall_score.toFixed(1)}). Elevated: ${highCats.length ? highCats.join(", ") : "multiple"}. Climate ${region.indicators.temperature}°C, water & sanitation ${region.indicators.water_quality_index}/100.`
}

export async function GET() {
  try {
    const processed = loadProcessedRegions()
    const highRiskRegions = processed.filter((r) => r.overall_level === "HIGH")

    const alerts: AlertData[] = highRiskRegions.map((region) => {
      const message = buildAlertMessage(region)
      return {
        region_name: region.region_name,
        level: region.overall_level,
        message,
        timestamp: new Date().toISOString(),
      }
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error generating alerts:", error)
    return NextResponse.json(
      { error: "Failed to generate alerts" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { loadProcessedRegions } from "@/lib/parser"
import type { AlertData, ProcessedRegion } from "@/lib/types"

function buildAlertMessage(region: ProcessedRegion): string {
  const highCats = Object.entries(region.categories)
    .filter(([, c]) => c.level === "HIGH")
    .map(([k]) => k.replace("_", "-"))
  return `High risk in ${region.region_name} (score: ${region.overall_score.toFixed(1)}). Elevated categories: ${highCats.length ? highCats.join(", ") : "multiple"}. Temperature ${region.indicators.temperature}°C, humidity ${region.indicators.humidity}%, water quality ${region.indicators.water_quality_index}/100.`
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

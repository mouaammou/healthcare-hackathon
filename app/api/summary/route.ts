import { NextResponse } from "next/server"
import { loadProcessedRegions } from "@/lib/parser"

function buildNationalSummary(
  processed: Awaited<ReturnType<typeof loadProcessedRegions>>
): string {
  const high = processed.filter((r) => r.overall_level === "HIGH")
  const medium = processed.filter((r) => r.overall_level === "MEDIUM")
  const low = processed.filter((r) => r.overall_level === "LOW")

  const parts: string[] = []
  if (high.length > 0) {
    parts.push(
      `${high.length} region(s) at high risk: ${high.map((r) => r.region_name).join(", ")}.`
    )
  }
  if (medium.length > 0) {
    parts.push(
      `${medium.length} region(s) at medium risk: ${medium.map((r) => r.region_name).join(", ")}.`
    )
  }
  if (low.length > 0) {
    parts.push(
      `${low.length} region(s) at low risk: ${low.map((r) => r.region_name).join(", ")}.`
    )
  }
  return parts.length
    ? parts.join(" ")
    : "No regional risk data available at this time."
}

export async function GET() {
  try {
    const processed = loadProcessedRegions()
    const summary = buildNationalSummary(processed)

    const highCount = processed.filter((r) => r.overall_level === "HIGH").length
    const medCount = processed.filter((r) => r.overall_level === "MEDIUM").length
    const lowCount = processed.filter((r) => r.overall_level === "LOW").length

    return NextResponse.json({
      summary,
      stats: {
        total: processed.length,
        high: highCount,
        medium: medCount,
        low: lowCount,
      },
    })
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json(
      { error: "Failed to generate national summary" },
      { status: 500 }
    )
  }
}

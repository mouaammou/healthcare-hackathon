import type { RegionRawData } from "./types"
import regionsData from "@/mockData/regions.json"

export function loadRegions(): RegionRawData[] {
  return regionsData as RegionRawData[]
}

export function normalizeSymptoms(
  symptoms: number,
  population: number
): number {
  return (symptoms / population) * 10000
}

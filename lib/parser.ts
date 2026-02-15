import type { RegionRawData, ProcessedRegion, RiskLevel } from "./types"
import regionsData from "@/mockData/regions.json"

/** Mock region row: raw fields plus pre-set overall_level and overall_score */
interface MockRegionRow extends RegionRawData {
  overall_level: RiskLevel
  overall_score: number
}

function toProcessedRegion(row: MockRegionRow): ProcessedRegion {
  const { region_name, symptoms, population, temperature, humidity, water_quality_index, overall_level, overall_score } = row
  const norm = (s: number) => Math.round((s / population) * 10000 * 10) / 10
  const cat = () => ({ score: overall_score, level: overall_level })
  return {
    region_name,
    overall_score,
    overall_level,
    categories: {
      vector_borne: cat(),
      water_food_borne: cat(),
      respiratory: cat(),
      zoonotic_plague: cat(),
      climate_emerging: cat(),
    },
    indicators: { temperature, humidity, water_quality_index, population },
    normalized: {
      vector_borne: norm(symptoms.vector_borne),
      water_food_borne: norm(symptoms.water_food_borne),
      respiratory: norm(symptoms.respiratory),
      zoonotic_plague: norm(symptoms.zoonotic_plague),
      climate_emerging: norm(symptoms.climate_emerging),
    },
  }
}

export function loadRegions(): RegionRawData[] {
  return regionsData as RegionRawData[]
}

/** Load processed regions from mock data only (no risk engine calculation). */
export function loadProcessedRegions(): ProcessedRegion[] {
  return (regionsData as MockRegionRow[]).map(toProcessedRegion)
}

export function normalizeSymptoms(
  symptoms: number,
  population: number
): number {
  return (symptoms / population) * 10000
}

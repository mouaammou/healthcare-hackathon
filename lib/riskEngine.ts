import type { RegionRawData, ProcessedRegion, RiskLevel, CategoryScore } from "./types"
import { normalizeSymptoms } from "./parser"

function assignLevel(score: number): RiskLevel {
  if (score < 30) return "LOW"
  if (score < 60) return "MEDIUM"
  return "HIGH"
}

function clampScore(score: number): number {
  return Math.min(100, Math.max(0, score))
}

function computeCategoryScore(score: number): CategoryScore {
  const clamped = clampScore(score)
  return {
    score: Math.round(clamped * 10) / 10,
    level: assignLevel(clamped),
  }
}

export function computeRegionRisk(region: RegionRawData): ProcessedRegion {
  const { symptoms, population, temperature, humidity, water_quality_index } = region

  // Normalize symptoms per 10k population
  const normWater = normalizeSymptoms(symptoms.waterborne, population)
  const normVector = normalizeSymptoms(symptoms.vector_borne, population)
  const normResp = normalizeSymptoms(symptoms.respiratory, population)
  const normOther = normalizeSymptoms(symptoms.other, population)

  // Compute category scores
  const waterborneScore = normWater * 0.7 + (100 - water_quality_index) * 0.3
  const vectorScore = normVector * 0.7 + (humidity + temperature / 2) * 0.3
  const respiratoryScore = normResp * 0.8 + humidity * 0.2
  const otherScore = normOther * 1.0

  // Overall weighted score
  const overallScore =
    waterborneScore * 0.3 +
    vectorScore * 0.25 +
    respiratoryScore * 0.35 +
    otherScore * 0.1

  return {
    region_name: region.region_name,
    overall_score: Math.round(clampScore(overallScore) * 10) / 10,
    overall_level: assignLevel(overallScore),
    categories: {
      waterborne: computeCategoryScore(waterborneScore),
      vector_borne: computeCategoryScore(vectorScore),
      respiratory: computeCategoryScore(respiratoryScore),
      other: computeCategoryScore(otherScore),
    },
    indicators: {
      temperature,
      humidity,
      water_quality_index,
      population,
    },
    normalized: {
      waterborne: Math.round(normWater * 10) / 10,
      vector_borne: Math.round(normVector * 10) / 10,
      respiratory: Math.round(normResp * 10) / 10,
      other: Math.round(normOther * 10) / 10,
    },
  }
}

export function computeAllRegions(regions: RegionRawData[]): ProcessedRegion[] {
  return regions.map(computeRegionRisk)
}

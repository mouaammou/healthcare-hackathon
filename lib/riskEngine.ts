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
  const normVector = normalizeSymptoms(symptoms.vector_borne, population)
  const normWaterFood = normalizeSymptoms(symptoms.water_food_borne, population)
  const normResp = normalizeSymptoms(symptoms.respiratory, population)
  const normZoonotic = normalizeSymptoms(symptoms.zoonotic_plague, population)
  const normClimate = normalizeSymptoms(symptoms.climate_emerging, population)

  // Compute category scores (endemic disease drivers)
  const vectorScore = normVector * 0.7 + (humidity + temperature / 2) * 0.3
  const waterFoodScore = normWaterFood * 0.7 + (100 - water_quality_index) * 0.3
  const respiratoryScore = normResp * 0.8 + humidity * 0.2
  const zoonoticScore = normZoonotic * 1.0
  const climateScore = normClimate * 0.6 + (temperature / 3) * 0.4

  // Overall weighted score
  const overallScore =
    vectorScore * 0.25 +
    waterFoodScore * 0.25 +
    respiratoryScore * 0.25 +
    zoonoticScore * 0.15 +
    climateScore * 0.1

  return {
    region_name: region.region_name,
    overall_score: Math.round(clampScore(overallScore) * 10) / 10,
    overall_level: assignLevel(overallScore),
    categories: {
      vector_borne: computeCategoryScore(vectorScore),
      water_food_borne: computeCategoryScore(waterFoodScore),
      respiratory: computeCategoryScore(respiratoryScore),
      zoonotic_plague: computeCategoryScore(zoonoticScore),
      climate_emerging: computeCategoryScore(climateScore),
    },
    indicators: {
      temperature,
      humidity,
      water_quality_index,
      population,
    },
    normalized: {
      vector_borne: Math.round(normVector * 10) / 10,
      water_food_borne: Math.round(normWaterFood * 10) / 10,
      respiratory: Math.round(normResp * 10) / 10,
      zoonotic_plague: Math.round(normZoonotic * 10) / 10,
      climate_emerging: Math.round(normClimate * 10) / 10,
    },
  }
}

export function computeAllRegions(regions: RegionRawData[]): ProcessedRegion[] {
  return regions.map(computeRegionRisk)
}

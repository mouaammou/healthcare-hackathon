export interface RegionRawData {
  region_name: string
  symptoms: {
    vector_borne: number
    water_food_borne: number
    respiratory: number
    zoonotic_plague: number
    climate_emerging: number
  }
  temperature: number
  humidity: number
  water_quality_index: number
  population: number
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH"

export interface CategoryScore {
  score: number
  level: RiskLevel
}

export interface ProcessedRegion {
  region_name: string
  overall_score: number
  overall_level: RiskLevel
  categories: {
    vector_borne: CategoryScore
    water_food_borne: CategoryScore
    respiratory: CategoryScore
    zoonotic_plague: CategoryScore
    climate_emerging: CategoryScore
  }
  indicators: {
    temperature: number
    humidity: number
    water_quality_index: number
    population: number
  }
  normalized: {
    vector_borne: number
    water_food_borne: number
    respiratory: number
    zoonotic_plague: number
    climate_emerging: number
  }
}

export interface AlertData {
  region_name: string
  level: RiskLevel
  message: string
  timestamp: string
}

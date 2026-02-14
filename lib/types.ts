export interface RegionRawData {
  region_name: string
  symptoms: {
    waterborne: number
    vector_borne: number
    respiratory: number
    other: number
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
    waterborne: CategoryScore
    vector_borne: CategoryScore
    respiratory: CategoryScore
    other: CategoryScore
  }
  indicators: {
    temperature: number
    humidity: number
    water_quality_index: number
    population: number
  }
  normalized: {
    waterborne: number
    vector_borne: number
    respiratory: number
    other: number
  }
}

export interface AlertData {
  region_name: string
  level: RiskLevel
  message: string
  timestamp: string
}

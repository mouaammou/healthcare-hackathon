"use client"

import type { ProcessedRegion } from "@/lib/types"
import { RiskBadge } from "./RiskBadge"
import { MapPin, ChevronRight } from "lucide-react"

interface RegionListProps {
  regions: ProcessedRegion[]
  selectedRegion: ProcessedRegion | null
  onSelectRegion: (region: ProcessedRegion) => void
}

const levelOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }

export function RegionList({ regions, selectedRegion, onSelectRegion }: RegionListProps) {
  const sorted = [...regions].sort(
    (a, b) => levelOrder[a.overall_level] - levelOrder[b.overall_level]
  )

  return (
    <div className="flex flex-col gap-1.5">
      {sorted.map((region) => {
        const isSelected = selectedRegion?.region_name === region.region_name
        return (
          <button
            key={region.region_name}
            onClick={() => onSelectRegion(region)}
            className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
              isSelected
                ? "border-primary/50 bg-primary/15 ring-1 ring-primary/30"
                : "border-white/10 bg-secondary/30 hover:border-white/20 hover:bg-secondary/50"
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  isSelected ? "bg-primary/30" : "bg-white/5"
                }`}
              >
                <MapPin
                  className={`h-4 w-4 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`truncate text-sm font-semibold ${
                  isSelected ? "text-foreground" : "text-card-foreground"
                }`}
              >
                {region.region_name}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <RiskBadge level={region.overall_level} size="sm" />
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isSelected ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                }`}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}

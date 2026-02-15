"use client"

import type { ProcessedRegion } from "@/lib/types"
import { RiskBadge } from "./RiskBadge"
import { ShieldAlert, ChevronRight } from "lucide-react"

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
    <div className="flex flex-col gap-2">
      <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Regions by endemic risk
      </p>
      <div className="flex flex-col gap-1.5">
        {sorted.map((region) => {
          const isSelected = selectedRegion?.region_name === region.region_name
          return (
            <button
              key={region.region_name}
              onClick={() => onSelectRegion(region)}
              className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                isSelected
                  ? "border-border bg-[#E8E8E8] text-foreground"
                  : "border-border bg-white hover:bg-muted/50 text-foreground"
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {region.region_name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Score {region.overall_score.toFixed(1)} · Endemic risk
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <RiskBadge level={region.overall_level} size="sm" />
                <ChevronRight
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    isSelected ? "text-foreground" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

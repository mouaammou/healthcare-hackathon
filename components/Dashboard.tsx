"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ProcessedRegion } from "@/lib/types"
import { DashboardHeader } from "./DashboardHeader"
import { RegionPanel } from "./RegionPanel"
import { RegionList } from "./RegionList"
import { NationalSummary } from "./NationalSummary"
import { Loader2 } from "lucide-react"

const MoroccoMap = dynamic(
  () => import("./MoroccoMap").then((mod) => ({ default: mod.MoroccoMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Loading map...</span>
        </div>
      </div>
    )
  }
)

export function Dashboard() {
  const [regions, setRegions] = useState<ProcessedRegion[]>([])
  const [selectedRegion, setSelectedRegion] = useState<ProcessedRegion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRegions(data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSelectRegion = useCallback((region: ProcessedRegion | null) => {
    setSelectedRegion(region)
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedRegion(null)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading health data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <DashboardHeader regions={regions} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - light gray like screenshot */}
        <aside className="hidden w-80 flex-col gap-3 overflow-y-auto border-r border-border bg-[#F9FAFB] p-4 lg:flex">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              All Regions
            </span>
            <RegionList
              regions={regions}
              selectedRegion={selectedRegion}
              onSelectRegion={handleSelectRegion}
            />
          </div>
        </aside>

        {/* Map Area */}
        <main className="relative flex-1">
          <MoroccoMap
            regions={regions}
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
          />

          {/* Mobile region selector */}
          <div className="absolute bottom-4 left-4 right-4 lg:hidden">
            <select
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground shadow-sm"
              value={selectedRegion?.region_name ?? ""}
              onChange={(e) => {
                const region = regions.find((r) => r.region_name === e.target.value)
                if (region) handleSelectRegion(region)
              }}
            >
              <option value="">Select a region...</option>
              {regions.map((r) => (
                <option key={r.region_name} value={r.region_name}>
                  {r.region_name} - {r.overall_level}
                </option>
              ))}
            </select>
          </div>

          {/* Region Detail Panel */}
          {selectedRegion && (
            <RegionPanel region={selectedRegion} onClose={handleClosePanel} />
          )}
        </main>
      </div>
    </div>
  )
}

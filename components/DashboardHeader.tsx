"use client"

import { Activity, Radio, Shield, AlertTriangle, TrendingUp, Minus } from "lucide-react"
import type { ProcessedRegion } from "@/lib/types"

interface DashboardHeaderProps {
  regions: ProcessedRegion[]
}

export function DashboardHeader({ regions }: DashboardHeaderProps) {
  const highCount = regions.filter((r) => r.overall_level === "HIGH").length
  const medCount = regions.filter((r) => r.overall_level === "MEDIUM").length
  const lowCount = regions.filter((r) => r.overall_level === "LOW").length

  return (
    <header className="flex flex-col gap-4 border-b border-border bg-white px-6 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Health Prediction
            </h1>
            <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              LIVE
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Morocco · Early Warning Surveillance
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <span className="block text-lg font-bold tabular-nums text-foreground">
              {highCount}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              High Risk
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
            <Minus className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <span className="block text-lg font-bold tabular-nums text-foreground">
              {medCount}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Medium
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
            <Shield className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <span className="block text-lg font-bold tabular-nums text-foreground">
              {lowCount}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Low Risk
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

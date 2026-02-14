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
    <header className="flex flex-col gap-4 border-b border-white/10 bg-card/80 px-6 py-4 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Health Prediction
            </h1>
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Morocco · Early Warning Surveillance
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 ring-1 ring-red-500/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <span className="block font-mono text-lg font-bold tabular-nums text-red-400">
              {highCount}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400/80">
              High Risk
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 ring-1 ring-amber-500/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
            <Minus className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <span className="block font-mono text-lg font-bold tabular-nums text-amber-400">
              {medCount}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/80">
              Medium
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 ring-1 ring-emerald-500/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <span className="block font-mono text-lg font-bold tabular-nums text-emerald-400">
              {lowCount}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
              Low Risk
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

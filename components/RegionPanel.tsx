"use client"

import { useEffect, useState } from "react"
import {
  X,
  Droplets,
  Bug,
  Wind,
  Rabbit,
  CloudSun,
  Beaker,
  Users,
  Loader2,
  Radio,
} from "lucide-react"
import type { ProcessedRegion } from "@/lib/types"
import { RiskBadge } from "./RiskBadge"

interface RegionPanelProps {
  region: ProcessedRegion
  onClose: () => void
}

const categoryIcons = {
  vector_borne: Bug,
  water_food_borne: Droplets,
  respiratory: Wind,
  zoonotic_plague: Rabbit,
  climate_emerging: CloudSun,
}

const categoryLabels: Record<string, string> = {
  vector_borne: "Parasitic Infections",
  water_food_borne: "Water- & Food-Borne",
  respiratory: "Viral Respiratory",
  zoonotic_plague: "Zoonotic & Plague",
  climate_emerging: "Climate-Sensitive & TADs",
}

export function RegionPanel({ region, onClose }: RegionPanelProps) {
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    setLoading(true)
    setExplanation(null)
    fetch(`/api/explain?region=${encodeURIComponent(region.region_name)}`)
      .then((res) => res.json())
      .then((data) => setExplanation(data.explanation))
      .catch(() =>
        setExplanation("Analysis temporarily unavailable. Please try again.")
      )
      .finally(() => setLoading(false))
  }, [region.region_name])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 200)
  }

  const riskBarColor =
    region.overall_level === "LOW"
      ? "#22c55e"
      : region.overall_level === "MEDIUM"
      ? "#f59e0b"
      : "#ef4444"

  return (
    <div
      className={`absolute right-0 top-0 z-[1000] h-full w-full max-w-[420px] overflow-y-auto border-l border-border bg-white shadow-xl transition-transform duration-200 ease-out ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-5 py-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {region.region_name}
        </h2>
        <button
          onClick={handleClose}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Overall Risk */}
        <div className="rounded-xl border border-border bg-muted/30 p-5 shadow-sm">
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Risk Level
          </span>
          <div className="flex items-center justify-between gap-4">
            <RiskBadge level={region.overall_level} score={region.overall_score} size="lg" />
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.min(100, region.overall_score)}%`,
                backgroundColor: riskBarColor,
              }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Risk by Category
          </span>
          <div className="flex flex-col gap-2">
            {Object.entries(region.categories).map(([key, cat]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons]
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {categoryLabels[key]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {cat.score.toFixed(1)}
                    </span>
                    <RiskBadge level={cat.level} size="sm" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Key Drivers (endemic context) */}
        <div>
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Risk Drivers
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                icon: CloudSun,
                label: "Climate factor",
                value: `${region.indicators.temperature}°C`,
                color: "text-orange-600",
              },
              {
                icon: Bug,
                label: "Vector suitability",
                value: `${region.indicators.humidity}% humidity`,
                color: "text-amber-600",
              },
              {
                icon: Beaker,
                label: "Water & sanitation",
                value: `${region.indicators.water_quality_index}/100`,
                color: "text-emerald-600",
              },
              {
                icon: Users,
                label: "Population at risk",
                value: `${(region.indicators.population / 1000000).toFixed(1)}M`,
                color: "text-slate-600",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 shadow-sm"
              >
                <Icon className={`h-4 w-4 ${color}`} />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-muted-foreground">
                    {label}
                  </span>
                  <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="rounded-xl border border-border bg-primary/5 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Radio className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Endemic Risk Analysis
            </span>
          </div>
          {loading ? (
            <div className="flex items-center gap-3 py-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Generating analysis...
              </span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-foreground">
              {explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

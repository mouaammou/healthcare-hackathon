"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import type { AlertData } from "@/lib/types"

export function AlertsBanner() {
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAlerts(data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Scanning alerts...</span>
      </div>
    )
  }

  if (alerts.length === 0) return null

  return (
    <div className="overflow-hidden rounded-xl border border-red-500/30 bg-red-50 shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-red-50/80"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/80">
              Alert
            </span>
            <span className="text-sm font-bold text-red-600">
              {alerts.length} High-Risk Region{alerts.length > 1 ? "s" : ""} Detected
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-red-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-red-500" />
        )}
      </button>
      {expanded && (
        <div className="flex flex-col gap-2 border-t border-border bg-white px-4 py-3">
          {alerts.map((alert) => (
            <div
              key={alert.region_name}
              className="rounded-lg border border-border bg-muted/30 p-3"
            >
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-red-600">
                {alert.region_name}
              </span>
              <p className="text-sm leading-relaxed text-foreground">
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

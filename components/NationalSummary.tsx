"use client"

import { useEffect, useState } from "react"
import { Loader2, Radio } from "lucide-react"

interface SummaryData {
  summary: string
  stats: {
    total: number
    high: number
    medium: number
    low: number
  }
}

export function NationalSummary() {
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/summary")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Radio className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            National Brief
          </span>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center gap-3 py-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading prediction...</span>
        </div>
      ) : data ? (
        <p className="text-sm leading-relaxed text-foreground">
          {data.summary}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">Brief unavailable.</p>
      )}
    </div>
  )
}

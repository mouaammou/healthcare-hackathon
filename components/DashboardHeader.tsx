"use client"

import Image from "next/image"
import type { ProcessedRegion } from "@/lib/types"

interface DashboardHeaderProps {
  regions: ProcessedRegion[]
}

export function DashboardHeader({ regions }: DashboardHeaderProps) {
  return (
    <header className="flex justify-center gap-4 border-b border-border bg-white px-6 py-4 shadow-sm ">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-xl">
          <img
            src="logo.png"
            alt="Logo"
            className="object-contain"
                      />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              AI.VANTIS
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered early warning system for diseases
          </p>
        </div>
      </div>

    </header>
  )
}

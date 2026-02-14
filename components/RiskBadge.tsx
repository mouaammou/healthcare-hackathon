import { cn } from "@/lib/utils"
import type { RiskLevel } from "@/lib/types"

interface RiskBadgeProps {
  level: RiskLevel
  score?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const levelConfig: Record<RiskLevel, {
  bg: string
  text: string
  label: string
  dot: string
  border: string
  glow?: string
}> = {
  LOW: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    label: "Low",
    dot: "bg-emerald-400",
    border: "border-emerald-500/40",
  },
  MEDIUM: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    label: "Medium",
    dot: "bg-amber-400",
    border: "border-amber-500/40",
  },
  HIGH: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    label: "High",
    dot: "bg-red-400 animate-pulse",
    border: "border-red-500/50",
    glow: "risk-glow-high",
  },
}

const sizeClasses = {
  sm: "text-[10px] px-2 py-0.5 gap-1 font-bold",
  md: "text-xs px-2.5 py-1 gap-1.5 font-bold",
  lg: "text-sm px-3 py-1.5 gap-2 font-bold",
}

export function RiskBadge({ level, score, size = "md", className }: RiskBadgeProps) {
  const config = levelConfig[level]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-semibold uppercase tracking-wider",
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        config.glow,
        className
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full",
          size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-2.5 w-2.5",
          config.dot
        )}
      />
      {config.label}
      {score !== undefined && (
        <span className="font-mono opacity-90">({score.toFixed(1)})</span>
      )}
    </span>
  )
}

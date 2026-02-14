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
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    label: "Low",
    dot: "bg-emerald-500",
    border: "border-emerald-500/30",
  },
  MEDIUM: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    label: "Medium",
    dot: "bg-amber-500",
    border: "border-amber-500/30",
  },
  HIGH: {
    bg: "bg-red-500/10",
    text: "text-red-600",
    label: "High",
    dot: "bg-red-500 animate-pulse",
    border: "border-red-500/30",
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
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-wider shadow-sm",
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

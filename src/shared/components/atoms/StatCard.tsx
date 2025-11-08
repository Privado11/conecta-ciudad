import type React from "react"

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  valueColor?: string
  iconColor?: string
}

export function StatCard({
  label,
  value,
  icon,
  valueColor = "text-foreground",
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
        <div className={`w-8 h-8 ${iconColor}`}>{icon}</div>
      </div>
    </div>
  )
}

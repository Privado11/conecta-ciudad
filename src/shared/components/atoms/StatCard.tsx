import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SubStatData {
  label: string;
  value: number;
  suffix?: string; 
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  valueColor?: string;
  iconColor?: string;
  subStats?: SubStatData[];
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  description?: string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  valueColor = "text-foreground",
  iconColor = "text-primary",
  subStats,
  trend,
  description,
  loading = false,
}: StatCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === "number") {
      return val.toLocaleString("es-CO");
    }
    return val;
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-12 w-12 bg-muted animate-pulse rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className={cn("text-3xl font-bold tracking-tight", valueColor)}>
                {formatValue(value)}
              </p>
              {trend && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    trend.isPositive !== false
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {trend.isPositive !== false ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>

            {subStats && subStats.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
                {subStats.map((subStat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">
                      {subStat.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatValue(subStat.value)}
                      {subStat.suffix || ""} 
                    </span>
                  </div>
                ))}
              </div>
            )}

            {description && (
              <p className="text-xs text-muted-foreground mt-2">
                {description}
              </p>
            )}
          </div>

          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0",
              iconColor
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
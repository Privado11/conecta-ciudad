import type { LucideIcon } from "lucide-react";
import { StatCard } from "../atoms/StatCard";

export interface SubStat {
  label: string;
  value: string;
  suffix?: string; 
}

export interface StatConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  valueKey: string;
  description?: string;
  subStats?: SubStat[]; 
  trend?: {
    value: number;
    isPositive?: boolean;
  };
}

interface StatsGridProps {
  stats: StatConfig[];
  data: {
    totalElements?: number;
    metrics?: Record<string, string | number | boolean | null>;
  };
  loading?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function StatsGrid({
  stats,
  data,
  loading = false,
  columns = 3,
}: StatsGridProps) {
  const getGridClass = () => {
    switch (columns) {
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-5";
      case 6:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-6";
      default:
        return "grid-cols-1 md:grid-cols-3";
    }
  };

  return (
    <div className={`grid ${getGridClass()} gap-4`}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        const metricValue =
          stat.valueKey === "total"
            ? data.totalElements || 0
            : (data.metrics?.[stat.valueKey] as number) || 0;

        const subStatsData = stat.subStats?.map((subStat) => ({
          label: subStat.label,
          value: (data.metrics?.[subStat.value] as number) || 0,
          suffix: subStat.suffix, 
        }));

        return (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={metricValue}
            icon={<Icon className="h-5 w-5" />}
            iconColor={stat.iconColor}
            valueColor={stat.valueColor}
            description={stat.description}
            subStats={subStatsData} 
            trend={stat.trend}
            loading={loading}
          />
        );
      })}
    </div>
  );
}
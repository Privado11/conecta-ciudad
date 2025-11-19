// @/shared/constants/curator/curatorStats.ts
import type { StatConfig } from "@/shared/components/molecules/StatsGrid";
import { Eye, AlertCircle, Clock, RotateCcw } from "lucide-react";

export const CURATOR_STATS: StatConfig[] = [
  {
    key: "total",
    label: "Total en Cola",
    icon: Eye,
    iconColor: "text-blue-600",
    valueColor: "text-blue-600",
    valueKey: "total",
    description: "Proyectos pendientes de revisión",
  },
  {
    key: "overdue",
    label: "Vencidas",
    icon: AlertCircle,
    iconColor: "text-red-600",
    valueColor: "text-red-600",
    valueKey: "overdue",
    description: "Revisiones que excedieron el plazo",
    subStats: [
      { label: "Prioridad crítica", value: "criticalPriority" },
    ],
  },
  {
    key: "dueSoon",
    label: "Próximas a Vencer",
    icon: Clock,
    iconColor: "text-amber-600",
    valueColor: "text-amber-600",
    valueKey: "dueSoon",
    description: "Vencen en 2 días o menos",
    subStats: [
      { label: "Prioridad alta", value: "highPriority" },
    ],
  },
  {
    key: "resubmissions",
    label: "Reenvíos",
    icon: RotateCcw,
    iconColor: "text-purple-600",
    valueColor: "text-purple-600",
    valueKey: "resubmissions",
    description: "Proyectos devueltos con observaciones previas",
  },
];
import type { StatConfig } from "@/shared/components/molecules/StatsGrid";
import { History, CheckCircle2, RotateCcw,  TrendingUp } from "lucide-react";

export const REVIEW_HISTORY_STATS: StatConfig[] = [
  {
    key: "total",
    label: "Total Revisados",
    icon: History,
    iconColor: "text-blue-600",
    valueColor: "text-blue-600",
    valueKey: "total",
    description: "Cantidad total de proyectos revisados",
  },
  {
    key: "approved",
    label: "Proyectos Aprobados",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    valueColor: "text-green-600",
    valueKey: "approved",
    subStats: [
      { label: "Tasa de aprobación", value: "approvalRate", suffix: "%" },
    ],
  },
  {
    key: "returned",
    label: "Proyectos Devueltos",
    icon: RotateCcw,
    iconColor: "text-amber-600",
    valueColor: "text-amber-600",
    valueKey: "returned",
    subStats: [
      { label: "Reenvíos", value: "resubmissions" },
      { label: "Tasa de devolución", value: "returnRate", suffix: "%" },
    ],
  },
  {
    key: "performance",
    label: "Desempeño",
    icon: TrendingUp,
    iconColor: "text-purple-600",
    valueColor: "text-purple-600",
    valueKey: "completedOnTime",
    description: "Proyectos completados a tiempo",
    subStats: [
      { label: "Tiempo promedio", value: "averageDaysToComplete", suffix: " días" },
      { label: "Tasa puntualidad", value: "onTimeRate", suffix: "%" },
    ],
  },
];
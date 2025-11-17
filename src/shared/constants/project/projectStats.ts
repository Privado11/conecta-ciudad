import type { StatConfig } from "@/shared/components/molecules/StatsGrid";
import { Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const PROJECT_STATS: StatConfig[] = [
  {
    key: "total",
    label: "Total de Proyectos",
    icon: Activity,
    iconColor: "text-blue-600",
    valueColor: "text-blue-600",
    valueKey: "total",
    description: "Cantidad total de proyectos registrados",
  },
  {
    key: "inProgress",
    label: "En Proceso",
    icon: Clock,
    iconColor: "text-amber-600",
    valueColor: "text-amber-600",
    valueKey: "inProgress",
    subStats: [
      { label: "Pendientes", value: "pending" },
      { label: "En Revisión", value: "inReview" },
      { label: "Devueltos", value: "withObservations" },
    ],
  },
  {
    key: "needsAttention",
    label: "Requieren Atención",
    icon: AlertCircle,
    iconColor: "text-red-600",
    valueColor: "text-red-600",
    valueKey: "withObservations",
    description: "Proyectos con observaciones",
  },
  {
    key: "completed",
    label: "Completados",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    valueColor: "text-green-600",
    valueKey: "completed",
    subStats: [
      { label: "Listos", value: "readyToPublish" },
      { label: "Publicados", value: "published" },
      { label: "Votados", value: "votingClosed" },
    ],
  },
];

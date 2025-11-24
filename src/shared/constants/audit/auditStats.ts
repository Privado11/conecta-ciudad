import type { StatConfig } from "@/shared/components/molecules/StatsGrid";
import { Activity, CheckCircle2, XCircle, Clock } from "lucide-react";

export const AUDIT_STATS: StatConfig[] = [
  {
    key: "total",
    label: "Total de Acciones",
    icon: Activity,
    iconColor: "text-blue-600",
    valueColor: "text-blue-600",
    valueKey: "total",
    description: "Todas las acciones registradas",
  },
  {
    key: "successful",
    label: "Acciones Exitosas",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    valueColor: "text-green-600",
    valueKey: "successful",
    description: "Operaciones completadas",
  },
  {
    key: "failed",
    label: "Acciones Fallidas",
    icon: XCircle,
    iconColor: "text-red-600",
    valueColor: "text-red-600",
    valueKey: "failed",
    description: "Operaciones con errores",
  },
  {
    key: "today",
    label: "Acciones De Hoy",
    icon: Clock,
    iconColor: "text-black",
    valueKey: "today",
    description: "Operaciones en las últ. 24 horas",
  },
];

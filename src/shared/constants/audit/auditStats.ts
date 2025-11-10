import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";

export const AUDIT_STATS = [
  {
    label: "Total Acciones",
    icon: Activity,
    color: "text-blue-500",
    valueKey: "total",
  },
  {
    label: "Acciones Exitosas",
    icon: CheckCircle,
    color: "text-green-500",
    valueKey: "success",
  },
  {
    label: "Acciones Fallidas",
    icon: XCircle,
    color: "text-red-500",
    valueKey: "failed",
  },
  {
    label: "Acciones de Hoy",
    icon: Clock,
    color: "text-blue-500",
    valueKey: "today",
  },
];

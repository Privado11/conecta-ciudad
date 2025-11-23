import type { StatConfig } from "@/shared/components/molecules/StatsGrid";
import { Users, UserCheck, UserX } from "lucide-react";


export const USER_STATS: StatConfig[] = [
  {
    key: "total",
    label: "Total de Usuarios",
    icon: Users,
    iconColor: "text-blue-600",
    valueKey: "total",
    description: "Usuarios registrados",
  },
  {
    key: "active",
    label: "Usuarios Activos",
    icon: UserCheck,
    iconColor: "text-green-600",
    valueColor: "text-green-600",
    valueKey: "active",
    description: "Usuarios habilitados",
  },
  {
    key: "inactive",
    label: "Usuarios Inactivos",
    icon: UserX,
    iconColor: "text-red-600",
    valueColor: "text-red-600",
    valueKey: "inactive",
    description: "Usuarios deshabilitados",
  },
];
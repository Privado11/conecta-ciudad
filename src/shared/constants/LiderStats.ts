import { Users, UserCheck, UserX } from "lucide-react";
import type { StatCardProps } from "@/shared/interface/LiderStats";

export const LIDER_STATS: StatCardProps[] = [
  {
    label: "Total Lideres",
    icon: Users,
    color: "text-blue-500",
    valueKey: "total",
  },
  {
    label: "Activos",
    icon: UserCheck,
    color: "text-green-500",
    valueKey: "active",
  },
  {
    label: "Inactivos",
    icon: UserX,
    color: "text-red-500",
    valueKey: "inactive",
  },
];

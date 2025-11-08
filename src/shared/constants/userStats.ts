import { Users, UserCheck, UserX } from "lucide-react";

export const USER_STATS = [
  {
    label: "Total Usuarios",
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

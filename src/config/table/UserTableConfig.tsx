import { ROLE_BADGE_CONFIG } from "@/shared/constants/user/userRoles";
import type { DynamicTableConfig } from "@/shared/types/dynamicTableTypes";
import type { User } from "@/shared/types/userTYpes";

import { Edit, Shield, UserX, UserCheck, Trash2 } from "lucide-react";

interface UserTableActions {
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onToggleStatus: (userId: number) => void;
  onDelete: (user: User) => void;
}

export const createUserTableConfig = (
  actions: UserTableActions
): DynamicTableConfig<User> => ({
  rowKey: "id",
  emptyMessage: "No se encontraron usuarios.",
  loadingMessage: "Cargando usuarios...",
  loadingFilterMessage: "Actualizando usuarios...",

  columns: [
    {
      key: "name",
      label: "Nombre Completo",
      type: "text",
      sortable: true,
      className: "font-medium",
    },
    {
      key: "nationalId",
      label: "Documento",
      type: "text",
      sortable: true,
    },
    {
      key: "email",
      label: "Correo",
      type: "text",
      sortable: true,
    },
    {
      key: "phone",
      label: "Teléfono",
      type: "text",
      sortable: true,
    },
    {
      key: "roles",
      label: "Rol",
      type: "badge",
      badgeConfig: (user) => {
        const role = user.roles?.[0] || "CIUDADANO";
        return ROLE_BADGE_CONFIG[role];
      },
    },
    {
      key: "active",
      label: "Estado",
      type: "badge",
      sortable: true,
      badgeConfig: (user) => ({
        label: user.active ? "Activo" : "Inactivo",
        variant: user.active ? "default" : "destructive",
      }),
    },
    {
      key: "lastActionAt",
      label: "Última Actividad",
      type: "date",
      sortable: true,
      format: (value, _user) => {
        if (!value) return "Sin actividad";
        return new Date(value).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
      className: "text-sm text-muted-foreground",
    },
  ],

  actions: [
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4 mr-2" />,
      onClick: actions.onEdit,
      className:
        "transition-colors data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700 dark:data-[highlighted]:bg-blue-900/30 dark:data-[highlighted]:text-blue-400",
    },
    {
      label: "Cambiar rol",
      icon: <Shield className="w-4 h-4 mr-2" />,
      onClick: actions.onChangeRole,
      className:
        "transition-colors data-[highlighted]:bg-purple-100 data-[highlighted]:text-purple-700 dark:data-[highlighted]:bg-purple-900/30 dark:data-[highlighted]:text-purple-400",
    },
    {
      label: "Estado",
      icon: (user: User) =>
        user.active ? (
          <UserX className="w-4 h-4 mr-2" />
        ) : (
          <UserCheck className="w-4 h-4 mr-2" />
        ),
      onClick: (user) => actions.onToggleStatus(user.id),
      render: (user) => (user.active ? "Desactivar" : "Activar"),
      className:
        "transition-colors data-[highlighted]:bg-amber-100 data-[highlighted]:text-amber-700 dark:data-[highlighted]:bg-amber-900/30 dark:data-[highlighted]:text-amber-400",
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      onClick: actions.onDelete,
      className:
        "text-destructive transition-colors data-[highlighted]:bg-red-100 data-[highlighted]:text-red-700 dark:data-[highlighted]:bg-red-900/30 dark:data-[highlighted]:text-red-400",
    },
  ],
});

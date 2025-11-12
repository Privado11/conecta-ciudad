import { Eye } from "lucide-react";
import type { DynamicTableConfig } from "@/shared/types/dynamicTableTypes";
import type { ActionDto } from "@/shared/types/auditTypes";
import { ENTITY_BADGE_CONFIG } from "@/shared/constants/audit/auditEntity";

interface AuditTableActions {
  onViewDetails: (action: ActionDto) => void;
}

export const createAuditTableConfig = (
  actions: AuditTableActions
): DynamicTableConfig<ActionDto> => ({
  rowKey: "id",
  emptyMessage: "No se encontraron acciones.",
  loadingMessage: "Cargando acciones...",
  loadingFilterMessage: "Actualizando acciones...",

  columns: [
    {
      key: "id",
      label: "ID",
      type: "text",
      sortable: true,
      format: (value) => `#${value}`,
      className: "font-mono text-sm",
    },
    {
      key: "actionType",
      label: "Tipo",
      type: "badge",
      sortable: true,
      badgeConfig: (action) => ({
        label: action.actionType,
        variant: "outline",
      }),
      className: "font-mono text-xs",
    },
    {
      key: "description",
      label: "Descripción",
      type: "text",
      className: "max-w-[15rem] truncate",
    },
    {
      key: "user",
      label: "Usuario",
      type: "custom",
      sortable: true,
      render: (action) => (
        <div>
          <p className="font-medium">{action.user.name}</p>
          <p className="text-xs text-muted-foreground">{action.user.email}</p>
        </div>
      ),
    },
    {
      key: "entityType",
      label: "Entidad",
      type: "badge",
      sortable: true,
      badgeConfig: (action) =>
        ENTITY_BADGE_CONFIG[action.entityType] || {
          label: action.entityType,
          variant: "outline",
        },
    },
    {
      key: "ipAddress",
      label: "IP",
      type: "text",
      format: (value) => value || "N/A",
      className: "font-mono text-xs text-muted-foreground",
    },
    {
      key: "location",
      label: "Ubicación",
      type: "text",
      sortable: true,
      accessor: (action) => action.access?.location,
      format: (value) => value || "No registra",
    },
    {
      key: "actionAt",
      label: "Fecha",
      type: "date",
      sortable: true,
      format: (date) => {
        return new Date(date).toLocaleString("es-ES", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
      className: "text-sm text-muted-foreground",
    },
  ],

  actions: [
    {
      label: "Ver detalles",
      icon: <Eye className="w-4 h-4 mr-1" />,
      onClick: actions.onViewDetails,
      variant: "ghost",
    },
  ],
});

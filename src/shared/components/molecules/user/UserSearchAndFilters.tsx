import { Download, Plus, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { UserRole, UserStatus } from "@/shared/types/userTYpes";
import {
  ROLE_FILTERS,
  STATUS_FILTERS,
} from "@/shared/constants/user/userFilters";
import { DynamicFilter } from "../DynamicFilter";
import type { UserFilters } from "@/shared/interface/Filters";

interface FilterHandlers {
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRole | "all") => void;
  onStatusChange: (value: UserStatus | "all") => void;
  onOpenModal: () => void;
  onExport: () => void;
  onImport: () => void;
}

interface UserSearchAndFiltersProps {
  filters: UserFilters;
  handlers: FilterHandlers;
}

export function UserSearchAndFilters({
  filters,
  handlers,
}: UserSearchAndFiltersProps) {
  const filterGroups = [
    {
      label: "Rol de usuario",
      filterKey: "role",
      options: ROLE_FILTERS,
      activeValue: filters.role,
      onChange: handlers.onRoleChange,
    },
    {
      label: "Estado",
      filterKey: "status",
      options: STATUS_FILTERS,
      activeValue: filters.status,
      onChange: handlers.onStatusChange,
    },
  ];

  const headerActions = (
    <>
      <Button
        variant="outline"
        onClick={handlers.onImport}
        title="Importar usuarios desde CSV"
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Importar CSV</span>
      </Button>

      <Button
        variant="outline"
        onClick={handlers.onExport}
        title="Exportar usuarios a CSV"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Exportar CSV</span>
      </Button>

      <Button
        onClick={handlers.onOpenModal}
        title="Crear nuevo usuario"
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo Usuario</span>
      </Button>
    </>
  );

  return (
    <DynamicFilter
      title="Filtros de búsqueda"
      titleIcon={Users}
      searchTerm={filters.searchTerm}
      onSearchChange={handlers.onSearchChange}
      searchPlaceholder="Buscar por nombre o correo..."
      filterGroups={filterGroups}
      headerActions={headerActions}
    />
  );
}

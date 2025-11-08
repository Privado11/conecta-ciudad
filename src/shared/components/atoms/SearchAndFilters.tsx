import { Search, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import type { UserRole, UserStatus } from "@/shared/types/userTYpes";
import { ROLE_FILTERS, STATUS_FILTERS } from "@/shared/constants/userFilters";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: UserRole | "all";
  onRoleChange: (value: UserRole | "all") => void;
  filterStatus: UserStatus | "all";
  onStatusChange: (value: UserStatus | "all") => void;
  onOpenModal?: () => void;
  onExport?: () => void;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  filterRole,
  onRoleChange,
  filterStatus,
  onStatusChange,
  onOpenModal,
  onExport,
}: SearchAndFiltersProps) {
  return (
    <Card className="mb-6 border-border shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Gestión de Usuarios
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="icon" onClick={onExport} className="cursor-pointer">
                <Download className="w-4 h-4" />
              </Button>
              <Button onClick={onOpenModal} className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {ROLE_FILTERS.map(({ label, value, icon: Icon }) => (
              <Button
                key={value}
                variant={filterRole === value ? "default" : "outline"}
                size="sm"
                onClick={() => onRoleChange(value as UserRole | "all")}
                className="gap-1 cursor-pointer"
              >
                {Icon && <Icon className="w-3 h-3" />}
                {label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(({ label, value, icon: Icon }) => (
              <Button
                key={value}
                variant={filterStatus === value ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(value as UserStatus | "all")}
                className="gap-1 cursor-pointer"
              >
                {Icon && <Icon className="w-3 h-3" />}
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

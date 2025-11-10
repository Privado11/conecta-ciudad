import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActionDto, EntityType } from "@/shared/types/auditTypes";

interface AuditTableProps {
  actions: ActionDto[];
  loading: boolean;
  entityBadgeConfig: Record<
    EntityType,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  >;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  sortBy: string;
  sortDirection: "asc" | "desc";
  onViewDetails: (action: ActionDto) => void;
  onSortChange: (field: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function AuditTable({
  actions,
  loading,
  entityBadgeConfig,
  pagination: { currentPage, totalPages, totalElements, pageSize },
  sortBy,
  sortDirection,
  onViewDetails,
  onSortChange,
  onPageChange,
  onPageSizeChange,
}: AuditTableProps) {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const SortableHeader = ({
    field,
    label,
  }: {
    field: string;
    label: string;
  }) => (
    <TableHead>
      <button
        onClick={() => onSortChange(field)}
        className="flex items-center hover:text-primary transition-colors font-medium"
        disabled={loading}
      >
        {label}
        {getSortIcon(field)}
      </button>
    </TableHead>
  );

  return (
    <div>
      {loading && actions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Cargando acciones...</p>
        </div>
      ) : actions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron acciones.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="id" label="ID" />
                <SortableHeader field="actionType" label="Tipo" />
                <TableHead>Descripción</TableHead>
                <SortableHeader field="user.name" label="Usuario" />
                <SortableHeader field="entityType" label="Entidad" />
                <TableHead>IP</TableHead>
                <SortableHeader field="actionAt" label="Fecha" />
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {actions.map((action) => {
                const entityBadge =
                  entityBadgeConfig[action.entityType] || {
                    label: action.entityType,
                    variant: "outline",
                  };

                return (
                  <TableRow key={action.id}>
                    <TableCell className="font-mono text-sm">#{action.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {action.actionType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {action.description}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{action.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entityBadge.variant}>
                        {entityBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {action.ipAddress || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(action.actionAt).toLocaleString("es-ES", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(action)}
                        className="cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {currentPage * pageSize + 1} -{" "}
                {Math.min(
                  (currentPage + 1) * pageSize,
                  totalElements
                )}{" "}
                de {totalElements} acciones
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mostrar:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">por página</span>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 0 || loading}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                </Button>
                <div className="text-sm font-medium">
                  Página {currentPage + 1} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1 || loading}
                >
                  Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

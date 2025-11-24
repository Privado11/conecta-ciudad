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
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DynamicTableProps } from "@/shared/types/dynamicTableTypes";

export function DynamicTable<T = any>({
  config,
  data,
  loading = false,
  pagination,
  sortBy,
  sortDirection,
  onSortChange,
  onPageChange,
  onPageSizeChange,
}: DynamicTableProps<T>) {
  const getSortIcon = (field: string) => {
    if (!sortBy || sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const getRowKey = (row: T, index: number): string | number => {
    if (typeof config.rowKey === "function") {
      return config.rowKey(row);
    }
    return (row as any)[config.rowKey] ?? index;
  };

  const getCellValue = (row: T, column: any) => {
    if (column.accessor) {
      return column.accessor(row);
    }
    return (row as any)[column.key];
  };

  const renderCellContent = (row: T, column: any) => {
    const value = getCellValue(row, column);

    switch (column.type) {
      case "badge":
        if (column.badgeConfig) {
          const badgeData = column.badgeConfig(row);
          return <Badge variant={badgeData.variant}>{badgeData.label}</Badge>;
        }
        return <Badge>{value}</Badge>;

      case "date":
        if (column.format) {
          return column.format(value, row);
        }

        if (!value) return "Sin actividad";
        const date = new Date(value);
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

      case "custom":
        return column.render ? column.render(row) : value;

      case "text":
      case "number":
      default:
        return column.format ? column.format(value, row) : value ?? "N/A";
    }
  };

  const visibleActions = config.actions;

  const renderActions = (row: T) => {
    if (!visibleActions || visibleActions.length === 0) return null;
  
    const rowVisibleActions = visibleActions.filter((action) => {
      if (!action.hidden) return true;
      return !action.hidden(row);
    });
  
    if (rowVisibleActions.length === 0) return null;
  
    if (rowVisibleActions.length === 1) {
      const action = rowVisibleActions[0];
      const isDisabled = action.disabled ? action.disabled(row) : false;
      
      const actionLabel = typeof action.label === "function" 
        ? action.label(row) 
        : action.label;
  
      return (
        <Button
          variant={action.variant || "ghost"}
          size="sm"
          onClick={() => action.onClick(row)}
          disabled={isDisabled || loading}
          className={`cursor-pointer ${action.className || ""}`}
        >
          {typeof action.icon === "function" ? action.icon(row) : action.icon}
          {action.render ? action.render(row) : actionLabel}
        </Button>
      );
    }
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Button variant="ghost" size="icon" disabled={loading}>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {rowVisibleActions.map((action, index) => {
            const isDisabled = action.disabled ? action.disabled(row) : false;
            
            const actionLabel = typeof action.label === "function" 
              ? action.label(row) 
              : action.label;
  
            return (
              <DropdownMenuItem
                key={index}
                onClick={() => action.onClick(row)}
                disabled={isDisabled || loading}
                className={`cursor-pointer ${action.className || ""}`}
              >
                {typeof action.icon === "function"
                  ? action.icon(row)
                  : action.icon}
                {action.render ? action.render(row) : actionLabel}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>{config.loadingMessage || "Cargando datos..."}</p>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {config.emptyMessage || "No se encontraron datos."}
      </div>
    );
  }

  return (
    <div className="relative transition-opacity duration-200">
      {loading && data.length > 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] text-muted-foreground z-10 transition-opacity">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>{config.loadingFilterMessage || "Actualizando datos..."}</p>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {config.columns.map((column, index) => (
              <TableHead
                key={index}
                className={`${column.align ? `text-${column.align}` : ""} ${
                  column.headerClassName || ""
                }`}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.sortable && onSortChange ? (
                  <button
                    onClick={() => onSortChange(column.key)}
                    className="flex items-center hover:text-primary transition-colors font-medium"
                    disabled={loading}
                  >
                    {column.label}
                    {getSortIcon(column.key)}
                  </button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
            {visibleActions && visibleActions.length > 0 && (
              <TableHead className="text-right">
                {config.actionsLabel || "Acciones"}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={getRowKey(row, rowIndex)}>
              {config.columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={`${
                    column.align ? `text-${column.align}` : ""
                  } ${column.className || ""}`}
                >
                  {renderCellContent(row, column)}
                </TableCell>
              ))}
              {visibleActions && visibleActions.length > 0 && (
                <TableCell className="text-right">{renderActions(row)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && config.showPagination !== false && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {pagination.currentPage * pagination.pageSize + 1} -{" "}
              {Math.min(
                (pagination.currentPage + 1) * pagination.pageSize,
                pagination.totalElements
              )}{" "}
              de {pagination.totalElements}
            </div>

            {config.showPageSize !== false && onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mostrar:</span>
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value) => onPageSizeChange(Number(value))}
                  disabled={loading}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(pagination.pageSizeOptions || [5, 10, 20, 50]).map(
                      (size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  por página
                </span>
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && onPageChange && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0 || loading}
                className="cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
              <div className="text-sm font-medium">
                Página {pagination.currentPage + 1} de {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage >= pagination.totalPages - 1 || loading
                }
                className="cursor-pointer"
              >
                Siguiente <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
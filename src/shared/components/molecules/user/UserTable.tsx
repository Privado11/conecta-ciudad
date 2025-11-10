import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Edit,
  Shield,
  Trash2,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User, UserRole } from "@/shared/types/userTYpes";
import type { LoadingUserState } from "@/shared/types/loadingTypes";

interface UserTableProps {
  users: User[];
  loading: LoadingUserState;
  roleBadgeConfig: Record<
    UserRole,
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
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (field: string) => void;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onToggleStatus: (userId: number) => void;
  onDelete: (user: User) => void;
}

export function UserTable({
  users,
  loading,
  roleBadgeConfig,
  pagination,
  sortBy,
  sortDirection,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  const isAnyOperationLoading =
    loading.deleting ||
    loading.togglingActive ||
    loading.addingRole ||
    loading.removingRole;

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
        disabled={loading.fetching}
      >
        {label}
        {getSortIcon(field)}
      </button>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Usuarios</CardTitle>
            {loading.fetching && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando...
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading.fetching && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Cargando usuarios...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No se encontraron usuarios.
            </div>
          ) : (
            <>
              <div
                className={
                  isAnyOperationLoading ? "opacity-60 pointer-events-none" : ""
                }
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader field="name" label="Nombre Completo" />
                      <SortableHeader field="nationalId" label="Documento" />
                      <SortableHeader field="email" label="Correo" />
                      <SortableHeader field="phone" label="Teléfono" />
                      <TableHead>Rol</TableHead>
                      <SortableHeader field="active" label="Estado" />
                      <TableHead>Última Actividad</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {users.map((user) => {
                      const roleBadge =
                        roleBadgeConfig[user.roles?.[0] || "CIUDADANO"];
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.nationalId}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>
                            <Badge variant={roleBadge.variant}>
                              {roleBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.active ? "default" : "destructive"}
                            >
                              {user.active ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.lastActionAt
                              ? new Date(user.lastActionAt).toLocaleDateString(
                                  "es-ES",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "Sin actividad"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                className="cursor-pointer"
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isAnyOperationLoading}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => onEdit(user)}
                                  disabled={loading.updating}
                                  className="cursor-pointer transition-colors 
             data-highlighted:bg-blue-100 data-highlighted:text-blue-700 
             dark:data-highlighted:bg-blue-900/30 dark:data-highlighted:text-blue-400"
                                >
                                  <Edit className="w-4 h-4 mr-2" /> Editar
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => onChangeRole(user)}
                                  disabled={
                                    loading.addingRole || loading.removingRole
                                  }
                                  className="cursor-pointer transition-colors 
             data-highlighted:bg-purple-100 data-highlighted:text-purple-700 
             dark:data-highlighted:bg-purple-900/30 dark:data-highlighted:text-purple-400"
                                >
                                  <Shield className="w-4 h-4 mr-2" /> Cambiar
                                  rol
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => onToggleStatus(user.id)}
                                  disabled={loading.togglingActive}
                                  className="cursor-pointer transition-colors 
             data-highlighted:bg-amber-100 data-highlighted:text-amber-700 
             dark:data-highlighted:bg-amber-900/30 dark:data-highlighted:text-amber-400"
                                >
                                  {user.active ? (
                                    <>
                                      <UserX className="w-4 h-4 mr-2" />{" "}
                                      Desactivar
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="w-4 h-4 mr-2" />{" "}
                                      Activar
                                    </>
                                  )}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => onDelete(user)}
                                  disabled={loading.deleting}
                                  className="cursor-pointer text-destructive transition-colors 
             data-highlighted:bg-red-100 data-highlighted:text-red-700 
             dark:data-highlighted:bg-red-900/30 dark:data-highlighted:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {pagination.currentPage * pagination.pageSize + 1}{" "}
                    -{" "}
                    {Math.min(
                      (pagination.currentPage + 1) * pagination.pageSize,
                      pagination.totalElements
                    )}{" "}
                    de {pagination.totalElements} usuarios
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Mostrar:
                    </span>
                    <select
                      value={pagination.pageSize}
                      onChange={(e) => onPageSizeChange(Number(e.target.value))}
                      disabled={loading.fetching}
                      className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-muted-foreground">
                      por página
                    </span>
                  </div>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(pagination.currentPage - 1)}
                      disabled={
                        pagination.currentPage === 0 || loading.fetching
                      }
                      className="cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                    </Button>
                    <div className="text-sm font-medium">
                      Página {pagination.currentPage + 1} de{" "}
                      {pagination.totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(pagination.currentPage + 1)}
                      disabled={
                        pagination.currentPage >= pagination.totalPages - 1 ||
                        loading.fetching
                      }
                      className="cursor-pointer"
                    >
                      Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

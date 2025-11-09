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
    Eye,
    Trash2,
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

import type { LoadingState } from "@/shared/types/loadingTypes";
import type { IProject } from "@/shared/interface/Projects";

// Interfaz del proyecto
export interface Project {
    id: number;
    name: string;
    objectives: string;
    beneficiaryPopulations: string;
    budgets: string | number;
    startAt: string;
    endAt: string;
    status?: string;
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

// Props del componente
interface ProjectTableProps {
    projects: IProject[];
    loading: LoadingState;
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
    onEdit: (project: IProject) => void;
    onView: (project: IProject) => void;
    onDelete: (project: IProject) => void;
}

export function ProjectTable({
    projects,
    loading,
    pagination,
    sortBy,
    sortDirection,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onEdit,
    onView,
    onDelete,
}: ProjectTableProps) {
    const isAnyOperationLoading = loading.deleting || loading.updating;

    const getSortIcon = (field: string) => {
        if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
        return sortDirection === "asc" ? (
            <ArrowUp className="w-4 h-4 ml-1" />
        ) : (
            <ArrowDown className="w-4 h-4 ml-1" />
        );
    };

    const SortableHeader = ({ field, label }: { field: string; label: string }) => (
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
                        <CardTitle>Lista de Proyectos</CardTitle>
                        {loading.fetching && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cargando...
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    {loading.fetching && projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p>Cargando proyectos...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No se encontraron proyectos.
                        </div>
                    ) : (
                        <>
                            <div
                                className={isAnyOperationLoading ? "opacity-60 pointer-events-none" : ""}
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <SortableHeader field="name" label="Nombre" />
                                            <SortableHeader field="objectives" label="Objetivos" />
                                            <SortableHeader field="beneficiaryPopulations" label="Beneficiarios" />
                                            <SortableHeader field="budgets" label="Presupuesto" />
                                            <SortableHeader field="startAt" label="Inicio" />
                                            <SortableHeader field="endAt" label="Finalización" />
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Responsable</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {projects.map((project: IProject) => (
                                            <TableRow key={project.id}>
                                                <TableCell className="font-medium">{project.name}</TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {project.objectives}
                                                </TableCell>
                                                <TableCell>{project.beneficiaryPopulations}</TableCell>
                                                <TableCell>
                                                    {typeof project.budgets === "number"
                                                        ? `$${project.budgets?.toLocaleString("es-CO")}`
                                                        : project.budgets}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(project.startAt).toLocaleDateString("es-ES")}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(project.endAt).toLocaleDateString("es-ES")}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {project.status || "Pendiente"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {project.creator ? project.creator.name : "—"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild className="cursor-pointer">
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
                                                                onClick={() => onView(project)}
                                                                className="cursor-pointer transition-colors data-highlighted:bg-blue-100 dark:data-highlighted:bg-blue-900/30"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" /> Ver detalles
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() => onEdit(project)}
                                                                disabled={loading.updating}
                                                                className="cursor-pointer transition-colors data-highlighted:bg-green-100 dark:data-highlighted:bg-green-900/30"
                                                            >
                                                                <Edit className="w-4 h-4 mr-2" /> Editar
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() => onDelete(project)}
                                                                disabled={loading.deleting}
                                                                className="cursor-pointer text-destructive transition-colors data-highlighted:bg-red-100 dark:data-highlighted:bg-red-900/30"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando {pagination.currentPage * pagination.pageSize + 1} -{" "}
                                        {Math.min(
                                            (pagination.currentPage + 1) * pagination.pageSize,
                                            pagination.totalElements
                                        )}{" "}
                                        de {pagination.totalElements} proyectos
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Mostrar:</span>
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
                                        <span className="text-sm text-muted-foreground">por página</span>
                                    </div>
                                </div>

                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onPageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 0 || loading.fetching}
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
                                                pagination.currentPage >= pagination.totalPages - 1 ||
                                                loading.fetching
                                            }
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

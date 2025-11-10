import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectFormConfig } from "@/config/forms/projectForm.config";
import { userFormConfig } from "@/config/forms/userForm.config";
import useProject from "@/hooks/useProject";
import { Modal } from "@/shared/components/atoms/Modal";
import { SearchAndFilters } from "@/shared/components/atoms/SearchAndFilters";
import { StatCard } from "@/shared/components/atoms/StatCard";
import { DynamicFormModal } from "@/shared/components/molecules/DynamicFormModal";
import { ProjectTable } from "@/shared/components/molecules/ProjectTable";
import { LIDER_STATS, PROJECT_STATUS_FILTERS } from "@/shared/constants/LiderStats";
import { Plus, Projector, Search } from "lucide-react";

export default function Projects() {
    const {
        projects,
        openModalCreate,
        setOpenModalCreate,
        openModalDelete,
        setOpenModalDelete,
        selectProject,
        setSelectProject,
        loading,
        onSubmitCreate,
        filter,
        setFilter,
        search,
        setSearch,
        stats,
        handlePageChange,
        handlePageSizeChange,
        handleSortChange,
        currentPage,
        pageSize,
        sortBy,
        sortDirection,
        totalFiltered,
        projectsFilter
    } = useProject();
    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Projector className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
                </div>
                <p className="text-muted-foreground">
                    Administra los proyectos de la plataforma
                </p>
            </header>

            {/* Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {LIDER_STATS.map(({ label, icon: Icon, color, valueKey }) => (
                    <StatCard
                        key={label}
                        label={label}
                        value={
                            valueKey === "total"
                                ? stats.total
                                : stats[valueKey as keyof typeof stats]
                        }
                        icon={<Icon className="w-8 h-8" />}
                        iconColor={color}
                        valueColor={
                            valueKey === "enRevision"
                                ? "text-green-600"
                                : valueKey === "devuelto"
                                    ? "text-red-600"
                                    : valueKey === "publicado"
                                        ? "text-yellow-600"
                                        : valueKey === "pendiente"
                                            ? "text-blue-600"
                                            : valueKey === "listoParaPublicar"
                                                ? "text-purple-600"
                                                : ""
                        }
                    />
                ))}
            </section>

            {/* Search and filters */}
            <section>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <CardTitle>Gestión de Proyectos</CardTitle>
                            <Button
                                onClick={() => setOpenModalCreate(true)}
                                title="Crear nuevo proyecto"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Nuevo Proyecto</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <main className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o ID..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); }}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {PROJECT_STATUS_FILTERS.map(({ label, value, icon: Icon }) => (
                                    <Button
                                        key={value}
                                        variant={filter === value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setFilter(value)}
                                        className="gap-1 cursor-pointer"
                                    >
                                        {Icon && <Icon className="w-3 h-3" />}
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </main>
                    </CardContent>
                </Card>
            </section>

            {/** Table of the projects */}
            <section>
                <ProjectTable
                    projects={projectsFilter ? projectsFilter : projects}
                    loading={{ addingRole: false, creating: false, deleting: false, fetching: false, removingRole: false, togglingActive: false, updating: false }}
                    onEdit={(project) => {
                        setSelectProject(project);
                        setOpenModalCreate(true);
                    }}
                    onView={(project) => { }}
                    pagination={{
                        currentPage: currentPage,
                        pageSize: pageSize,
                        totalElements: totalFiltered,
                        totalPages: Math.ceil(totalFiltered / pageSize),
                    }}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onDelete={(project) => {
                        setSelectProject(project);
                        setOpenModalDelete(true);
                    }}
                    onPageSizeChange={handlePageSizeChange}
                    onPageChange={handlePageChange}
                    onSortChange={handleSortChange}
                />
            </section>

            <DynamicFormModal
                isOpen={openModalCreate}
                onClose={() => {
                    setOpenModalCreate(false);
                    setSelectProject(null);
                }}
                config={projectFormConfig}
                onValidate={async (data) => {
                    return { available: true, message: "" }
                }}
                onSubmit={onSubmitCreate}
                loading={loading}
            />

            {/**Modal eliminar proyecto */}
            <Modal
                isOpen={openModalDelete}
                onClose={() => { setOpenModalDelete(false) }}
                title="Confirmar eliminación"
            >
                <p className="text-sm text-muted-foreground mb-6">
                    ¿Estás seguro de que deseas eliminar a{" "}
                    <strong>{selectProject?.name}</strong>? Esta acción no se puede
                    deshacer.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => { setOpenModalDelete(false) }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => { setOpenModalDelete(false) }}
                    >
                        Eliminar
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
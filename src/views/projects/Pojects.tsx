import { Button } from "@/components/ui/button";
import useProject from "@/hooks/useProject";
import { Modal } from "@/shared/components/atoms/Modal";
import { StatCard } from "@/shared/components/atoms/StatCard";
import { DynamicFormModal } from "@/shared/components/molecules/DynamicFormModal";
import { USER_STATS } from "@/shared/constants/userStats";

export default function Projects() {
    const {} = useProject();
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        {/*<Users className="w-6 h-6 text-primary" />*/}
                    </div>
                    <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
                </div>
                <p className="text-muted-foreground">
                    Administra los proyectos de la plataforma
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {USER_STATS.map(({ label, icon: Icon, color, valueKey }) => (
                    <StatCard
                        key={label}
                        label={label}
                        value={
                            valueKey === "total"
                                ? 110
                                : valueKey === "active"
                                    ? 100
                                    : 10
                        }
                        icon={<Icon className="w-8 h-8" />}
                        iconColor={color}
                        valueColor={
                            valueKey === "active"
                                ? "text-green-600"
                                : valueKey === "inactive"
                                    ? "text-red-600"
                                    : undefined
                        }
                    />
                ))}
            </div>
            {/*<SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterRole={filterRole}
                onRoleChange={handleRoleFilterChange}
                filterStatus={filterStatus}
                onStatusChange={handleStatusFilterChange}
                onOpenModal={() => setIsOpenModal(true)}
                onExport={handleExport}
                onImport={() => setIsImportModalOpen(true)}
            />*/}

            {/*<DynamicFormModal
                isOpen={isOpenModal}
                onClose={() => {
                    setIsOpenModal(false);
                    setSelectedUser(null);
                }}
                config={userFormConfig}
                initialData={selectedUser}
                onValidate={validateUniqueFields}
                onSubmit={handleSubmit}
                loading={loading.creating || loading.updating}
            />*/}

            <Modal
                isOpen={false}
                onClose={() => {}}
                title="Confirmar eliminación"
            >
                <p className="text-sm text-muted-foreground mb-6">
                    ¿Estás seguro de que deseas eliminar a{" "}
                    <strong>{""}</strong>? Esta acción no se puede
                    deshacer.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => {}}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {}}
                    >
                        Eliminar
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
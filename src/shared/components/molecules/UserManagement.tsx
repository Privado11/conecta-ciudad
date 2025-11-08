  import { useEffect, useState } from "react";
  import { Users } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { cn } from "@/lib/utils";
  import { StatCard } from "../atoms/StatCard";
  import { SearchAndFilters } from "../atoms/SearchAndFilters";
  import { UserTable } from "./UserTable";
  import { Modal } from "../atoms/Modal";
  import type { UserRole, UserStatus } from "@/shared/types/userTYpes";
  import { useUser } from "@/hooks/useUser";
  import {
    ROLE_BADGE_CONFIG,
    ROLE_DESCRIPTIONS,
  } from "@/shared/constants/userRoles";
  import { USER_STATS } from "@/shared/constants/userStats";
  import { DynamicFormModal } from "./DynamicFormModal";
  import { userFormConfig } from "@/config/forms/userForm.config";

  export default function UserManagement() {
    const {
      users,
      getUsers,
      selectedUser,
      loading,
      pagination,
      createUser,
      updateUser,
      deleteUser,
      addRole,
      toggleActive,
      setSelectedUser,
      validateUniqueFields,
    } = useUser();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
    const [filterStatus, setFilterStatus] = useState<UserStatus | "all">("all");
    const [modalType, setModalType] = useState<"edit" | "delete" | "role" | null>(
      null
    );
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        setCurrentPage(0);
      }, 500);

      return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
      loadUsers();
    }, [
      currentPage,
      pageSize,
      sortBy,
      sortDirection,
      debouncedSearchTerm,
      filterRole,
      filterStatus,
    ]);

    const loadUsers = () => {
      const filters: any = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      };

      if (debouncedSearchTerm.trim()) {
        filters.name = debouncedSearchTerm;
      }

      if (filterRole !== "all") {
        filters.role = filterRole;
      }

      if (filterStatus !== "all") {
        filters.active = filterStatus === "active";
      }

      getUsers(filters);
    };

    const filteredUsers = users.filter((user) => {
      const matchesRole =
        filterRole === "all" || user.roles?.includes(filterRole);

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && user.active) ||
        (filterStatus === "inactive" && !user.active);

      return matchesRole && matchesStatus;
    });

    const handleSubmit = async (data: any) => {
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
      } else {
        await createUser(data);
      }
      setIsOpenModal(false);
    };

    const toggleUserStatus = (userId: number) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      toggleActive(userId).then(() => {
        loadUsers();
      });
    };

    const updateUserRole = (userId: number, newRole: UserRole) => {
      addRole(userId, newRole).then(() => {
        setModalType(null);
        loadUsers();
      });
    };

    const handleDelete = (userId: number) => {
      deleteUser(userId).then(() => {
        setModalType(null);
        if (users.length === 1 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        } else {
          loadUsers();
        }
      });
    };

    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize: number) => {
      setPageSize(newSize);
      setCurrentPage(0);
    };

    const handleSortChange = (field: string) => {
      if (sortBy === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortDirection("asc");
      }
    };

    const handleSearchChange = (value: string) => {
      setSearchTerm(value);
    };

    const handleRoleFilterChange = (role: UserRole | "all") => {
      setFilterRole(role);
      setCurrentPage(0);
    };

    const handleStatusFilterChange = (status: UserStatus | "all") => {
      setFilterStatus(status);
      setCurrentPage(0);
    };

    const activeCount = users.filter((u) => u.active).length;
    const inactiveCount = users.filter((u) => !u.active).length;

    const getActiveFiltersMessage = () => {
      const filters = [];
      if (debouncedSearchTerm) filters.push(`búsqueda: "${debouncedSearchTerm}"`);
      if (filterRole !== "all") filters.push(`rol: ${filterRole}`);
      if (filterStatus !== "all") {
        filters.push(
          `estado: ${filterStatus === "active" ? "activos" : "inactivos"}`
        );
      }
      return filters.length > 0 ? filters.join(", ") : null;
    };

    const activeFiltersMessage = getActiveFiltersMessage();

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          </div>
          <p className="text-muted-foreground">
            Administra los usuarios, roles y permisos de la plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {USER_STATS.map(({ label, icon: Icon, color, valueKey }) => (
            <StatCard
              key={label}
              label={label}
              value={
                valueKey === "total"
                  ? pagination.totalElements
                  : valueKey === "active"
                  ? activeCount
                  : inactiveCount
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
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterRole={filterRole}
          onRoleChange={handleRoleFilterChange}
          filterStatus={filterStatus}
          onStatusChange={handleStatusFilterChange}
          onOpenModal={() => setIsOpenModal(true)}
        />

        {activeFiltersMessage && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Filtros activos:</span>{" "}
              {activeFiltersMessage}
              {" · "}
              <strong>{pagination.totalElements}</strong> resultado(s)
              encontrado(s)
            </p>
          </div>
        )}

        <UserTable
          users={filteredUsers}
          loading={loading}
          roleBadgeConfig={ROLE_BADGE_CONFIG}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            totalElements: pagination.totalElements,
            pageSize: pagination.pageSize,
          }}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSortChange={handleSortChange}
          onEdit={(user) => {
            setSelectedUser(user);
            setModalType("edit");
          }}
          onChangeRole={(user) => {
            setSelectedUser(user);
            setModalType("role");
          }}
          onToggleStatus={toggleUserStatus}
          onDelete={(user) => {
            setSelectedUser(user);
            setModalType("delete");
          }}
        />

        <DynamicFormModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          config={userFormConfig}
          initialData={selectedUser}
          onValidate={validateUniqueFields}
          onSubmit={handleSubmit}
          loading={loading.creating || loading.updating}
        />

        <Modal
          isOpen={modalType === "delete"}
          onClose={() => setModalType(null)}
          title="Confirmar eliminación"
        >
          <p className="text-sm text-muted-foreground mb-6">
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong>{selectedUser?.name}</strong>? Esta acción no se puede
            deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setModalType(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleDelete(selectedUser.id)}
            >
              Eliminar
            </Button>
          </div>
        </Modal>

        <Modal
          isOpen={modalType === "role"}
          onClose={() => setModalType(null)}
          title="Cambiar rol de usuario"
        >
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Selecciona el nuevo rol para <strong>{selectedUser?.name}</strong>
            </p>
            <div className="space-y-2">
              {(Object.keys(ROLE_BADGE_CONFIG) as UserRole[]).map((role) => {
                const badge = ROLE_BADGE_CONFIG[role];
                return (
                  <button
                    key={role}
                    onClick={() =>
                      selectedUser && updateUserRole(selectedUser.id, role)
                    }
                    className={cn(
                      "w-full p-3 border rounded-lg text-left hover:bg-accent transition-colors",
                      selectedUser?.roles?.includes(role) &&
                        "border-primary bg-primary/5"
                    )}
                  >
                    <div className="font-medium mb-1">{badge.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {ROLE_DESCRIPTIONS[role]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setModalType(null)}>
              Cancelar
            </Button>
          </div>
        </Modal>
      </div>
    );
  }

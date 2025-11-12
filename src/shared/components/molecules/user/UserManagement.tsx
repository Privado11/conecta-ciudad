import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { DeleteUserModal } from "./DeleteUserModal";
import { ChangeRoleModal } from "./ChangeRoleModal";
import type { UserRole, UserStatus } from "@/shared/types/userTYpes";
import { useUser } from "@/hooks/useUser";
import { USER_STATS } from "@/shared/constants/user/userStats";
import { DynamicFormModal } from "../DynamicFormModal";
import { userFormConfig } from "@/config/forms/userForm.config";
import ImportUsersModal from "./ImportUsersModal";
import { createUserTableConfig } from "@/config/table/UserTableConfig";
import { DynamicTable } from "../DynamicTable";
import { UserSearchAndFilters } from "./UserSearchAndFilters";
import { StatsGrid } from "../StatsGrid";
import { useManagement } from "@/hooks/useManagement";
import type { UserFilters } from "@/shared/interface/Filters";
import { ROLE_BADGE_CONFIG } from "@/shared/constants/user/userRoles";
import { STATUS_FILTERS } from "@/shared/constants/user/userFilters";

export default function UserManagement() {
  const {
    users,
    getUsers,
    selectedUser,
    loading,
    pagination,
    statistics,
    createUser,
    updateUser,
    deleteUser,
    addRole,
    toggleActive,
    setSelectedUser,
    validateUniqueFields,
    exportUsers,
    exportAllUsers,
    importUsers,
  } = useUser();

  const {
    filters,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    debouncedSearchTerm,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
  } = useManagement<UserFilters>({
    initialFilters: {
      searchTerm: "",
      role: "all",
      status: "all",
    },
    defaultSort: { sortBy: "name", sortDirection: "asc" },
    searchField: "searchTerm",
  });

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "delete" | "role" | null>(
    null
  );
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    debouncedSearchTerm,
    filters.role,
    filters.status,
  ]);

  const loadUsers = () => {
    const apiFilters: any = {
      page: currentPage,
      size: pageSize,
      sortBy,
      sortDirection,
    };

    if (debouncedSearchTerm.trim()) {
      apiFilters.name = debouncedSearchTerm;
    }

    if (filters.role !== "all") {
      apiFilters.role = filters.role;
    }

    if (filters.status !== "all") {
      apiFilters.active = filters.status === "active";
    }

    getUsers(apiFilters);
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole =
      filters.role === "all" || user.roles?.includes(filters.role);
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && user.active) ||
      (filters.status === "inactive" && !user.active);
    return matchesRole && matchesStatus;
  });

  const handleSubmit = async (data: any) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
      } else {
        await createUser(data);
      }
      setIsOpenModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      console.error("Error al guardar usuario:", error);
      throw error;
    }
  };

  const toggleUserStatus = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    toggleActive(userId).then(() => {
      loadUsers();
    });
  };

  const updateUserRole = (newRole: UserRole) => {
    if (!selectedUser) return;
    addRole(selectedUser.id, newRole).then(() => {
      setModalType(null);
      setSelectedUser(null);
      loadUsers();
    });
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    deleteUser(selectedUser.id).then(() => {
      setModalType(null);
      setSelectedUser(null);
      if (users.length === 1 && currentPage > 0) {
        handlePageChange(currentPage - 1);
      } else {
        loadUsers();
      }
    });
  };

  const handleExport = () => {
    const exportFilters: any = {};

    if (debouncedSearchTerm.trim()) {
      exportFilters.name = debouncedSearchTerm;
    }

    if (filters.role !== "all") {
      exportFilters.role = filters.role;
    }

    if (filters.status !== "all") {
      exportFilters.active = filters.status === "active";
    }

    if (Object.keys(exportFilters).length > 0) {
      exportUsers(exportFilters);
    } else {
      exportAllUsers();
    }
  };

  const filterHandlers = {
    onSearchChange: (value: string) => handleFilterChange("searchTerm", value),
    onRoleChange: (role: UserRole | "all") => handleFilterChange("role", role),
    onStatusChange: (status: UserStatus | "all") =>
      handleFilterChange("status", status),
    onOpenModal: () => setIsOpenModal(true),
    onExport: handleExport,
    onImport: () => setIsImportModalOpen(true),
  };

  const getActiveFiltersMessage = () => {
    const filterMessages: string[] = [];
    if (debouncedSearchTerm) {
      filterMessages.push(`búsqueda: "${debouncedSearchTerm}"`);
    }

    if (filters.role !== "all") {
      const roleLabel =
        ROLE_BADGE_CONFIG[filters.role as keyof typeof ROLE_BADGE_CONFIG]
          ?.label || filters.role;
      filterMessages.push(`rol: ${roleLabel}`);
    }

    if (filters.status !== "all") {
      const matchedStatus = STATUS_FILTERS.find(
        (s) => s.value === filters.status
      );
      const statusLabel = matchedStatus ? matchedStatus.label : filters.status;
      filterMessages.push(`estado: ${statusLabel.toLowerCase()}`);
    }

    return filterMessages.length > 0 ? filterMessages.join(", ") : null;
  };

  const activeFiltersMessage = getActiveFiltersMessage();

  const userTableConfig = createUserTableConfig({
    onEdit: (user) => {
      setSelectedUser(user);
      setIsOpenModal(true);
    },
    onChangeRole: (user) => {
      setSelectedUser(user);
      setModalType("role");
    },
    onToggleStatus: toggleUserStatus,
    onDelete: (user) => {
      setSelectedUser(user);
      setModalType("delete");
    },
  });

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

      <div className="flex flex-col gap-4">
        <StatsGrid
          stats={USER_STATS}
          data={{
            totalElements: pagination.totalElements,
            metrics: statistics?.metrics,
          }}
          loading={loading.fetching && users.length === 0}
          columns={3}
        />

        <UserSearchAndFilters filters={filters} handlers={filterHandlers} />

        {activeFiltersMessage && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Filtros activos:</span>{" "}
              {activeFiltersMessage}
              {" · "}
              {loading.fetching ? (
                <span className="text-muted-foreground italic">
                  Cargando...
                </span>
              ) : (
                <>
                  <strong>{pagination.totalElements}</strong> resultado(s)
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <DynamicTable
        config={userTableConfig}
        data={filteredUsers}
        loading={loading.fetching}
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
      />

      <DynamicFormModal
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
      />

      <ImportUsersModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={importUsers}
      />

      <DeleteUserModal
        isOpen={modalType === "delete"}
        userName={selectedUser?.name}
        onClose={() => {
          setModalType(null);
          setSelectedUser(null);
        }}
        onConfirm={handleDelete}
        loading={loading.deleting}
      />

      <ChangeRoleModal
        isOpen={modalType === "role"}
        userName={selectedUser?.name}
        currentRoles={selectedUser?.roles}
        onClose={() => {
          setModalType(null);
          setSelectedUser(null);
        }}
        onConfirm={updateUserRole}
        loading={loading.addingRole || loading.removingRole}
      />
    </div>
  );
}

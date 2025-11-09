import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { StatCard } from "../atoms/StatCard";
import { SearchAndFilters } from "../atoms/SearchAndFilters";
import { UserTable } from "./UserTable";
import { DeleteUserModal } from "./DeleteUserModal";
import { ChangeRoleModal } from "./ChangeRoleModal";
import type { UserRole, UserStatus } from "@/shared/types/userTYpes";
import { useUser } from "@/hooks/useUser";
import { ROLE_BADGE_CONFIG } from "@/shared/constants/userRoles";
import { USER_STATS } from "@/shared/constants/userStats";
import { DynamicFormModal } from "./DynamicFormModal";
import { userFormConfig } from "@/config/forms/userForm.config";
import ImportUsersModal from "./ImportUsersModal";

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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    console.log("pagination", pagination, statistics);
  }, [pagination, statistics]);

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

  const handleExport = () => {
    const filters: any = {};

    if (debouncedSearchTerm.trim()) {
      filters.name = debouncedSearchTerm;
    }

    if (filterRole !== "all") {
      filters.role = filterRole;
    }

    if (filterStatus !== "all") {
      filters.active = filterStatus === "active";
    }

    if (Object.keys(filters).length > 0) {
      exportUsers(filters);
    } else {
      exportAllUsers();
    }
  };

  const activeCount = statistics?.active || 0;
  const inactiveCount = statistics?.inactive || 0;

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
        onExport={handleExport}
        onImport={() => setIsImportModalOpen(true)}
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
          setIsOpenModal(true);
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
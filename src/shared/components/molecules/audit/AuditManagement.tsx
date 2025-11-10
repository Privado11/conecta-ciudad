import { useEffect, useState } from "react";
import { Shield, Users } from "lucide-react";
import { StatCard } from "../../atoms/StatCard";
import { SearchAndFilters } from "./SearchAndFilters";
import type { UserRole, UserStatus } from "@/shared/types/userTYpes";
import { useUser } from "@/hooks/useUser";
import { ROLE_BADGE_CONFIG } from "@/shared/constants/user/userRoles";
import { USER_STATS } from "@/shared/constants/user/userStats";
import { DynamicFormModal } from "../DynamicFormModal";
import { userFormConfig } from "@/config/forms/userForm.config";
import { useAudit } from "@/hooks/useAudit";
import type {
  ActionResult,
  ActionType,
  EntityType,
} from "@/shared/types/auditTypes";
import { AUDIT_STATS } from "@/shared/constants/audit/auditStats";
import { AuditTable } from "./AuditTable";
import { ENTITY_BADGE_CONFIG } from "@/shared/constants/audit/auditEntity";

export default function AuditManagement() {
  const {
    actions,
    selectedAction,
    loading,
    pagination,
    statistics,
    getAllActions,
    getActionsByUser,
    getActionsByEntity,
    getActionsByType,
    getActionsByResult,
    getActionsByDateRange,
    setSelectedAction,
  } = useAudit();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ActionType | "all">("all");
  const [filterResult, setFilterResult] = useState<ActionResult | "all">("all");
  const [filterEntity, setFilterEntity] = useState<EntityType | "all">("all");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [isOpenModal, setIsOpenModal] = useState(false);

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
    filterType,
    filterResult,
    filterEntity,
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

    if (filterType !== "all") {
      filters.actionType = filterType;
    }

    if (filterResult !== "all") {
      filters.result = filterResult;
    }

    getAllActions(filters);
  };

  const filteredActions = actions.filter((action) => {
    const matchesType =
      filterType === "all" || action.actionType === filterType;

    const matchesResult =
      filterResult === "all" || action.result === filterResult;

    const matchesEntity =
      filterEntity === "all" || action.entityType === filterEntity;

    return matchesType && matchesResult && matchesEntity;
  });

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

  const handleTypeFilterChange = (actionType: ActionType | "all") => {
    setFilterType(actionType);
    setCurrentPage(0);
  };

  const handleResultFilterChange = (actionResult: ActionResult | "all") => {
    setFilterResult(actionResult);
    setCurrentPage(0);
  };

  const handleEntityFilterChange = (entityType: EntityType | "all") => {
    setFilterEntity(entityType);
    setCurrentPage(0);
  };

  const getActiveFiltersMessage = () => {
    const filters = [];
    if (debouncedSearchTerm) filters.push(`búsqueda: "${debouncedSearchTerm}"`);
    if (filterType !== "all") filters.push(`tipo: ${filterType}`);
    if (filterResult !== "all") {
      filters.push(
        `estado: ${filterResult === "SUCCESS" ? "exitosos" : "fallidos"}`
      );
    }
    if (filterEntity !== "all") {
      filters.push(`entidad: ${filterEntity}`);
    }
    return filters.length > 0 ? filters.join(", ") : null;
  };

  const activeFiltersMessage = getActiveFiltersMessage();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Auditoría del Sistema</h1>
        </div>
        <p className="text-muted-foreground">
          Monitorea todas las acciones y eventos del sistema en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {AUDIT_STATS.map(({ label, icon: Icon, color, valueKey }) => {
          const metricValue =
            valueKey === "total"
              ? pagination.totalElements
              : (statistics?.metrics?.[valueKey] as number) || 0;

          return (
            <StatCard
              key={label}
              label={label}
              value={metricValue}
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
          );
        })}
      </div>
      
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterActionType={filterType}
        onActionTypeChange={handleTypeFilterChange}
        filterActionResult={filterResult}
        onActionResultChange={handleResultFilterChange}
        filterEntityType={filterEntity}
        onEntityTypeChange={handleEntityFilterChange}
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

      <AuditTable
        actions={filteredActions}
        loading={loading.fetching}
        entityBadgeConfig={ENTITY_BADGE_CONFIG}
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
        onViewDetails={(action) => {
          setSelectedAction(action);
          setIsOpenModal(true);
        }}
        
      />
    </div>
  );
}

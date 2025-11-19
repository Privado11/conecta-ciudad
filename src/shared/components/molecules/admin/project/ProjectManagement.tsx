import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { DynamicTable } from "../../DynamicTable";
import { StatsGrid } from "../../StatsGrid";
import { useManagement } from "@/hooks/useManagement";

import { createProjectTableConfig } from "@/config/table/ProjectTableConfig";

import type {
  ProjectFilters,
  TempDateFilters,
} from "@/shared/interface/Filters";

import { ConfirmModal } from "../../../atoms/ConfirmModal";
import type { ProjectStatus } from "@/shared/types/projectTypes";
import { PROJECT_STATUS_BADGE_CONFIG } from "@/shared/constants/project/projectStatus";
import { PROJECT_STATS } from "@/shared/constants/project/projectStats";
import { ProjectSearchAndFilters } from "./ProjectSerachAndFilters";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import { AssignCuratorModal } from "./AssignCuratorModal";
import { useUsersAdmin } from "@/hooks/admin/useUsersAdmin";
import { useProjectsAdmin } from "@/hooks/admin/useProjectsAdmin";

export default function ProjectManagement() {
  const {
    projects,
    selectedProject,
    loadingProjects,
    pagination,
    statisticsProjects,
    searchProjects,
    getStatistics,
    deleteProject,
    assignCurator,
    setSelectedProject,
  } = useProjectsAdmin();
  const {
    curatorsActive,
    currentCurator,
    getCuratorsWithStats,
    clearCurators,
    loading: userLoading,
  } = useUsersAdmin();
  const [tempDateFilters, setTempDateFilters] = useState<TempDateFilters>({
    dateType: "projectStart",
    startDate: undefined,
    endDate: undefined,
  });

  const [modalType, setModalType] = useState<
    null | "edit" | "assignCurator" | "delete" | "view"
  >(null);

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
    setFilters,
  } = useManagement<ProjectFilters>({
    initialFilters: {
      searchTerm: "",
      status: "all",
      projectStartFrom: undefined,
      projectStartTo: undefined,
      projectEndFrom: undefined,
      projectEndTo: undefined,
      votingStartFrom: undefined,
      votingStartTo: undefined,
      votingEndFrom: undefined,
      votingEndTo: undefined,
      createdFrom: undefined,
      createdTo: undefined,
    },
    defaultSort: { sortBy: "createdAt", sortDirection: "desc" },
    searchField: "searchTerm",
  });

  useEffect(() => {
    getStatistics();
  }, []);

  useEffect(() => {
    if (modalType === "assignCurator" && selectedProject?.id) {
      getCuratorsWithStats(selectedProject.id);
    }
  }, [modalType, selectedProject?.id]);

  useEffect(() => {
    loadProjects();
  }, [
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    debouncedSearchTerm,
    filters.status,
    filters.projectStartFrom,
    filters.projectStartTo,
    filters.projectEndFrom,
    filters.projectEndTo,
    filters.votingStartFrom,
    filters.votingStartTo,
    filters.votingEndFrom,
    filters.votingEndTo,
    filters.createdFrom,
    filters.createdTo,
  ]);

  const formatToISODateTime = (date?: string, endOfDay = false) => {
    if (!date) return undefined;

    const dateObj = new Date(`${date}T${endOfDay ? "23:59:59" : "00:00:00"}`);
    return dateObj.toISOString();
  };

  const loadProjects = () => {
    searchProjects({
      page: currentPage,
      size: pageSize,
      sortBy,
      sortDirection,
      searchTerm: debouncedSearchTerm.trim() || undefined,
      status: filters.status !== "all" ? filters.status : undefined,

      projectStartFrom: formatToISODateTime(filters.projectStartFrom),
      projectStartTo: formatToISODateTime(filters.projectStartTo, true),

      projectEndFrom: formatToISODateTime(filters.projectEndFrom),
      projectEndTo: formatToISODateTime(filters.projectEndTo, true),

      votingStartFrom: formatToISODateTime(filters.votingStartFrom),
      votingStartTo: formatToISODateTime(filters.votingStartTo, true),

      votingEndFrom: formatToISODateTime(filters.votingEndFrom),
      votingEndTo: formatToISODateTime(filters.votingEndTo, true),

      createdFrom: formatToISODateTime(filters.createdFrom),
      createdTo: formatToISODateTime(filters.createdTo, true),
    });
  };

  const filterHandlers = {
    onSearchChange: (value: string) => handleFilterChange("searchTerm", value),
    onStatusChange: (value: ProjectStatus | "all") =>
      handleFilterChange("status", value),

    onDateTypeChange: (value: string) =>
      setTempDateFilters((prev) => ({
        ...prev,
        dateType: value as any,
        startDate: undefined,
        endDate: undefined,
      })),

    onStartDateChange: (value: string | undefined) =>
      setTempDateFilters((prev) => ({ ...prev, startDate: value })),

    onEndDateChange: (value: string | undefined) =>
      setTempDateFilters((prev) => ({ ...prev, endDate: value })),

    onApplyDateFilter: () => {
      const { dateType, startDate, endDate } = tempDateFilters;

      setFilters((prev) => ({
        ...prev,
        projectStartFrom: undefined,
        projectStartTo: undefined,
        projectEndFrom: undefined,
        projectEndTo: undefined,
        votingStartFrom: undefined,
        votingStartTo: undefined,
        votingEndFrom: undefined,
        votingEndTo: undefined,
        createdFrom: undefined,
        createdTo: undefined,
        ...(dateType === "projectStart" && {
          projectStartFrom: startDate,
          projectStartTo: endDate,
        }),
        ...(dateType === "projectEnd" && {
          projectEndFrom: startDate,
          projectEndTo: endDate,
        }),
        ...(dateType === "votingStart" && {
          votingStartFrom: startDate,
          votingStartTo: endDate,
        }),
        ...(dateType === "votingEnd" && {
          votingEndFrom: startDate,
          votingEndTo: endDate,
        }),
        ...(dateType === "created" && {
          createdFrom: startDate,
          createdTo: endDate,
        }),
      }));
      handlePageChange(0);
    },

    onClearDateFilters: () => {
      setTempDateFilters({
        dateType: "projectStart",
        startDate: undefined,
        endDate: undefined,
      });
      setFilters((prev) => ({
        ...prev,
        projectStartFrom: undefined,
        projectStartTo: undefined,
        projectEndFrom: undefined,
        projectEndTo: undefined,
        votingStartFrom: undefined,
        votingStartTo: undefined,
        votingEndFrom: undefined,
        votingEndTo: undefined,
        createdFrom: undefined,
        createdTo: undefined,
      }));
      handlePageChange(0);
    },
  };

  const getActiveFiltersMessage = () => {
    const msgs: string[] = [];

    if (debouncedSearchTerm) msgs.push(`"${debouncedSearchTerm}"`);

    if (filters.status !== "all") {
      msgs.push(
        `estado: ${
          PROJECT_STATUS_BADGE_CONFIG[filters.status]?.label || filters.status
        }`
      );
    }

    if (filters.projectStartFrom && filters.projectStartTo)
      msgs.push(
        `inicio proyecto: ${filters.projectStartFrom} - ${filters.projectStartTo}`
      );

    if (filters.projectEndFrom && filters.projectEndTo)
      msgs.push(
        `fin proyecto: ${filters.projectEndFrom} - ${filters.projectEndTo}`
      );

    if (filters.votingStartFrom && filters.votingStartTo)
      msgs.push(
        `inicio votación: ${filters.votingStartFrom} - ${filters.votingStartTo}`
      );

    if (filters.votingEndFrom && filters.votingEndTo)
      msgs.push(
        `fin votación: ${filters.votingEndFrom} - ${filters.votingEndTo}`
      );

    if (filters.createdFrom && filters.createdTo)
      msgs.push(`creado: ${filters.createdFrom} - ${filters.createdTo}`);

    return msgs.length ? msgs.join(" · ") : null;
  };

  const activeFiltersMessage = getActiveFiltersMessage();

  const handleCloseAssignCurator = () => {
    setModalType(null);
    setSelectedProject(null);
    setTimeout(() => {
      clearCurators();
    }, 300);
  };

  const handleAssignCurator = async (curatorId: string) => {
    if (selectedProject) {
      await assignCurator(selectedProject.id, Number(curatorId));
      loadProjects();
      handleCloseAssignCurator();
    }
  };

  const projectTableConfig = createProjectTableConfig({
    onViewDetails: (p) => {
      setSelectedProject(p);
      setModalType("view");
    },
    onEdit: (p) => {
      setSelectedProject(p);
      setModalType("edit");
    },
    onDelete: (p) => {
      setSelectedProject(p);
      setModalType("delete");
    },
    onAssignCurator: (p) => {
      setSelectedProject(p);
      setModalType("assignCurator");
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
          </div>
          <p className="text-muted-foreground">
            Administra los proyectos, curadores y flujos de aprobación
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <StatsGrid
          stats={PROJECT_STATS}
          data={{
            totalElements: statisticsProjects?.total,
            metrics: statisticsProjects?.metrics,
          }}
          loading={loadingProjects.fetching && projects.length === 0}
          columns={4}
        />

        <ProjectSearchAndFilters
          filters={filters}
          tempDateFilters={tempDateFilters}
          handlers={filterHandlers}
        />
      </div>

      {activeFiltersMessage && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Filtros activos:</span>{" "}
            {activeFiltersMessage} ·{" "}
            {loadingProjects.fetching ? (
              <span className="italic">Cargando...</span>
            ) : (
              <>
                <strong>{pagination.totalElements}</strong> resultado(s)
              </>
            )}
          </p>
        </div>
      )}

      <DynamicTable
        config={projectTableConfig}
        data={projects}
        loading={loadingProjects.fetching}
        pagination={{
          currentPage,
          totalPages: pagination.totalPages,
          totalElements: pagination.totalElements,
          pageSize,
        }}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
      />

      <ConfirmModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() =>
          deleteProject(selectedProject!.id).then(() => {
            setSelectedProject(null);
            loadProjects();
          })
        }
      />

      <ProjectDetailsModal
        isOpen={modalType === "view"}
        onClose={() => setModalType(null)}
        project={selectedProject}
        onEdit={(p) => {
          setSelectedProject(p);
          setModalType("edit");
        }}
        onAssignCurator={(p) => {
          setSelectedProject(p);
          setModalType("assignCurator");
        }}
      />

      <AssignCuratorModal
        isOpen={modalType === "assignCurator"}
        onClose={handleCloseAssignCurator}
        project={selectedProject}
        currentCurator={currentCurator}
        curators={curatorsActive}
        onAssign={handleAssignCurator}
        loadingFetchingCurators={userLoading.fetchingCurators}
        loadingAssigningCurator={loadingProjects.assigningCurator}
      />
    </div>
  );
}

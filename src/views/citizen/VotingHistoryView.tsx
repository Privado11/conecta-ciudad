import { useEffect, useState } from "react";
import { History, Loader2 } from "lucide-react";
import { useVoting } from "@/hooks/useVoting";
import type {
  VotingProjectDto,
} from "@/shared/types/votingTypes";
import { VotingProjectCard } from "@/shared/components/atoms/admin/VotingProjectCard";
import { CitizenVotingStatsCard } from "@/shared/components/atoms/citizen/CitizenVotingStatsCard";

import { VotingDetailsModal } from "@/shared/components/molecules/admin/voting/VotingDetailsModal";
import { useManagement } from "@/hooks/useManagement";
import { VotingSearchAndFilters } from "@/shared/components/molecules/admin/voting/VotingSearchAndFilters";

type VotingStatusFilter = "all" | "open" | "closed" | "approved" | "rejected";

interface VotingFilters {
  searchTerm: string;
  status: VotingStatusFilter;
}
export default function VotingHistoryView() {
  const {
    votingHistory,
    citizenStats,
    loading,
    fetchVotingHistory,
    fetchCitizenVotingStats,
  } = useVoting();

  const [selectedProject, setSelectedProject] =
    useState<VotingProjectDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    fetchVotingHistory();
    fetchCitizenVotingStats();
  }, [fetchVotingHistory, fetchCitizenVotingStats]);

  const handleViewDetails = (project: VotingProjectDto) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

   const { filters, debouncedSearchTerm, handleFilterChange } =
      useManagement<VotingFilters>({
        initialFilters: {
          searchTerm: "",
          status: "all",
        },
        defaultSort: { sortBy: "createdAt", sortDirection: "desc" },
        searchField: "searchTerm",
      });
  
    const getFilteredProjects = (): VotingProjectDto[] => {
      let filtered = votingHistory;
  
      if (debouncedSearchTerm.trim()) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(searchLower)
        );
      }
  
      switch (filters.status) {
        case "open":
          return filtered.filter((p) => p.votingStatus === "OPEN");
        case "closed":
          return filtered.filter((p) => p.votingStatus === "CLOSED");
        case "approved":
          return filtered.filter((p) => p.finalResult === "APPROVED");
        case "rejected":
          return filtered.filter((p) => p.finalResult === "REJECTED");
        default:
          return filtered;
      }
    };

    const filteredProjects = getFilteredProjects();

    const filterHandlers = {
      onSearchChange: (value: string) =>
        handleFilterChange("searchTerm", value),
      onStatusChange: (value: VotingStatusFilter) =>
        handleFilterChange("status", value),
    };

    const getActiveFiltersMessage = () => {
      const msgs: string[] = [];

      if (debouncedSearchTerm) msgs.push(`"${debouncedSearchTerm}"`);

      if (filters.status !== "all") {
        const statusLabels: Record<VotingStatusFilter, string> = {
          all: "Todas",
          open: "Abiertas",
          closed: "Cerradas",
          approved: "Aprobadas",
          rejected: "Rechazadas",
        };
        msgs.push(`estado: ${statusLabels[filters.status]}`);
      }

      return msgs.length ? msgs.join(" · ") : null;
    };

    const activeFiltersMessage = getActiveFiltersMessage();


  if (loading.fetchingHistory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <History className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mi Historial de Votaciones
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredProjects.length} proyecto
            {filteredProjects.length !== 1 ? "s" : ""} votado
            {filteredProjects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <CitizenVotingStatsCard
        stats={citizenStats}
        loading={loading.fetchingCitizenStats}
      />

       <VotingSearchAndFilters
              searchTerm={filters.searchTerm}
              statusFilter={filters.status}
              handlers={filterHandlers}
            />
      
            {activeFiltersMessage && (
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Filtros activos:</span>{" "}
                  {activeFiltersMessage} ·{" "}
                  {loading.fetching ? (
                    <span className="italic">Cargando...</span>
                  ) : (
                    <>
                      <strong>{filteredProjects.length}</strong> resultado(s)
                    </>
                  )}
                </p>
              </div>
            )}

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
          <History className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">
            No se encontraron votaciones
          </h3>
          <p className="text-sm text-gray-600">
            {votingHistory.length === 0
              ? "Aún no has votado en ningún proyecto"
              : "Intenta ajustar los filtros de búsqueda"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <VotingProjectCard
              key={project.id}
              project={project}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {selectedProject && (
        <VotingDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={selectedProject}
        />
      )}
    </div>
  );
}

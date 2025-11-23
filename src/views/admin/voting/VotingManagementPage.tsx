import { useState } from "react";
import { Card } from "@/components/ui/card";
import { VotingProjectCard } from "@/shared/components/atoms/admin/VotingProjectCard";
import { VotingStatsCard } from "@/shared/components/atoms/admin/VotingStatsCard";
import { VotingDetailsModal } from "@/shared/components/molecules/admin/voting/VotingDetailsModal";
import { VotingSearchAndFilters } from "@/shared/components/molecules/admin/voting/VotingSearchAndFilters";
import { useVoting } from "@/hooks/useVoting";
import { useManagement } from "@/hooks/useManagement";
import type { VotingProjectDto } from "@/shared/types/votingTypes";
import { BarChart3, Loader2 } from "lucide-react";

type VotingStatusFilter = "all" | "open" | "closed" | "approved" | "rejected";

interface VotingFilters {
  searchTerm: string;
  status: VotingStatusFilter;
}

export default function VotingManagementPage() {
  const { projects, stats, loading } = useVoting();

  const [selectedProject, setSelectedProject] =
    useState<VotingProjectDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    let filtered = projects;

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

  const handleViewDetails = (project: VotingProjectDto) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const filteredProjects = getFilteredProjects();

  const filterHandlers = {
    onSearchChange: (value: string) => handleFilterChange("searchTerm", value),
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

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Gestión de Votaciones</h2>
          <p className="text-sm text-muted-foreground">
            Monitorea el estado de las votaciones de proyectos
          </p>
        </div>
      </div>

      <VotingStatsCard stats={stats} loading={loading.fetchingStats} />

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

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Proyectos en Votación</h3>

        {loading.fetching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">
              Cargando votaciones...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {debouncedSearchTerm || filters.status !== "all"
                ? "No se encontraron votaciones con los filtros aplicados"
                : "No hay votaciones disponibles"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <VotingProjectCard
                key={project.id}
                project={project}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </Card>

      <VotingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
      />
    </div>
  );
}

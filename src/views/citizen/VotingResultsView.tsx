import { useEffect, useState } from "react";
import { Trophy, Loader2 } from "lucide-react";
import { useVoting } from "@/hooks/useVoting";
import type {
  VotingProjectDto,
  VotingResultFilter,
} from "@/shared/types/votingTypes";
import { VotingResultCard } from "@/shared/components/atoms/citizen/VotingResultCard";
import { VotingResultsFilters } from "@/shared/components/molecules/citizen/VotingResultsFilters";
import { VotingDetailsModal } from "@/shared/components/molecules/admin/voting/VotingDetailsModal";

interface ResultsFilters {
  searchTerm: string;
  result: VotingResultFilter;
}

export default function VotingResultsView() {
  const { votingResults, loading, fetchClosedVotingResults } = useVoting();

  const [selectedProject, setSelectedProject] =
    useState<VotingProjectDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<ResultsFilters>({
    searchTerm: "",
    result: "all",
  });

  useEffect(() => {
    fetchClosedVotingResults();
  }, [fetchClosedVotingResults]);

  const handleViewDetails = (project: VotingProjectDto) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const filteredProjects = votingResults.filter((project) => {
    const search = filters.searchTerm.toLowerCase();
    const matchesSearch =
      search === "" ||
      project.name.toLowerCase().includes(search) ||
      project.description.toLowerCase().includes(search) ||
      project.objectives.toLowerCase().includes(search);

    const matchesResult =
      filters.result === "all" ||
      (filters.result === "approved" && project.finalResult === "APPROVED") ||
      (filters.result === "rejected" && project.finalResult === "REJECTED");

    return matchesSearch && matchesResult;
  });

  if (loading.fetchingResults) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Resultados de Votaciones
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredProjects.length} proyecto
            {filteredProjects.length !== 1 ? "s" : ""} con votación cerrada
          </p>
        </div>
      </div>

      <VotingResultsFilters
        searchTerm={filters.searchTerm}
        resultFilter={filters.result}
        handlers={{
          onSearchChange: (value) =>
            setFilters({ ...filters, searchTerm: value }),
          onResultChange: (value) => setFilters({ ...filters, result: value }),
        }}
      />

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
          <Trophy className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-sm text-gray-600">
            {votingResults.length === 0
              ? "No hay votaciones cerradas en este momento"
              : "Intenta ajustar los filtros de búsqueda"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <VotingResultCard
              key={project.id}
              project={project}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <VotingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Vote } from "lucide-react";
import { useProjectContext } from "@/hooks/useProjectContext";
import { useCitizenVoting } from "@/hooks/useCitizenVoting";
import type { ProjectVotingDto } from "@/shared/types/projectTypes";
import { ProjectCard } from "@/shared/components/atoms/citizen/ProjectCard";
import { ProjectDetailsModal } from "@/shared/components/molecules/citizen/ProjectDetailsModal";
import { VotingProjectsFilters } from "@/shared/components/molecules/citizen/VotingProjectsFilters";

interface VotingFilters {
  searchTerm: string;
  urgency: "all" | "CRITICAL" | "HIGH" | "NORMAL";
}

export default function VotingProjectsView() {
  const { votingProjects, loading, fetchOpenForVoting } = useProjectContext();
  const { voteOnProject, loading: votingLoading } = useCitizenVoting();

  const combinedLoading = {
    fetching: loading.fetching,
    voting: votingLoading.voting,
  };
  const [selectedProject, setSelectedProject] =
    useState<ProjectVotingDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<VotingFilters>({
    searchTerm: "",
    urgency: "all",
  });

  useEffect(() => {
    fetchOpenForVoting();
  }, []);

  const handleVote = async (projectId: number, decision: boolean) => {
    const success = await voteOnProject(projectId, decision);

    if (success && isModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handleViewDetails = (project: ProjectVotingDto) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const filteredProjects = votingProjects.filter((project) => {
    const search = filters.searchTerm.toLowerCase();
    const matchesSearch =
      search === "" ||
      project.name.toLowerCase().includes(search) ||
      project.objectives.toLowerCase().includes(search) ||
      project.beneficiaryPopulations.toLowerCase().includes(search);

    const matchesUrgency =
      filters.urgency === "all" ||
      project.votingInfo.urgencyLevel === filters.urgency;

    return matchesSearch && matchesUrgency;
  });

  if (loading.fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Proyectos Abiertos a Votación
        </h1>
        <p className="text-gray-600 mt-2">
          {filteredProjects.length} proyecto
          {filteredProjects.length !== 1 ? "s" : ""} disponible
          {filteredProjects.length !== 1 ? "s" : ""} para votar
        </p>
      </div>

      <VotingProjectsFilters
        filters={filters}
        handlers={{
          onSearchChange: (value) =>
            setFilters({ ...filters, searchTerm: value }),
          onUrgencyChange: (value) =>
            setFilters({ ...filters, urgency: value }),
        }}
      />

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
          <Vote className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">
            No se encontraron proyectos
          </h3>
          <p className="text-sm text-gray-600">
            {votingProjects.length === 0
              ? "No hay proyectos abiertos para votación en este momento"
              : "Intenta ajustar los filtros de búsqueda"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={handleViewDetails}
              onVote={handleVote}
              loading={combinedLoading.voting}
            />
          ))}
        </div>
      )}

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVote={handleVote}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Loader2, Calendar } from "lucide-react";
import { useProjectContext } from "@/hooks/useProjectContext";
import type { ProjectReadyDto } from "@/shared/types/projectTypes";
import { ReadyProjectCard } from "@/shared/components/atoms/citizen/ReadyProjectCard";
import { ReadyProjectDetailsModal } from "@/shared/components/molecules/citizen/ReadyProjectDetailsModal";
import { ReadyProjectsFilters } from "@/shared/components/molecules/citizen/ReadyProjectsFilters";

interface ReadyFilters {
  searchTerm: string;
}

export default function ReadyProjectsView() {
  const { readyProjects, loading, fetchReadyToPublishNotOpen } = useProjectContext();
  const [selectedProject, setSelectedProject] = useState<ProjectReadyDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<ReadyFilters>({
    searchTerm: ""
  });

  useEffect(() => {
    fetchReadyToPublishNotOpen();
  }, []);

  const handleViewDetails = (project: ProjectReadyDto) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const filteredProjects = readyProjects.filter((project) => {
    const search = filters.searchTerm.toLowerCase();
    const matchesSearch =
      search === "" ||
      project.name.toLowerCase().includes(search) ||
      project.objectives.toLowerCase().includes(search) ||
      project.beneficiaryPopulations.toLowerCase().includes(search);

    return matchesSearch;
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
          Proyectos Listos para Publicar
        </h1>
        <p className="text-gray-600 mt-2">
          {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? "s" : ""}{" "}
          pendiente{filteredProjects.length !== 1 ? "s" : ""} de apertura
        </p>
      </div>

      <ReadyProjectsFilters
        filters={filters}
        handlers={{
          onSearchChange: (value) =>
            setFilters({ ...filters, searchTerm: value })
        }}
      />

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
          <Calendar className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">
            No se encontraron proyectos
          </h3>
          <p className="text-sm text-gray-600">
            {readyProjects.length === 0
              ? "No hay proyectos pendientes de apertura de votación"
              : "Intenta ajustar los filtros de búsqueda"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ReadyProjectCard
              key={project.id}
              project={project}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <ReadyProjectDetailsModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
import { Eye } from "lucide-react";
import { StatsGrid } from "@/shared/components/molecules/StatsGrid";

import { CURATOR_STATS } from "@/shared/constants/curator/curatorStats";
import { useCurator } from "@/hooks/useCurator";
import { useEffect, useState } from "react";
import { ProjectCard } from "../../atoms/curator/ProjectCard";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import { ApproveModal } from "../../atoms/curator/ApproveModal";
import { ObservationsModal } from "../../atoms/curator/ObservationsModal";
import { ProjectCardSkeleton } from "../../atoms/curator/ProjectCardSkeleton";
import type { CuratorFilters } from "@/shared/interface/Filters";
import { CuratorSearchAndFilters } from "./CuratorSearchAndFilters";

export default function ProjectPendingReviewManagement() {
  const {
    pendingQueue,
    selectedReview,
    loading,
    getPendingReviewQueue,
    addObservations,
    approveProject,
    setSelectedReview,
  } = useCurator();
  const [modalType, setModalType] = useState<
    "details" | "observations" | "approve" | null
  >(null);
  const [filters, setFilters] = useState<CuratorFilters>({
    searchTerm: "",
    status: "all",
  });

  useEffect(() => {
    getPendingReviewQueue();
  }, []);

  const handleApprove = async (dates: {
    votingStartAt: string;
    votingEndAt: string;
  }) => {
    if (!selectedReview) return;

    const result = await approveProject(selectedReview.projectId, dates);

    if (result) {
      setModalType(null);
    }
  };

  const handleObservations = async (observations: string) => {
    if (!selectedReview) return;

    const result = await addObservations(
      selectedReview.projectId,
      observations
    );

    if (result) {
      setModalType(null);
    }
  };

  const filteredReviews = pendingQueue?.reviews?.filter((review) => {
    const search = filters.searchTerm.toLowerCase();

    const matchesSearch =
      search === "" ||
      review.projectName.toLowerCase().includes(search) ||
      (review.creatorName?.toLowerCase() || "").includes(search);

    const matchesStatus =
      filters.status === "all" || review.priorityLevel === filters.status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Cola de Revisión</h1>
          </div>
          <p className="text-muted-foreground">
            Gestiona y revisa proyectos comunitarios asignados
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <StatsGrid
          stats={CURATOR_STATS}
          data={{
            totalElements: pendingQueue?.statistics.total || 0,
            metrics: {
              total: pendingQueue?.statistics.total || 0,
              overdue: pendingQueue?.statistics.overdue || 0,
              dueSoon: pendingQueue?.statistics.dueSoon || 0,
              resubmissions: pendingQueue?.statistics.resubmissions || 0,
            },
          }}
          loading={loading.fetchingQueue}
          columns={4}
        />

        <CuratorSearchAndFilters
          filters={filters}
          handlers={{
            onSearchChange: (value) =>
              setFilters({ ...filters, searchTerm: value }),
            onStatusChange: (value) =>
              setFilters({ ...filters, status: value }),
          }}
        />

        {loading.fetchingQueue ? (
          <>
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </>
        ) : filteredReviews && filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ProjectCard
              key={review.projectId}
              project={review}
              onReview={() => {
                setSelectedReview(review);
                setModalType("details");
              }}
            />
          ))
        ) : (
          <p>No hay proyectos en la cola de revisión</p>
        )}
      </div>

      <ProjectDetailsModal
        project={selectedReview}
        isOpen={modalType === "details"}
        onClose={() => setModalType(null)}
        onOpenObservations={() => setModalType("observations")}
        onOpenApprove={() => setModalType("approve")}
      />

      <ApproveModal
        project={selectedReview}
        isOpen={modalType === "approve"}
        onClose={() => setModalType(null)}
        onApprove={handleApprove}
        loading={loading.approvingProject}
      />

      <ObservationsModal
        project={selectedReview}
        isOpen={modalType === "observations"}
        onClose={() => setModalType(null)}
        onSubmit={(_, notes) => handleObservations(notes)}
        loading={loading.addingObservations}
      />
    </div>
  );
}

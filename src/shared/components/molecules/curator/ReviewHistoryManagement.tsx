import { useEffect, useState } from "react";
import { History } from "lucide-react";

import { useManagement } from "@/hooks/useManagement";
import { useCurator } from "@/hooks/useCurator";
import { createReviewHistoryTableConfig } from "@/config/table/ReviewHistoryTableConfig";
import type {
  ReviewHistoryFilters,
  TempDateFilters,
} from "@/shared/interface/Filters";
import { REVIEW_HISTORY_STATS } from "@/shared/constants/curator/reviewHistoryStats";
import { ReviewHistorySearchAndFilters } from "./ReviewHistorySearchAndFilters";
import type { ReviewHistoryDto } from "@/shared/types/curatorTypes";
import { StatsGrid } from "../StatsGrid";
import { DynamicTable } from "../DynamicTable";
import { ReviewHistoryDetailsModal } from "./ReviewHistoryDetailsModal";

export default function ReviewHistoryManagement() {
  const { reviewHistory, loading, getReviewHistory } = useCurator();

  const [selectedReview, setSelectedReview] = useState<ReviewHistoryDto | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const [tempDateFilters, setTempDateFilters] = useState<TempDateFilters>({
    startDate: undefined,
    endDate: undefined,
  });

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
  } = useManagement<ReviewHistoryFilters>({
    initialFilters: {
      searchTerm: "",
      outcome: "all",
      status: "all",
      wasOverdue: undefined,
      isResubmission: undefined,
      reviewedFrom: undefined,
      reviewedTo: undefined,
    },
    defaultSort: { sortBy: "reviewedAt", sortDirection: "desc" },
    searchField: "searchTerm",
  });

  useEffect(() => {
    loadHistory();
  }, [
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    debouncedSearchTerm,
    filters.outcome,
    filters.status,
    filters.wasOverdue,
    filters.isResubmission,
    filters.reviewedFrom,
    filters.reviewedTo,
  ]);

  const formatToISODateTime = (date?: string, endOfDay = false) => {
    if (!date) return undefined;
    const dateObj = new Date(`${date}T${endOfDay ? "23:59:59" : "00:00:00"}`);
    return dateObj.toISOString();
  };

  const loadHistory = () => {
    getReviewHistory({
      searchTerm: debouncedSearchTerm.trim() || undefined,
      status: filters.status !== "all" ? (filters.status as any) : undefined,
      wasOverdue: filters.wasOverdue,
      isResubmission: filters.isResubmission,
      reviewedFrom: formatToISODateTime(filters.reviewedFrom),
      reviewedTo: formatToISODateTime(filters.reviewedTo, true),
      page: currentPage,
      size: pageSize,
      sortBy,
      sortDir: sortDirection,
    });
  };

  const filterHandlers = {
    onSearchChange: (value: string) => handleFilterChange("searchTerm", value),
    onOutcomeChange: (value: "all" | "APROBADO" | "DEVUELTO" | "RECHAZADO") =>
      handleFilterChange("outcome", value),

    onWasOverdueChange: (value: boolean | undefined) =>
      handleFilterChange("wasOverdue", value),
    onIsResubmissionChange: (value: boolean | undefined) =>
      handleFilterChange("isResubmission", value),

    onStartDateChange: (value: string | undefined) =>
      setTempDateFilters((prev) => ({ ...prev, startDate: value })),
    onEndDateChange: (value: string | undefined) =>
      setTempDateFilters((prev) => ({ ...prev, endDate: value })),

    onApplyDateFilter: () => {
      const { startDate, endDate } = tempDateFilters;
      setFilters((prev) => ({
        ...prev,
        reviewedFrom: startDate,
        reviewedTo: endDate,
      }));
      handlePageChange(0);
    },

    onClearDateFilters: () => {
      setTempDateFilters({
        startDate: undefined,
        endDate: undefined,
      });
      setFilters((prev) => ({
        ...prev,
        reviewedFrom: undefined,
        reviewedTo: undefined,
      }));
      handlePageChange(0);
    },
  };

  const getActiveFiltersMessage = () => {
    const msgs: string[] = [];

    if (debouncedSearchTerm) msgs.push(`"${debouncedSearchTerm}"`);
    if (filters.outcome !== "all") msgs.push(`resultado: ${filters.outcome}`);
    if (filters.status !== "all") msgs.push(`estado: ${filters.status}`);
    if (filters.wasOverdue !== undefined)
      msgs.push(`tarde: ${filters.wasOverdue ? "Sí" : "No"}`);
    if (filters.isResubmission !== undefined)
      msgs.push(`reenvío: ${filters.isResubmission ? "Sí" : "No"}`);
    if (filters.reviewedFrom && filters.reviewedTo)
      msgs.push(`revisado: ${filters.reviewedFrom} - ${filters.reviewedTo}`);

    return msgs.length ? msgs.join(" · ") : null;
  };

  const activeFiltersMessage = getActiveFiltersMessage();

  const reviewHistoryTableConfig = createReviewHistoryTableConfig({
    onViewDetails: (review) => {
      setSelectedReview(review);
      setModalOpen(true);
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <History className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Historial de Revisiones</h1>
          </div>
          <p className="text-muted-foreground">
            Consulta todas tus revisiones completadas y métricas de desempeño
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <StatsGrid
          stats={REVIEW_HISTORY_STATS}
          data={{
            totalElements: reviewHistory?.statistics.total || 0,
            metrics: reviewHistory?.statistics.metrics,
          }}
          loading={loading.fetchingHistory && !reviewHistory}
          columns={4}
        />

        <ReviewHistorySearchAndFilters
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
            {loading.fetchingHistory ? (
              <span className="italic">Cargando...</span>
            ) : (
              <>
                <strong>{reviewHistory?.page.totalElements || 0}</strong>{" "}
                resultado(s)
              </>
            )}
          </p>
        </div>
      )}

      <DynamicTable
        config={reviewHistoryTableConfig}
        data={reviewHistory?.page.content || []}
        loading={loading.fetchingHistory}
        pagination={{
          currentPage,
          totalPages: reviewHistory?.page.totalPages || 0,
          totalElements: reviewHistory?.page.totalElements || 0,
          pageSize,
        }}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
      />

      <ReviewHistoryDetailsModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedReview(null);
        }}
        review={selectedReview}
      />
    </div>
  );
}

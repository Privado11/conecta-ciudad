import api from "../api";
import type {
  PendingReviewDto,
  PendingReviewQueueDto,
  ReviewHistoryDto,
  ReviewHistoryFilters,
  PagedResponse,
} from "@/shared/types/curatorTypes";

class CuratorReviewService {
  async getPendingReviewQueue(): Promise<PendingReviewQueueDto> {
    return (await api.get("/api/v1/curator/reviews/pending-queue")).data;
  }

  async getPendingReviewDetails(projectId: number): Promise<PendingReviewDto> {
    return (await api.get(`/api/v1/curator/reviews/pending/${projectId}`)).data;
  }

  async getReviewHistory(
    filters: ReviewHistoryFilters = {}
  ): Promise<PagedResponse<ReviewHistoryDto>> {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters.status) params.append("status", filters.status);
    if (filters.outcome && filters.outcome !== "all")
      params.append("outcome", filters.outcome);
    if (filters.wasOverdue !== undefined)
      params.append("wasOverdue", String(filters.wasOverdue));
    if (filters.isResubmission !== undefined)
      params.append("isResubmission", String(filters.isResubmission));
    if (filters.reviewedFrom)
      params.append("reviewedFrom", filters.reviewedFrom);
    if (filters.reviewedTo) params.append("reviewedTo", filters.reviewedTo);

    params.append("page", String(filters.page ?? 0));
    params.append("size", String(filters.size ?? 10));
    params.append("sortBy", filters.sortBy ?? "reviewedAt");
    params.append("sortDir", filters.sortDir ?? "desc");

    return (
      await api.get(`/api/v1/curator/reviews/history?${params.toString()}`)
    ).data;
  }
}

export default new CuratorReviewService();

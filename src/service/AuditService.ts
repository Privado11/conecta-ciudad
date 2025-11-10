import api from "./api";
import type { ActionDto, ActionResult, EntityType, PagedAuditResponse } from "@/shared/types/auditTypes";


class AuditService {
  async getAllActions(filters?: {
    page?: number;
    size?: number;
  }): Promise<PagedAuditResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.size !== undefined) params.append("size", filters.size.toString());

    const query = params.toString();
    const response = await api.get(`/api/v1/audit${query ? `?${query}` : ""}`);
    return response.data;
  }

  async getActionsByUser(
    userId: number,
    filters?: {
      page?: number;
      size?: number;
    }
  ): Promise<PagedAuditResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.size !== undefined) params.append("size", filters.size.toString());

    const query = params.toString();
    const response = await api.get(
      `/api/v1/audit/user/${userId}${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async countActionsByUser(
    userId: number,
    filters?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{
    userId: number;
    count: number;
    startDate: string;
    endDate: string;
  }> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const query = params.toString();
    const response = await api.get(
      `/api/v1/audit/user/${userId}/count${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async getActionsByEntity(
    entityType: EntityType,
    entityId: number,
    filters?: {
      page?: number;
      size?: number;
    }
  ): Promise<PagedAuditResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.size !== undefined) params.append("size", filters.size.toString());

    const query = params.toString();
    const response = await api.get(
      `/api/v1/audit/entity/${entityType}/${entityId}${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async getActionsByType(
    actionType: string,
    filters?: {
      page?: number;
      size?: number;
    }
  ): Promise<PagedAuditResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.size !== undefined) params.append("size", filters.size.toString());

    const query = params.toString();
    const response = await api.get(
      `/api/v1/audit/type/${actionType}${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async getActionsByResult(
    result: ActionResult,
    filters?: {
      page?: number;
      size?: number;
    }
  ): Promise<PagedAuditResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.size !== undefined) params.append("size", filters.size.toString());

    const query = params.toString();
    const response = await api.get(
      `/api/v1/audit/result/${result}${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async getActionsByDateRange(
    startDate: string,
    endDate: string,
    filters?: {
      page?: number;
      size?: number;
    }
  ): Promise<PagedAuditResponse> {
    const params = new URLSearchParams();
    
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.size !== undefined) params.append("size", filters.size.toString());

    const response = await api.get(`/api/v1/audit/date-range?${params.toString()}`);
    return response.data;
  }

  async getStatisticsByType(
    startDate: string,
    endDate: string
  ): Promise<Record<string, number>> {
    const params = new URLSearchParams();
    params.append("startDate", startDate);
    params.append("endDate", endDate);

    const response = await api.get(
      `/api/v1/audit/statistics/by-type?${params.toString()}`
    );
    return response.data;
  }

  async getStatisticsByResult(
    startDate: string,
    endDate: string
  ): Promise<Record<ActionResult, number>> {
    const params = new URLSearchParams();
    params.append("startDate", startDate);
    params.append("endDate", endDate);

    const response = await api.get(
      `/api/v1/audit/statistics/by-result?${params.toString()}`
    );
    return response.data;
  }

  async getRecentActivity(limit?: number): Promise<{
    count: number;
    limit: number;
    timestamp: string;
    actions: ActionDto[];
  }> {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());

    const query = params.toString();
    const response = await api.get(
      `/api/v1/audit/recent${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async getRecentActivityByUser(
    userId: number,
    limit?: number
  ): Promise<{
    userId: number;
    count: number;
    limit: number;
    timestamp: string;
    actions: ActionDto[];
  }> {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());

    const query = params.toString();
    const response = await api.get(
      `/api/v1/audit/user/${userId}/recent${query ? `?${query}` : ""}`
    );
    return response.data;
  }
}

export default new AuditService();
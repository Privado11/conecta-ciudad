import type { PagedResponse } from "@/shared/interface/PaginatedResponse";
import api from "./api";
import type { ActionDto, ActionResult, EntityType } from "@/shared/types/auditTypes";


class AuditService {
  async getAllActions(filters?: {
    page?: number;
    size?: number;
  }): Promise<PagedResponse<ActionDto>> {
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
  ): Promise<PagedResponse<ActionDto>> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.size !== undefined) params.append("size", filters.size.toString());

    const query = params.toString();
    const response = await api.get(
      `/api/v1/audit/user/${userId}${query ? `?${query}` : ""}`
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
  ): Promise<PagedResponse<ActionDto>> {
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
  ): Promise<PagedResponse<ActionDto>> {
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
  ): Promise<PagedResponse<ActionDto>> {
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
  ): Promise<PagedResponse<ActionDto>> {
    const params = new URLSearchParams();
    
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.size !== undefined) params.append("size", filters.size.toString());

    const response = await api.get(`/api/v1/audit/date-range?${params.toString()}`);
    return response.data;
  }
}

export default new AuditService();
import type { PagedResponse } from "@/shared/interface/PaginatedResponse";
import api from "../api";
import type { ActionDetails, ActionDto, ActionResult, ActionType, EntityType } from "@/shared/types/auditTypes";

export interface SearchFilters {
  actionType?: ActionType;
  result?: ActionResult;
  entityType?: EntityType;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

class AuditService {
  private buildQueryParams(filters: SearchFilters): URLSearchParams {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const finalValue = key === "searchTerm" && typeof value === "string" 
          ? value.trim() 
          : value;
        
        if (finalValue !== "") {
          params.append(key, String(finalValue));
        }
      }
    });

    return params;
  }

  async searchActions(filters: SearchFilters): Promise<PagedResponse<ActionDto>> {
    const params = this.buildQueryParams(filters);
    const queryString = params.toString();
    
    const endpoint = queryString 
      ? `/api/v1/audit/search?${queryString}` 
      : `/api/v1/audit/search`;
    
    const response = await api.get(endpoint);
    return response.data;
  }

  async exportActions(filters: SearchFilters, format: "csv" | "excel" = "csv"): Promise<Blob> {
    const params = this.buildQueryParams(filters);
    params.append("format", format);
    
    const response = await api.get(`/api/v1/audit/export?${params.toString()}`, {
      responseType: "blob",
    });
    return response.data;
  }

  async getActionDetails(actionId: number): Promise<ActionDetails> {
    const response = await api.get(`/api/v1/audit/${actionId}/details`);
    return response.data;
  }
}

export default new AuditService();
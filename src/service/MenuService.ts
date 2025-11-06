import api from "@/service/api";
import type { MenuResponse } from "@/shared/types/menuTypes";


class MenuService {
  async getMenu(): Promise<MenuResponse> {
    const response = await api.get("/api/v1/menu");
    return response.data;
  }
}

export default new MenuService();

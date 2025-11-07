import api from "@/service/api";
import type { MenuResponse } from "@/shared/types/menuTypes";

class MenuService {
  async getMenu(): Promise<MenuResponse> {
    const response = await api.get("/api/v1/menu");
    localStorage.setItem("menu", JSON.stringify(response.data));
    return response.data;
  }

  getCurrentMenu(): MenuResponse | null {
    const menu = localStorage.getItem("menu");
    return menu ? JSON.parse(menu) : null;
  }

  clearMenu() {
    localStorage.removeItem("menu");
  }
}

export default new MenuService();

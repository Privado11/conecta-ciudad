import api from "./api";
import { isTokenExpired } from "@/utils/tokenUtils";

class AuthService {
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  }

  async register(data: { name: string; email: string; password: string, nationalId: string, phone: string}) {
    const response = await api.post("/auth/register", data);
    return response.data;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    
    if (isTokenExpired(token)) {
      this.logout();
      return false;   
    }

    return true;
  }
}

export default new AuthService();

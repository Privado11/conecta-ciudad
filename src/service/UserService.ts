import type { User } from "@/shared/types/userTYpes";
import api from "./api";

class UserService {
  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  }

  async updateUser(
    id: number,
    data: Partial<Omit<User, "id" | "roles">>
  ): Promise<User> {
    const response = await api.put(`/api/v1/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<string> {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  }

  async validateUniqueFields(params: {
    email?: string;
    nationalId?: string;
  }): Promise<{ available: boolean; message: string }> {
    const query = new URLSearchParams();

    if (params.email) query.append("email", params.email);
    if (params.nationalId) query.append("nationalId", params.nationalId);

    const response = await api.get(
      `/api/v1/users/validate?${query.toString()}`
    );
    return response.data;
  }

  async changePassword(
    id: number,
    data: {
      oldPassword: string;
      newPassword: string;
    }
  ): Promise<string> {
    const response = await api.patch(
      `/api/v1/users/${id}/change-password`,
      data
    );
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const userString = localStorage.getItem("user");
    if (!userString) {
      throw new Error("No user found in localStorage");
    }

    const user = JSON.parse(userString);
    const currentUser = await this.getUserById(user.id);

    return currentUser;
  }
}

export default new UserService();

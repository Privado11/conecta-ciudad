// src/service/api.ts
import { isTokenExpired } from "@/utils/tokenUtils";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL_DEV;

const createInterceptors = (instance: ReturnType<typeof axios.create>) => {
  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      const isAuthRoute =
        config.url?.includes("/auth/login") ||
        config.url?.includes("/auth/register");

      if (token && !isAuthRoute) {
        if (isTokenExpired(token)) {
          console.warn("Token expirado, redirigiendo al login...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Sesión expirada. Por favor, inicia sesión de nuevo.");
          window.location.href = "/auth/login";
          return Promise.reject(new axios.Cancel("Token expirado"));
        }

        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Si es un cancel token, no hacer nada
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      // Manejar errores de autenticación (401)
      if (error.response?.status === 401) {
        const msg = error.response?.data?.message?.toLowerCase() ?? "";
        if (msg.includes("token") || msg.includes("expired")) {
          console.warn("Token inválido o expirado, cerrando sesión...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Sesión expirada. Por favor, inicia sesión de nuevo.");
          window.location.href = "/auth/login";
        } else {
          console.warn("No autorizado para este recurso (401).");
        }
      }

      // Log del error para debug
      if (import.meta.env.DEV) {
        console.error("API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }

      // NO convertir a Error simple - dejar el error de Axios original
      // Esto permite que los stores accedan a error.response.data
      return Promise.reject(error);
    }
  );
};

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

createInterceptors(api);

export default api;

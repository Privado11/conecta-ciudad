import { handleApiError } from "@/utils/handleApiError";
import { isTokenExpired } from "@/utils/tokenUtils";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const isAuthRoute =
      config.url?.includes("/auth/login") || config.url?.includes("/auth/register");

      if (token && !isAuthRoute) {
        
        if (isTokenExpired(token)) {
          console.warn("Token expirado, redirigiendo al login...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(new axios.Cancel("Token expirado"));
        }
  
        config.headers.Authorization = `Bearer ${token}`;
      }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = handleApiError(error);

    
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message?.toLowerCase() ?? "";
      if (msg.includes("token") || msg.includes("expired")) {
        console.warn("Token inválido o expirado, cerrando sesión...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        console.warn("No autorizado para este recurso (401).");
      }
    }

  
    console.error("API Error:", message);

    
    return Promise.reject(new Error(message));
  }
);

export default api;

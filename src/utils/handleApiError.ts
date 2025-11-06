import axios from "axios";

export function handleApiError(error: any): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return data.message || "Solicitud inválida.";
        case 401:
          return data.message || "Sesión no válida. Inicia sesión de nuevo.";
        case 403:
          return "No tienes permisos para realizar esta acción.";
        case 404:
          return "Recurso no encontrado.";
        case 500:
          return "Error interno del servidor.";
        default:
          return data.message || `Error (${status}).`;
      }
    } else if (error.request) {
      return "El servidor no respondió. Verifica tu conexión.";
    } else {
      return "Error al preparar la solicitud.";
    }
  }

  return "Error desconocido.";
}

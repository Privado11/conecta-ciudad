import axios from "axios";

export function handleApiError(error: any): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400 && data?.validationErrors?.length) {
        const mensajes = data.validationErrors.map(
          (err: { field: string; message: string }) =>
            `${formatearCampo(err.field)}: ${err.message}`
        );
        return mensajes.join(" | ");
      }

    
      switch (status) {
        case 400:
          return data.message || "La solicitud no es válida.";
        case 401:
          return data.message || "Tu sesión no es válida. Inicia sesión nuevamente.";
        case 403:
          return "No tienes permisos para realizar esta acción.";
        case 404:
          return "El recurso solicitado no fue encontrado.";
        case 500:
          return "Ocurrió un error interno en el servidor.";
        default:
          return data.message || `Error (${status}).`;
      }
    } else if (error.request) {
      return "El servidor no respondió. Verifica tu conexión a internet.";
    } else {
      return "Ocurrió un error al preparar la solicitud.";
    }
  }

  return "Ocurrió un error desconocido.";
}


function formatearCampo(field: string): string {
  const campos: Record<string, string> = {
    name: "Nombre",
    email: "Correo electrónico",
    nationalId: "Documento de identidad",
    phone: "Teléfono",
    password: "Contraseña",
    role: "Rol",
  };
  return campos[field] || field;
}

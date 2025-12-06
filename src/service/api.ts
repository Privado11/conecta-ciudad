import { isTokenExpired } from "@/utils/tokenUtils";
import axios from "axios";
import { toast } from "sonner";
import i18n from "@/i18n";

const API_URL = import.meta.env.VITE_API_URL_DEV;

interface ValidationError {
  field: string;
  errorCode: string;
  parameters?: Record<string, any>;
}

interface ErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  errorCode?: string;
  parameters?: Record<string, any>;
  validationErrors?: ValidationError[];
  path?: string;
  message?: string;
}


const translateErrorCode = (
  errorCode: string,
  parameters: Record<string, any> = {},
  field?: string
): string => {
  const genericErrors = [
    "STRING_PATTERN_MISMATCH",
    "FIELD_INVALID",
    "FIELD_REQUIRED",
  ];

  if (field && genericErrors.includes(errorCode)) {
    const specificErrorCode = `${errorCode}_${field}`;
    const specificTranslation = i18n.t(
      `errors.${specificErrorCode}`,
      parameters
    );

    if (specificTranslation !== `errors.${specificErrorCode}`) {
      return specificTranslation as string;
    }
  }
  return i18n.t(`errors.${errorCode}`, parameters) as string;
};
const handleValidationErrors = (validationErrors: ValidationError[]): void => {
  if (validationErrors.length === 0) {
    toast.error("Error de validación en los datos enviados");
    return;
  }

  if (validationErrors.length === 1) {
    const err = validationErrors[0];
    const message = translateErrorCode(
      err.errorCode,
      err.parameters || {},
      err.field
    );
    const fieldName = i18n.t(`fields.${err.field}`) as string;

    toast.error(`${fieldName}: ${message}`, {
      duration: 5000,
    });
    return;
  }

  const errorList = validationErrors
    .map((err) => {
      const fieldName = i18n.t(`fields.${err.field}`) as string;
      const message = translateErrorCode(
        err.errorCode,
        err.parameters || {},
        err.field
      );
      return `• ${fieldName}: ${message}`;
    })
    .join("\n");

  toast.error("Errores de validación:", {
    description: errorList,
    duration: 6000,
  });
};

const handleStructuredError = (
  errorCode: string,
  parameters: Record<string, any> = {}
): void => {
  const message = translateErrorCode(errorCode, parameters);
  toast.error(message, {
    duration: 5000,
  });
};

const handleHttpStatusError = (status: number): void => {
  const statusMap: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "INVALID_CREDENTIALS",
    403: "ACCESS_DENIED",
    404: "NOT_FOUND",
    409: "CONFLICT",
    500: "INTERNAL_SERVER_ERROR",
  };

  const errorCode = statusMap[status] || "UNKNOWN_ERROR";
  const message = translateErrorCode(errorCode);
  toast.error(message);
};

const handleApiError = (error: any): void => {
  if (axios.isCancel(error)) {
    return;
  }

  const errorData: ErrorResponse | undefined = error.response?.data;

  if (
    errorData?.errorCode === "VALIDATION_FAILED" &&
    errorData.validationErrors &&
    errorData.validationErrors.length > 0
  ) {
    handleValidationErrors(errorData.validationErrors);
    return;
  }

  if (errorData?.errorCode && errorData.errorCode !== "VALIDATION_FAILED") {
    handleStructuredError(errorData.errorCode, errorData.parameters || {});
    return;
  }
  if (errorData?.message) {
    toast.error(errorData.message);
    return;
  }

  const status = errorData?.status || error.response?.status;
  if (status) {
    handleHttpStatusError(status);
    return;
  }

  toast.error(translateErrorCode("UNKNOWN_ERROR"));
};

const createInterceptors = (instance: ReturnType<typeof axios.create>) => {
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
    (error) => {
      handleApiError(error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        const msg = error.response?.data?.message?.toLowerCase() ?? "";
        if (msg.includes("token") || msg.includes("expired")) {
          console.warn("Token inválido o expirado, cerrando sesión...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Sesión expirada. Por favor, inicia sesión de nuevo.");
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }
      }

      handleApiError(error);


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

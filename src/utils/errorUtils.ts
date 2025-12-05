// src/utils/errorUtils.ts
import i18n from "@/i18n";
import type { AxiosError } from "axios";

interface ErrorResponse {
  errorCode?: string;
  parameters?: Record<string, any>;
  validationErrors?: Array<{
    field: string;
    errorCode: string;
    parameters?: Record<string, any>;
  }>;
  message?: string;
}

/**
 * Traduce un error del backend usando i18n
 * Úsalo en los stores de Zustand
 */
export const translateError = (
  error: AxiosError<ErrorResponse> | any
): string => {
  // 1. Intentar obtener errorCode estructurado
  const errorCode = error.response?.data?.errorCode;
  const parameters = error.response?.data?.parameters || {};

  if (errorCode) {
    // Traducir con parámetros
    return i18n.t(`errors.${errorCode}`, parameters) as string;
  }

  // 2. Si hay errores de validación, tomar el primero
  const validationErrors = error.response?.data?.validationErrors;
  if (validationErrors && validationErrors.length > 0) {
    const firstError = validationErrors[0];
    return i18n.t(
      `errors.${firstError.errorCode}`,
      firstError.parameters || {}
    ) as string;
  }

  // 3. Fallback a mensaje del servidor
  if (error.response?.data?.message) {
    return error.response.data.message as string;
  }

  // 4. Mapear por status HTTP
  const status = error.response?.status;
  const statusMap: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "INVALID_CREDENTIALS",
    403: "ACCESS_DENIED",
    404: "NOT_FOUND",
    409: "CONFLICT",
    500: "INTERNAL_SERVER_ERROR",
  };

  if (status && statusMap[status]) {
    return i18n.t(`errors.${statusMap[status]}`);
  }

  // 5. Error genérico
  return i18n.t("errors.UNKNOWN_ERROR");
};

/**
 * Obtiene todos los errores de validación traducidos
 */
export const getValidationErrors = (
  error: AxiosError<ErrorResponse> | any
): Record<string, string> => {
  const validationErrors = error.response?.data?.validationErrors;

  if (!validationErrors) {
    return {};
  }

  return validationErrors.reduce((acc: Record<string, string>, err: any) => {
    acc[err.field] = i18n.t(
      `errors.${err.errorCode}`,
      err.parameters || {}
    ) as string;
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Verifica si un error es de un código específico
 */
export const isErrorCode = (
  error: AxiosError<ErrorResponse> | any,
  code: string
): boolean => {
  return error.response?.data?.errorCode === code;
};

/**
 * Extrae los parámetros de un error
 */
export const getErrorParameters = (
  error: AxiosError<ErrorResponse> | any
): Record<string, any> => {
  return error.response?.data?.parameters || {};
};

/**
 * Obtiene el status HTTP del error
 */
export const getErrorStatus = (
  error: AxiosError<ErrorResponse> | any
): number | undefined => {
  return error.response?.status;
};

/**
 * Formatea un mensaje de éxito con parámetros
 */
export const formatSuccessMessage = (
  key: string,
  params?: Record<string, any>
): string => {
  return i18n.t(key, params);
};

// Exportar todo junto
export default {
  translateError,
  getValidationErrors,
  isErrorCode,
  getErrorParameters,
  getErrorStatus,
  formatSuccessMessage,
};

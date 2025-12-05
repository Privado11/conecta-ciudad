// src/utils/errorUtils.ts
import i18n from "@/i18n";
import type { AxiosError } from "axios";

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

/**
 * Traduce un error del backend usando i18n
 * Maneja tanto errores simples como errores de validación
 */
export function translateError(
  error: AxiosError<ErrorResponse> | Error | any
): string {
  if (import.meta.env.DEV) {
    console.log("🔍 translateError recibió:", {
      hasResponse: !!error.response,
      hasData: !!error.response?.data,
      errorCode: error.response?.data?.errorCode,
      message: error.message,
    });
  }

  // Si es un error de Axios
  if (error.response?.data) {
    const errorData = error.response.data;

    // 1. Si es un error de validación con múltiples campos
    if (
      errorData.errorCode === "VALIDATION_FAILED" &&
      errorData.validationErrors &&
      errorData.validationErrors.length > 0
    ) {
      // Retornar el primer error de validación traducido
      const firstError = errorData.validationErrors[0];
      const translatedError = i18n.t(
        `errors.${firstError.errorCode}`,
        firstError.parameters || {}
      );

      // Incluir el nombre del campo si es posible
      const fieldName = firstError.field;
      return `${fieldName}: ${translatedError}`;
    }

    // 2. Si hay un errorCode estructurado (no validación)
    if (errorData.errorCode && errorData.errorCode !== "VALIDATION_FAILED") {
      const parameters = errorData.parameters || {};
      return i18n.t(`errors.${errorData.errorCode}`, parameters) as string;
    }

    // 3. Fallback a mensaje del servidor
    if (errorData.message) {
      return errorData.message;
    }

    // 4. Mapear por status HTTP
    const status = errorData.status || error.response?.status;
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
  }

  // 5. Si es un error simple con mensaje
  if (error.message) {
    return error.message;
  }

  // 6. Error genérico
  return i18n.t("errors.UNKNOWN_ERROR");
}

/**
 * Obtiene todos los errores de validación traducidos
 * Útil para mostrar errores por campo en formularios
 */
export function getValidationErrors(
  error: AxiosError<ErrorResponse> | any
): Record<string, string> {
  const errorData = error.response?.data;
  const validationErrors = errorData?.validationErrors;

  if (!validationErrors || validationErrors.length === 0) {
    return {};
  }

  const result: Record<string, string> = {};

  validationErrors.forEach((err: ValidationError) => {
    const translatedMessage = i18n.t(
      `errors.${err.errorCode}`,
      err.parameters || {}
    ) as string;
    result[err.field] = translatedMessage;
  });

  return result;
}

/**
 * Obtiene todos los errores de validación como array
 * Útil para mostrar una lista de todos los errores
 */
export function getValidationErrorsList(
  error: AxiosError<ErrorResponse> | any
): Array<{ field: string; message: string }> {
  const errorData = error.response?.data;
  const validationErrors = errorData?.validationErrors;

  if (import.meta.env.DEV) {
    console.log("🔍 getValidationErrorsList:", {
      hasErrorData: !!errorData,
      hasValidationErrors: !!validationErrors,
      validationErrorsLength: validationErrors?.length,
      validationErrors,
    });
  }

  if (!validationErrors || validationErrors.length === 0) {
    return [];
  }

  const result = validationErrors.map((err: ValidationError) => {
    const message = i18n.t(
      `errors.${err.errorCode}`,
      err.parameters || {}
    ) as string;

    if (import.meta.env.DEV) {
      console.log(
        `  📝 Campo: ${err.field}, Código: ${err.errorCode}, Mensaje: ${message}`
      );
    }

    return {
      field: err.field,
      message,
    };
  });

  return result;
}

/**
 * Obtiene un mensaje amigable con todos los errores de validación
 */
export function getValidationErrorsMessage(
  error: AxiosError<ErrorResponse> | any
): string {
  const errors = getValidationErrorsList(error);

  if (errors.length === 0) {
    return translateError(error);
  }

  if (errors.length === 1) {
    return `${errors[0].field}: ${errors[0].message}`;
  }

  // Múltiples errores
  return `Se encontraron ${errors.length} errores:\n${errors
    .map((e) => `• ${e.field}: ${e.message}`)
    .join("\n")}`;
}

/**
 * Verifica si un error es de un código específico
 */
export function isErrorCode(
  error: AxiosError<ErrorResponse> | any,
  code: string
): boolean {
  const errorData = error.response?.data;
  return errorData?.errorCode === code;
}

/**
 * Verifica si un error es de tipo validación
 */
export function isValidationError(
  error: AxiosError<ErrorResponse> | any
): boolean {
  const result = isErrorCode(error, "VALIDATION_FAILED");

  if (import.meta.env.DEV) {
    console.log("🔍 isValidationError:", {
      result,
      errorCode: error.response?.data?.errorCode,
      hasValidationErrors: !!error.response?.data?.validationErrors,
    });
  }

  return result;
}

/**
 * Extrae los parámetros de un error
 */
export function getErrorParameters(
  error: AxiosError<ErrorResponse> | any
): Record<string, any> {
  const errorData = error.response?.data;
  return errorData?.parameters || {};
}

/**
 * Obtiene el status HTTP del error
 */
export function getErrorStatus(
  error: AxiosError<ErrorResponse> | any
): number | undefined {
  const errorData = error.response?.data;
  return errorData?.status || error.response?.status;
}

/**
 * Formatea un mensaje de éxito con parámetros
 */
export function formatSuccessMessage(
  key: string,
  params?: Record<string, any>
): string {
  return i18n.t(key, params) as string;
}

/**
 * Verifica si un campo específico tiene error de validación
 */
export function hasFieldError(
  error: AxiosError<ErrorResponse> | any,
  fieldName: string
): boolean {
  const errorData = error.response?.data;
  const validationErrors = errorData?.validationErrors;

  if (!validationErrors) {
    return false;
  }

  return validationErrors.some(
    (err: ValidationError) => err.field === fieldName
  );
}

/**
 * Obtiene el error de un campo específico
 */
export function getFieldError(
  error: AxiosError<ErrorResponse> | any,
  fieldName: string
): string | null {
  const errorData = error.response?.data;
  const validationErrors = errorData?.validationErrors;

  if (!validationErrors) {
    return null;
  }

  const fieldError = validationErrors.find(
    (err: ValidationError) => err.field === fieldName
  );

  if (!fieldError) {
    return null;
  }

  return i18n.t(
    `errors.${fieldError.errorCode}`,
    fieldError.parameters || {}
  ) as string;
}

// Export default para compatibilidad
export default {
  translateError,
  getValidationErrors,
  getValidationErrorsList,
  getValidationErrorsMessage,
  isErrorCode,
  isValidationError,
  getErrorParameters,
  getErrorStatus,
  formatSuccessMessage,
  hasFieldError,
  getFieldError,
};

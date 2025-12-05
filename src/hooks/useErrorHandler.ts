import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";

interface ErrorResponse {
  errorCode?: string;
  parameters?: Record<string, any>;
  validationErrors?: ValidationError[];
  message?: string;
}

interface ValidationError {
  field: string;
  errorCode: string;
  parameters?: Record<string, any>;
}

interface ProcessedError {
  type: "single" | "validation";
  code: string;
  message: string;
  parameters?: Record<string, any>;
  errors?: ProcessedValidationError[];
  status?: number;
}

interface ProcessedValidationError {
  field: string;
  code: string;
  message: string;
  parameters?: Record<string, any>;
}

export const useErrorHandler = () => {
  const { t } = useTranslation();

  const handleError = (
    error: AxiosError<ErrorResponse> | any
  ): ProcessedError => {
    console.group("Error Handler");
    console.log("Error completo:", error);
    console.log("Response:", error.response);
    console.groupEnd();

    if (error.response?.data?.errorCode) {
      const { errorCode, parameters = {} } = error.response.data;

      return {
        type: "single",
        code: errorCode,
        message: t(`errors.${errorCode}`, parameters) as string,
        parameters,
        status: error.response.status,
      };
    }

    if (error.response?.data?.validationErrors) {
      const validationErrors = error.response.data.validationErrors;

      return {
        type: "validation",
        code: "VALIDATION_FAILED",
        message: t("errors.VALIDATION_FAILED") as string,
        errors: validationErrors.map((err: ValidationError) => ({
          field: err.field,
          code: err.errorCode,
          message: t(`errors.${err.errorCode}`, err.parameters || {}) as string,
          parameters: err.parameters,
        })),
        status: error.response.status,
      };
    }

    const status = error.response?.status;
    const statusCodeMap: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "INVALID_CREDENTIALS",
      403: "ACCESS_DENIED",
      404: "NOT_FOUND",
      409: "CONFLICT",
      500: "INTERNAL_SERVER_ERROR",
    };

    const errorCode = statusCodeMap[status || 0] || "UNKNOWN_ERROR";

    return {
      type: "single",
      code: errorCode,
      message: t(`errors.${errorCode}`) as string,
      status,
    };
  };

  const getErrorMessage = (error: AxiosError<ErrorResponse> | any): string => {
    const result = handleError(error);
    return result.message;
  };

  const isErrorCode = (
    error: AxiosError<ErrorResponse> | any,
    errorCode: string
  ): boolean => {
    const result = handleError(error);
    return result.code === errorCode;
  };

  const getFieldErrors = (
    error: AxiosError<ErrorResponse> | any
  ): Record<string, string> => {
    const result = handleError(error);

    if (result.type !== "validation" || !result.errors) {
      return {};
    }

    return result.errors.reduce((acc, err) => {
      acc[err.field] = err.message;
      return acc;
    }, {} as Record<string, string>);
  };

  return {
    handleError,
    getErrorMessage,
    isErrorCode,
    getFieldErrors,
  };
};

export default useErrorHandler;

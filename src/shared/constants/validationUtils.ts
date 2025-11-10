import type {
  CustomValidation,
  ValidationRule,
} from "@/shared/types/dynamicFormTypes";

export const VALIDATION_PATTERNS: Record<ValidationRule, RegExp | null> = {
  alphanumeric: /^[a-zA-Z0-9]+$/,
  "letters-only": /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/,
  "letters-spaces": /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  "numbers-only": /^[0-9]+$/,
  "no-special-chars": /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/,
  "phone-co": /^3[0-9]{9}$/,
  "cedula-co": /^[0-9]{6,10}$/,
  custom: null,
};

export const VALIDATION_MESSAGES: Record<ValidationRule, string> = {
  alphanumeric: "Solo se permiten letras y números",
  "letters-only": "Solo se permiten letras",
  "letters-spaces": "Solo se permiten letras y espacios",
  "numbers-only": "Solo se permiten números",
  "no-special-chars": "No se permiten caracteres especiales",
  "phone-co": "Ingrese un número de celular válido (10 dígitos, inicia con 3)",
  "cedula-co": "Ingrese una cédula válida (6 a 10 dígitos)",
  custom: "Valor inválido",
};

export function validateCustomRule(
  value: any,
  validation: CustomValidation
): { isValid: boolean; message?: string } {
  if (!value || value === "") {
    return { isValid: true };
  }

  const stringValue = String(value).trim();

  if (validation.validator) {
    const isValid = validation.validator(stringValue);
    return {
      isValid,
      message: isValid
        ? undefined
        : validation.message || VALIDATION_MESSAGES.custom,
    };
  }

  if (validation.pattern) {
    const isValid = validation.pattern.test(stringValue);
    return {
      isValid,
      message: isValid
        ? undefined
        : validation.message || VALIDATION_MESSAGES.custom,
    };
  }

  const pattern = VALIDATION_PATTERNS[validation.rule];
  if (pattern) {
    const isValid = pattern.test(stringValue);
    return {
      isValid,
      message: isValid
        ? undefined
        : validation.message || VALIDATION_MESSAGES[validation.rule],
    };
  }

  return { isValid: true };
}

export function validateField(
  value: any,
  validations?: CustomValidation[]
): string | undefined {
  if (!validations || validations.length === 0) {
    return undefined;
  }

  for (const validation of validations) {
    const result = validateCustomRule(value, validation);
    if (!result.isValid) {
      return result.message;
    }
  }

  return undefined;
}

export const COMMON_VALIDATIONS = {
  name: [
    {
      rule: "letters-spaces" as ValidationRule,
      message: "El nombre solo puede contener letras y espacios",
    },
  ],
  phone: [
    {
      rule: "phone-co" as ValidationRule,
      message: "Ingrese un celular válido (ej: 3001234567)",
    },
  ],
  nationalId: [
    {
      rule: "cedula-co" as ValidationRule,
      message: "Ingrese una cédula válida (6 a 10 dígitos)",
    },
  ],
  alphanumeric: [
    {
      rule: "alphanumeric" as ValidationRule,
      message: "Solo se permiten letras y números sin espacios",
    },
  ],
  noSpecialChars: [
    {
      rule: "no-special-chars" as ValidationRule,
      message: "No se permiten caracteres especiales",
    },
  ],
};

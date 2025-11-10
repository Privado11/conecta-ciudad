import { z } from "zod";
import { USER_ROLES, ROLE_DESCRIPTIONS } from "@/shared/constants/userRoles";
import type { DynamicFormConfig } from "@/shared/types/dynamicFormTypes";
import { COMMON_VALIDATIONS } from "@/shared/constants/validationUtils";

const roleOptions = Object.entries(USER_ROLES).map(([key, label]) => ({
  value: key,
  label: label,
  description: ROLE_DESCRIPTIONS[key as keyof typeof ROLE_DESCRIPTIONS],
}));

export const userFormConfig: DynamicFormConfig = {
  title: "Usuario",
  description: "Gestión de usuarios del sistema",
  sections: [
    {
      title: "Información Personal",
      columns: 2,
      fields: [
        {
          name: "name",
          label: "Nombre completo",
          type: "text",
          placeholder: "Nombre completo",
          validation: z.string().min(1, "El nombre es requerido"),
          customValidations: COMMON_VALIDATIONS.name,
          maxLength: 100,
          cols: 2,
        },
        {
          name: "email",
          label: "Correo electrónico",
          type: "email",
          placeholder: "correo@ejemplo.com",
          validation: z.string().email("Correo electrónico inválido"),
          disabled: (formData) => !!formData?.id,
        },
        {
          name: "nationalId",
          label: "Cédula",
          type: "text",
          placeholder: "Número de cédula",
          validation: z.string().min(1, "La cédula es requerida"),
          customValidations: COMMON_VALIDATIONS.nationalId,
          maxLength: 10,
        },
        {
          name: "phone",
          label: "Teléfono",
          type: "tel",
          placeholder: "Número de teléfono",
          validation: z.string().min(1, "El teléfono es requerido"),
          customValidations: COMMON_VALIDATIONS.phone,
          maxLength: 15,
        },
      ],
    },
    {
      title: "Seguridad",
      description: "Configuración de acceso y contraseña",
      columns: 2,
      fields: [
        {
          name: "password",
          label: "Contraseña",
          type: "password",
          placeholder: "••••••",
          validation: z.union([
            z.string().min(6, "Mínimo 6 caracteres"),
            z.literal(""),
          ]),
          hidden: (formData) => !!formData?.id,
          minLength: 6,
          maxLength: 20,
        },
        {
          name: "confirmPassword",
          label: "Confirmar Contraseña",
          type: "password",
          placeholder: "••••••",
          hidden: (formData) => !!formData?.id,
          excludeFromSubmit: true,
          maxLength: 20,
        },
        {
          name: "active",
          label: "Usuario activo",
          type: "switch",
          description:
            "Si está desactivado, el usuario no podrá iniciar sesión",
          defaultValue: true,
          hidden: (formData) => !formData?.id,
          cols: 2,
        },
      ],
    },
    {
      title: "Roles y Permisos",
      fields: [
        {
          name: "roles",
          label: "Rol",
          type: "radio",
          options: roleOptions,
          validation: z.string().min(1, "Debe seleccionar un rol"),
          defaultValue: "CIUDADANO",
          cols: 2,
          transformOnSubmit: (value) => [value],
        },
      ],
    },
  ],
  schema: z
    .object({
      name: z.string().min(1, "El nombre es requerido"),
      email: z.string().email("Correo electrónico inválido"),
      password: z
        .union([z.string().min(6, "Mínimo 6 caracteres"), z.literal("")])
        .optional(),
      confirmPassword: z.string().optional(),
      nationalId: z.string().min(1, "La cédula es requerida"),
      phone: z.string().min(1, "El teléfono es requerido"),
      roles: z.string().min(1, "Debe seleccionar un rol"),
      active: z.boolean().default(true),
    })
    .refine(
      (data) => {
        if (data.password && data.password !== "") {
          return data.password === data.confirmPassword;
        }
        return true;
      },
      {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      }
    ),
  submitLabel: "Guardar Usuario",
  cancelLabel: "Cancelar",
  loadingLabel: "Guardando...",
};

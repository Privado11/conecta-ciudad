import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
  confirmPassword: z.string().optional(),
  nationalId: z.string().min(1, "La cédula es requerida"),
  phone: z.string().min(1, "El teléfono es requerido"),
  roles: z.array(z.string()).min(1, "Debe seleccionar al menos un rol"),
  active: z.boolean().default(true),
}).refine((data) => {
  if (data.password) return data.password === data.confirmPassword;
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userFormSchema>;

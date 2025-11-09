import { z } from "zod";
import type { DynamicFormConfig } from "@/shared/types/dynamicForm.types";

export const projectFormConfig: DynamicFormConfig = {
  title: "Proyecto",
  description: "Formulario para crear un nuevo proyecto comunitario",
  sections: [
    {
      title: "Información del Proyecto",
      columns: 2,
      fields: [
        {
          name: "name",
          label: "Nombre del proyecto",
          type: "text",
          placeholder: "Ej. Parque Comunal La Esperanza",
          validation: z.string().min(3, "El nombre es requerido"),
          cols: 2,
        },
        {
          name: "objectives",
          label: "Objetivos",
          type: "textarea",
          placeholder: "Describe los objetivos principales del proyecto",
          validation: z
            .string()
            .min(5, "Debe especificar los objetivos del proyecto"),
          cols: 2,
        },
        {
          name: "beneficiaryPopulations",
          label: "Poblaciones beneficiarias",
          type: "textarea",
          placeholder: "Ej. Niños, jóvenes y adultos mayores del barrio",
          validation: z
            .string()
            .min(3, "Debe indicar las poblaciones beneficiarias"),
          cols: 2,
        },
        {
          name: "budgets",
          label: "Presupuesto",
          type: "text",
          placeholder: "Ej. 150000000",
          validation: z
            .union([
              z
                .string()
                .regex(/^\d+$/, "El presupuesto debe ser un número válido")
                .transform((val) => Number(val)),
              z.number(),
            ])
            .refine(
              (val) => val > 0,
              "Debe indicar un presupuesto mayor que cero"
            ),
          cols: 2,
        },

        {
          name: "startAt",
          label: "Fecha de inicio",
          type: "date",
          placeholder: "Selecciona la fecha de inicio",
          validation: z.string().min(1, "La fecha de inicio es requerida"),
        },
        {
          name: "endAt",
          label: "Fecha de finalización",
          type: "date",
          placeholder: "Selecciona la fecha de finalización",
          validation: z
            .string()
            .min(1, "La fecha de finalización es requerida"),
        },
      ],
    },
  ],
  schema: z.object({
    name: z.string().min(3, "El nombre es requerido"),
    objectives: z.string().min(5, "Debe especificar los objetivos"),
    beneficiaryPopulations: z
      .string()
      .min(3, "Debe indicar las poblaciones beneficiarias"),
    budgets: z.string().min(1, "Debe indicar el presupuesto"),
    startAt: z.string().min(1, "La fecha de inicio es requerida"),
    endAt: z.string().min(1, "La fecha de finalización es requerida"),
  }),
  submitLabel: "Guardar Proyecto",
  cancelLabel: "Cancelar",
  loadingLabel: "Guardando...",
};

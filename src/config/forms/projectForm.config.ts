import { z } from "zod";
import type { DynamicFormConfig } from "@/shared/types/dynamicFormTypes";

export const projectFormConfig: DynamicFormConfig = {
  title: "Proyecto",
  description: "Crear o editar un proyecto ciudadano",
  sections: [
    {
      title: "Información General",
      columns: 2,
      fields: [
        {
          name: "name",
          label: "Nombre del proyecto",
          type: "text",
          placeholder: "Nombre del proyecto",
          validation: z.string().min(1, "El nombre es requerido"),
          maxLength: 200,
          cols: 2,
        },
        {
          name: "objectives",
          label: "Objetivos",
          type: "textarea",
          placeholder: "Describe los objetivos del proyecto",
          validation: z.string().min(1, "Los objetivos son requeridos"),
          maxLength: 1000,
          cols: 2,
        },
        {
          name: "beneficiaryPopulations",
          label: "Población beneficiada",
          type: "textarea",
          placeholder: "Indica quiénes serán beneficiados",
          validation: z.string().min(1, "Este campo es requerido"),
          maxLength: 500,
          cols: 2,
        },
      ],
    },

    {
      title: "Recursos y Cronograma",
      columns: 2,
      fields: [
        {
          name: "budget",
          label: "Presupuesto",
          type: "number",
          placeholder: "Valor total del presupuesto",
          validation: z.number().min(1, "El presupuesto es requerido"),
        },
        {
          name: "startAt",
          label: "Fecha de inicio",
          type: "date",
          validation: z.iso.date("Debe ser una fecha válida"),
        },
        {
          name: "endAt",
          label: "Fecha de finalización",
          type: "date",
          validation: z.iso.date("Debe ser una fecha válida"),
        },
      ],
    },
  ],

  schema: z
    .object({
      name: z.string().min(1, "El nombre es requerido"),
      objectives: z.string().min(1, "Los objetivos son requeridos"),
      beneficiaryPopulations: z.string().min(1, "Este campo es requerido"),
      budget: z.number().min(1, "El presupuesto es requerido"),
      startAt: z.iso.date(),
      endAt: z.iso.date(),
    })
    .refine((data) => new Date(data.endAt) > new Date(data.startAt), {
      message: "La fecha de finalización debe ser posterior a la de inicio",
      path: ["endAt"],
    }),

  submitLabel: "Guardar Proyecto",
  cancelLabel: "Cancelar",
  loadingLabel: "Guardando...",
};

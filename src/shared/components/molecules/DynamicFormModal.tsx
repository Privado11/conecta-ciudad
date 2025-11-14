import { DynamicForm } from "./DynamicForm";
import type { DynamicFormConfig } from "@/shared/types/dynamicFormTypes";
import { Modal } from "../atoms/Modal";
import {
  excludeFields,
  excludeSections,
} from "@/config/forms/filterFormConfig";

interface DynamicFormModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  config: DynamicFormConfig;
  initialData?: T | null;
  onValidate?: (data: T) => Promise<{ available: boolean; message: string }>;
  onSubmit: (data: T) => Promise<void>;
  loading?: boolean;
  isAdmin?: boolean;
}

export function DynamicFormModal<T = any>({
  isOpen,
  onClose,
  config,
  initialData,
  onValidate,
  onSubmit,
  loading = false,
  isAdmin = true,
}: DynamicFormModalProps<T>) {
  const isEditMode = !!initialData;
  const modalTitle = `${isEditMode ? "Editar" : "Nuevo"} ${config.title}`;

  const dynamicSubmitLabel = isEditMode
    ? `Actualizar ${config.title}`
    : `Guardar ${config.title}`;

  const baseFilteredConfig = isAdmin
    ? config
    : excludeFields(
        excludeSections(config, ["Roles y Permisos", "Seguridad"]),
        ["active", "roles", "password", "confirmPassword"]
      );

  const filteredConfig =
    !isAdmin && baseFilteredConfig.schema
      ? {
          ...baseFilteredConfig,
          schema: baseFilteredConfig.schema.pick({
            name: true,
            email: true,
            nationalId: true,
            phone: true,
          }),
        }
      : baseFilteredConfig;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      description={config.description}
      width="xl"
    >
      <div className="px-6">
        <DynamicForm
          config={{
            ...filteredConfig,
            submitLabel: dynamicSubmitLabel,
          }}
          initialData={initialData}
          onValidate={onValidate}
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </Modal>
  );
}

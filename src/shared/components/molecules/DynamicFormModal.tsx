import { DynamicForm } from "./DynamicForm";
import type { DynamicFormConfig } from "@/shared/types/dynamicForm.types";
import { Modal } from "../atoms/Modal";

interface DynamicFormModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  config: DynamicFormConfig;
  initialData?: T | null;
  onValidate?: (data: T) => Promise<{ available: boolean; message: string }>;
  onSubmit: (data: T) => Promise<void>;
  loading?: boolean;
}

export function DynamicFormModal<T = any>({
  isOpen,
  onClose,
  config,
  initialData,
  onValidate,
  onSubmit,
  loading = false,
}: DynamicFormModalProps<T>) {
  const isEditMode = !!initialData;
  const modalTitle = `${isEditMode ? "Editar" : "Nuevo"} ${config.title}`;

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
          config={config}
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

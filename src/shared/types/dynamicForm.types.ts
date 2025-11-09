import { z } from "zod";  

export type FieldType = 
  | "text" 
  | "email" 
  | "password" 
  | "number" 
  | "tel" 
  | "date"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "multi-checkbox"
  | "switch"
  | "file";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  validation?: z.ZodTypeAny;
  options?: Array<{ value: string; label: string; description?: string }>;
  disabled?: boolean | ((formData: any) => boolean);
  hidden?: boolean | ((formData: any) => boolean);
  cols?: 1 | 2;
  fields?: FieldConfig[];
  excludeFromSubmit?: boolean;
  transformOnSubmit?: (value: any) => any;
}

export interface FieldSection {
  title?: string;
  description?: string;
  fields: FieldConfig[];
  columns?: 1 | 2;
}

export interface DynamicFormConfig {
  title: string;
  description?: string;
  sections: FieldSection[];
  submitLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  schema?: z.ZodObject<any>;
}

export interface DynamicFormProps<T = Record<string, any>> {
  config: DynamicFormConfig;
  initialData?: T | null;
  onValidate?: (data: T) => Promise<{ available: boolean; message: string }>;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}
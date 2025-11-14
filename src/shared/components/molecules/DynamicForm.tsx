import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { DynamicFormProps } from "@/shared/types/dynamicFormTypes";
import { DynamicField } from "../organisms/DynamicField";
import { Loader2 } from "lucide-react";

export function DynamicForm<T = any>({
  config,
  initialData,
  onValidate,
  onSubmit,
  onCancel,
  loading = false,
  className = "",
}: DynamicFormProps<T>) {
  const [hasChanges, setHasChanges] = useState(false);
  const isEditMode = !!initialData;

  const getDefaultValues = () => {
    const defaults: Record<string, any> = {};

    config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaults[field.name] = field.defaultValue;
          return;
        }

        switch (field.type) {
          case "text":
          case "email":
          case "password":
          case "number":
          case "tel":
          case "date":
          case "textarea":
          case "select":
          case "radio":
          case "file":
            defaults[field.name] = "";
            break;
          case "checkbox":
          case "switch":
            defaults[field.name] = false;
            break;
          case "multi-checkbox":
            defaults[field.name] = [];
            break;
          default:
            defaults[field.name] = "";
        }
      });
    });

    return defaults;
  };

  const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

  const form = useForm({
    resolver: config.schema ? zodResolver(config.schema) : undefined,
    defaultValues: getDefaultValues(),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === "password" || name === "confirmPassword") {
        form.trigger("confirmPassword");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (initialData) {
      const flattenedData: Record<string, any> = { ...initialData };

      config.sections.forEach((section) => {
        section.fields.forEach((field) => {
          const fieldName = field.name;
          if (
            field.type === "radio" &&
            Array.isArray(flattenedData[fieldName])
          ) {
            flattenedData[fieldName] = flattenedData[fieldName][0];
          }
        });
      });

      form.reset(flattenedData);
    } else {
      form.reset(getDefaultValues());
    }
  }, [initialData]);

  const handleSubmit = async (data: any) => {
    try {
      if (!isEditMode && onValidate && (data.email || data.nationalId)) {
        const result = await onValidate({
          email: data.email,
          nationalId: data.nationalId,
        } as T);

        if (!result.available) {
          const message = result.message.toLowerCase();

          const emailError =
            message.includes("email") || message.includes("correo");
          const idError =
            message.includes("cédula") ||
            message.includes("cedula") ||
            message.includes("identificación") ||
            message.includes("identificacion");

          if (emailError) {
            form.setError("email", {
              message: "El correo ya está registrado",
            });
          }

          if (idError) {
            form.setError("nationalId", {
              message: "La cédula ya está registrada",
            });
          }

          if (!emailError && !idError) {
            form.setError("root", {
              message: result.message,
            });
          }

          return;
        }
      }

      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        const field = config.sections
          .flatMap((section) => section.fields)
          .find((f) => f.name === key);

        if (field?.excludeFromSubmit) return acc;

        if (field?.transformOnSubmit) {
          acc[key] = field.transformOnSubmit(value);
          return acc;
        }

        if (value !== "" && value !== undefined) {
          acc[key] = value;
        }

        return acc;
      }, {} as any);

      await onSubmit(cleanedData as T);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const formData = form.watch();

  useEffect(() => {
    if (!initialData) {
      setHasChanges(true);
      return;
    }

    const cleanedInitial: Record<string, any> = { ...initialData };

    config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (
          field.type === "radio" &&
          Array.isArray(cleanedInitial[field.name])
        ) {
          cleanedInitial[field.name] = cleanedInitial[field.name][0];
        }
      });
    });

    const changed = !isEqual(cleanedInitial, formData);
    setHasChanges(changed);
  }, [formData, initialData]);

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  console.log(hasErrors, loading, form.formState.isValid, hasChanges);
  const isSubmitDisabled =
    loading || hasErrors || !form.formState.isValid || !hasChanges;

  console.log("isSubmitDisabled", isSubmitDisabled);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={`space-y-6 ${className}`}
      >
        {config.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            {section.title && (
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                {section.description && (
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                )}
              </div>
            )}

            <div
              className={`grid gap-4 ${
                section.columns === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {section.fields.map((field, fieldIndex) => (
                <DynamicField
                  key={`${field.name}-${fieldIndex}`}
                  field={field}
                  control={form.control}
                  formData={formData}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="cursor-pointer"
            >
              {config.cancelLabel || "Cancelar"}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {config.loadingLabel || "Guardando..."}
              </>
            ) : (
              config.submitLabel || (isEditMode ? "Actualizar" : "Crear")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
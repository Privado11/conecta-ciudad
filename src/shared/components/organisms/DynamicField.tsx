import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import type { FieldConfig } from "@/shared/types/dynamicFormTypes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useState } from "react";
import { validateField } from "@/shared/constants/validationUtils";

interface DynamicFieldProps {
  field: FieldConfig;
  control: Control<any>;
  formData: any;
}

export function DynamicField({ field, control, formData }: DynamicFieldProps) {
  const [customError, setCustomError] = useState<string | undefined>();

  const isHidden =
    typeof field.hidden === "function" ? field.hidden(formData) : field.hidden;

  if (isHidden) return null;

  const isDisabled =
    typeof field.disabled === "function"
      ? field.disabled(formData)
      : field.disabled;

  const handleCustomValidation = (
    value: any,
    onChange: (...event: any[]) => void
  ) => {
    onChange(value);

    if (field.customValidations) {
      const error = validateField(value, field.customValidations);
      setCustomError(error);
    }
  };

  const renderFieldControl = (fieldProps: any) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "password":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            disabled={isDisabled}
            maxLength={field.maxLength}
            {...fieldProps}
            onChange={(e) =>
              handleCustomValidation(e.target.value, fieldProps.onChange)
            }
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            disabled={isDisabled}
            {...fieldProps}
            onChange={(e) => {
              const numValue = Number(e.target.value);
              handleCustomValidation(numValue, fieldProps.onChange);
            }}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            disabled={isDisabled}
            {...fieldProps}
            onChange={(e) =>
              handleCustomValidation(e.target.value, fieldProps.onChange)
            }
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            disabled={isDisabled}
            rows={4}
            maxLength={field.maxLength}
            {...fieldProps}
            onChange={(e) =>
              handleCustomValidation(e.target.value, fieldProps.onChange)
            }
          />
        );

      case "select":
        return (
          <Select
            onValueChange={(value) =>
              handleCustomValidation(value, fieldProps.onChange)
            }
            defaultValue={fieldProps.value}
            disabled={isDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "switch":
        return (
          <Switch
            checked={fieldProps.value}
            onCheckedChange={fieldProps.onChange}
            disabled={isDisabled}
          />
        );

      case "checkbox":
        return (
          <Checkbox
            checked={fieldProps.value}
            onCheckedChange={fieldProps.onChange}
            disabled={isDisabled}
          />
        );

      case "multi-checkbox":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {field.options?.map((option) => (
              <FormItem
                key={option.value}
                className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border"
              >
                <FormControl>
                  <Checkbox
                    checked={fieldProps.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? fieldProps.onChange([
                            ...fieldProps.value,
                            option.value,
                          ])
                        : fieldProps.onChange(
                            fieldProps.value?.filter(
                              (value: string) => value !== option.value
                            ) ?? []
                          );
                    }}
                    disabled={isDisabled}
                  />
                </FormControl>
                <FormLabel className="font-normal flex-1 cursor-pointer">
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </FormLabel>
              </FormItem>
            ))}
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={fieldProps.value}
            onValueChange={fieldProps.onChange}
            disabled={isDisabled}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {field.options?.map((option) => {
              const isSelected = fieldProps.value === option.value;

              return (
                <label
                  key={option.value}
                  htmlFor={`radio-${field.name}-${option.value}`}
                  data-state={isSelected ? "checked" : "unchecked"}
                  className={`
                  relative flex flex-col items-start p-4 rounded-xl border transition
                  cursor-pointer select-none
                  hover:bg-accent/40 active:scale-[0.98]
                  ${
                    isSelected
                      ? "border-primary bg-accent/60"
                      : "border-border bg-background"
                  }
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <RadioGroupItem
                      id={`radio-${field.name}-${option.value}`}
                      value={option.value}
                    />

                    <span className="font-medium text-foreground">
                      {option.label}
                    </span>
                  </div>

                  {option.description && (
                    <p className="text-sm text-foreground/70 pl-7 mt-1">
                      {option.description}
                    </p>
                  )}
                </label>
              );
            })}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: fieldProps, fieldState }) => (
        <FormItem
          className={`relative ${field.cols === 2 ? "md:col-span-2" : ""}`}
        >
          {field.type !== "multi-checkbox" && (
            <FormLabel>{field.label}</FormLabel>
          )}
          <FormControl>{renderFieldControl(fieldProps)}</FormControl>

          {field.description && field.type !== "multi-checkbox" && (
            <FormDescription>{field.description}</FormDescription>
          )}

          <div className="min-h-3 mt-1">
            <FormMessage />
            {customError && !fieldState.error && (
              <p className="text-sm font-medium text-destructive">
                {customError}
              </p>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}

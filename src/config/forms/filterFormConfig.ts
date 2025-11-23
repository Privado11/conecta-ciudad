import type { DynamicFormConfig } from "@/shared/types/dynamicFormTypes";

export function excludeSections(
  config: DynamicFormConfig,
  sectionsToExclude: string[]
): DynamicFormConfig {
  return {
    ...config,
    sections: config.sections.filter(
      (section) => !sectionsToExclude.includes(section.title || "")
    ),
  };
}

export function excludeFields(
  config: DynamicFormConfig,
  fieldsToExclude: string[]
): DynamicFormConfig {
  return {
    ...config,
    sections: config.sections
      .map((section) => ({
        ...section,
        fields: section.fields.filter(
          (field) => !fieldsToExclude.includes(field.name)
        ),
      }))
      .filter((section) => section.fields.length > 0),
  };
}

export function keepOnlySections(
  config: DynamicFormConfig,
  sectionsToKeep: string[]
): DynamicFormConfig {
  return {
    ...config,
    sections: config.sections.filter((section) =>
      sectionsToKeep.includes(section.title || "")
    ),
  };
}

export function keepOnlyFields(
  config: DynamicFormConfig,
  fieldsToKeep: string[]
): DynamicFormConfig {
  return {
    ...config,
    sections: config.sections
      .map((section) => ({
        ...section,
        fields: section.fields.filter((field) =>
          fieldsToKeep.includes(field.name)
        ),
      }))
      .filter((section) => section.fields.length > 0),
  };
}

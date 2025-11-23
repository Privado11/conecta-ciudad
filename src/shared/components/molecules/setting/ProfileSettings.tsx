import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { DynamicFormConfig } from "@/shared/types/dynamicFormTypes";
import type { User } from "@/shared/types/userTYpes";
import { DynamicForm } from "../DynamicForm";
import { keepOnlyFields } from "@/config/forms/filterFormConfig";
import { userFormConfig } from "@/config/forms/userForm.config";

interface ProfileSettingsProps {
  user: User;
  updateProfile: (data: Partial<User>) => Promise<void>;
  onValidate?: (data: any) => Promise<{ available: boolean; message: string }>;
  loading?: boolean;
}

export default function ProfileSettings({
  user,
  updateProfile,
  onValidate,
  loading,
}: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!isEditing) {
      setFormKey((prev) => prev + 1);
    }
  }, [isEditing]);

  const profileFilteredConfig = keepOnlyFields(userFormConfig, [
    "name",
    "nationalId",
    "email",
    "phone",
  ]);

  profileFilteredConfig.sections = profileFilteredConfig.sections.map(
    (section) => ({
      ...section,
      columns: 1,
      fields: section.fields.map((field) => ({
        ...field,
        cols: 1,

        disabled: field.name === "email" ? true : !isEditing,
      })),
    })
  );

  const finalProfileConfig: DynamicFormConfig = {
    ...profileFilteredConfig,
    title: "Información del perfil",
    description: "Actualiza tu información personal",
    submitLabel: "Guardar cambios",
    cancelLabel: "Cancelar",
    loadingLabel: "Guardando...",
    sections: profileFilteredConfig.sections,
  };

  const getUserInitials = () => {
    if (!user.name) return "U";
    const parts = user.name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const handleSubmit = async (data: any) => {
    const { email, ...editableData } = data;
    await updateProfile(editableData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Información del perfil</CardTitle>
            <CardDescription>
              Actualiza tu información personal y cómo te ven los demás.
            </CardDescription>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent cursor-pointer"
            >
              Editar perfil
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          </div>

          <DynamicForm
            key={formKey}
            config={finalProfileConfig}
            initialData={user}
            onValidate={onValidate}
            onSubmit={handleSubmit}
            onCancel={isEditing ? handleCancel : undefined}
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
}

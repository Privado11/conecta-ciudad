import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface PasswordSettingsProps {
  updatePassword: (data: {
    oldPassword: string;
    newPassword: string;
  }) => Promise<void>;
  loading: boolean;
}

export default function PasswordSettings({
  updatePassword,
  loading,
}: PasswordSettingsProps) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState<string>("");
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (field: "newPassword" | "confirmPassword") => {
    setTouched({
      ...touched,
      [field]: true,
    });
    validatePassword(field);
  };

  const validatePassword = (field: "newPassword" | "confirmPassword") => {
    const { newPassword, confirmPassword } = passwordForm;

    if (field === "newPassword" && touched.newPassword) {
      if (newPassword.length > 0 && newPassword.length < 6) {
        setPasswordError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    if (field === "confirmPassword" && touched.confirmPassword) {
      if (confirmPassword && newPassword !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden.");
        return;
      }
    }

    if (touched.newPassword && touched.confirmPassword) {
      if (confirmPassword && newPassword !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden.");
        return;
      }
    }

    setPasswordError("");
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setTouched({
      newPassword: false,
      confirmPassword: false,
    });
  };

  const isFormValid =
    passwordForm.currentPassword &&
    passwordForm.newPassword.length >= 6 &&
    passwordForm.confirmPassword &&
    !passwordError;

  const handlePasswordChange = async () => {
    if (!isFormValid) return;

    await updatePassword({
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    resetPasswordForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar contraseña</CardTitle>
        <CardDescription>
          Actualiza tu contraseña para mantener tu cuenta segura.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur("newPassword")}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur("confirmPassword")}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 px-3 text-slate-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handlePasswordChange}
            disabled={!isFormValid || loading}
            className={`cursor-pointer ${
              isFormValid && !loading
                ? ""
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar contraseña"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

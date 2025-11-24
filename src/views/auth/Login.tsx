import type React from "react";
import { useState } from "react";
import {
  Mail,
  Lock,
  Handshake,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email: string;
  password: string;
  general: string;
}

type ValidationResult = {
  isValid: boolean;
  errors: ValidationErrors;
};

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    email: "",
    password: "",
    general: "",
  });

  const year: number = new Date().getFullYear();

  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return "El email es requerido";
    }

    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Formato de email inválido";
    }

    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return "La contraseña es requerida";
    }

    if (password.length < 6) {
      return "Mínimo 6 caracteres";
    }

    return "";
  };

  const validateForm = (data: LoginFormData): ValidationResult => {
    const emailError = validateEmail(data.email);
    const passwordError = validatePassword(data.password);

    return {
      isValid: !emailError && !passwordError,
      errors: {
        email: emailError,
        password: passwordError,
        general: "",
      },
    };
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setEmail(value);

    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "", general: "" }));
    }
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value: string = e.target.value;
    setPassword(value);

    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "", general: "" }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    const validation: ValidationResult = validateForm({ email, password });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({ email: "", password: "", general: "" });

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setPassword("");
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Error al iniciar sesión",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
          <div className="h-1 bg-blue-600"></div>

          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Handshake size={32} className="text-white" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Conecta Ciudad
              </h1>
              <p className="text-slate-600 text-sm">
                Gestiona proyectos comunitarios
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="tu@email.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    disabled={loading || password.length === 0}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-sm text-slate-600">
                  ¿No tienes una cuenta?{" "}
                  <a
                    href="/auth/register"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/auth/register");
                    }}
                  >
                    Regístrate aquí
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          &copy; {year} Conecta Ciudad • Conectando comunidades
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

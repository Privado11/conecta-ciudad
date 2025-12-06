import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserCircle,
  Smartphone,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nationalId: string;
  phone: string;
}

function SuccessModal({
  isOpen,
  userName,
  onClose,
}: {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            ¡Registro Exitoso!
          </h3>

          <p className="text-slate-600 mb-6">
            Bienvenido{" "}
            <span className="font-semibold text-blue-600">{userName}</span>, tu
            cuenta ha sido creada correctamente.
          </p>

          <div className="space-y-3">
            <Button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Ir al Login
            </Button>

            <p className="text-sm text-slate-500">
              Serás redirigido en unos segundos...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Register() {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.nationalId.trim() ||
      !formData.phone.trim()
    ) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        nationalId: formData.nationalId,
        phone: formData.phone,
      });

      setShowSuccessModal(true);
      setTimeout(() => navigate("/auth/login"), 3000);
    } catch (error) {
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/auth/login");
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim() &&
    formData.nationalId.trim() &&
    formData.phone.trim() &&
    formData.password === formData.confirmPassword;

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
            <div className="h-1 bg-blue-600"></div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <ArrowLeft size={18} className="mr-1" /> Volver
                </Link>
                <h2 className="text-2xl font-bold text-slate-900">
                  Crear cuenta
                </h2>
                <div className="w-6"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">Cédula</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="nationalId"
                      name="nationalId"
                      type="text"
                      value={formData.nationalId}
                      onChange={handleChange}
                      placeholder="Tu número de cédula"
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+57 300 123 4567"
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      disabled={loading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${
                        formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                          ? "border-green-500"
                          : ""
                      }`}
                      disabled={loading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 cursor-pointer"
                  disabled={loading || !isFormValid}
                >
                  {loading ? "Registrando..." : "Crear cuenta"}
                </Button>

                <p className="text-center text-sm text-slate-600 mt-4">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            © {new Date().getFullYear()} Conecta Ciudad. Todos los derechos
            reservados.
          </p>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        userName={formData.name}
        onClose={handleModalClose}
      />
    </>
  );
}

export default Register;

import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  ChevronDown,
  Bell,
  Search,
  Menu,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { USER_ROLES } from "@/shared/constants/user/userRoles";

interface HeaderProps {
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  toggleSidebar?: () => void;
}

export const Header = ({ actionButton, toggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();

  const { userProfile } = useUser();
  const { logout } = useAuth();

  const user = userProfile;

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    navigate("/setting");
  };

  return (
    <header className="flex bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 h-16 items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            C
          </div>
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Conecta Ciudad
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
          {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
          >
            {actionButton.label}
          </button>
        )}

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {USER_ROLES[user.roles?.[0] as keyof typeof USER_ROLES]}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-lg">
                    {user.name?.charAt(0) || "?"}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {user.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleProfile}
                className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-slate-100"
              >
                <User className="w-4 h-4 mr-2" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSettings}
                className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-slate-100"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span>Configuración</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit} from "lucide-react";
import type { User } from "@/shared/types/userTYpes";
import { USER_ROLES } from "@/shared/constants/user/userRoles";

interface HeaderProfileProps {
  user: User;
  onEdit: () => void;
}

export default function HeaderProfile({ user, onEdit }: HeaderProfileProps) {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return parts[0][0] + parts[1][0];
    return parts[0][0];
  };

  const userRole = user.roles?.[0] || "CIUDADANO";

  return (
    <CardHeader className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-blue-100 to-indigo-100 rounded" />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-start gap-4 sm:gap-6 w-full">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition duration-300" />
            <Avatar className="relative h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white shadow-lg">
              <AvatarFallback className="text-xl sm:text-2xl font-bold bg-linear-to-br from-blue-500 to-indigo-600 text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex w-full items-start gap-3 min-w-0 flex-1">
            <div className="flex flex-col gap-3 min-w-0 flex-1">
              <CardTitle className="text-xl sm:text-3xl font-bold text-gray-900">
                {user.name}
              </CardTitle>

              <Badge
                variant="outline"
                className="text-xs sm:text-sm font-medium bg-white/80 text-gray-700 border-gray-300 w-fit px-3 py-1 shadow-sm"
              >
                {USER_ROLES[userRole]}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 cursor-pointer bg-white hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 border-2 shadow-sm hover:text-gray-900"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
              <span className="font-medium">Editar</span>
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="sm:hidden flex items-center justify-center gap-2 cursor-pointer w-full bg-white hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 border-2 shadow-sm"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          <span className="font-medium">Editar Perfil</span>
        </Button>
      </div>
    </CardHeader>
  );
}

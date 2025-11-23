import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Mail,
  Phone,
  IdCard,
  User as UserIcon,
} from "lucide-react";

import type { User } from "@/shared/types/userTYpes";

interface InfoProfileProps {
  user: User;
}

export default function InfoProfile({ user }: InfoProfileProps) {
  const convertDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const infoItems = [
    {
      label: "Documento Nacional",
      value: user.nationalId,
      icon: IdCard,
    },
    {
      label: "Correo Electrónico",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Teléfono",
      value: user.phone,
      icon: Phone,
    },
    {
      label: "Miembro desde",
      value: convertDate(user.createdAt),
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <UserIcon className="h-4 w-4 mr-2" />
            Información Personal
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {infoItems.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{label}</span>
                </div>

                <span className="text-sm text-muted-foreground">
                  {value ?? "Not available"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

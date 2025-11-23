import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">
          Selecciona un rol para ver o editar sus permisos
        </p>
      </CardContent>
    </Card>
  );
}
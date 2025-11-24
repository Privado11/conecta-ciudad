import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Palette, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AppearanceSettings() {

  const handleUnavailableFeature = (): void => {
    toast(
      "Esta función aún no está disponible. Llegará en una futura actualización."
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apariencia</CardTitle>
        <CardDescription>
          Personaliza el aspecto visual de la aplicación. (Funciones en
          desarrollo)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6 opacity-60">
          <div>
            <h3 className="text-lg font-medium">Tema</h3>
            <Separator className="my-2" />  

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div
                onClick={handleUnavailableFeature}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 cursor-not-allowed bg-muted/20"
              >
                <Sun className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Claro</span>
                <Lock className="h-3 w-3 mt-1" />
              </div>

              <div
                onClick={handleUnavailableFeature}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 cursor-not-allowed bg-muted/20"
              >
                <Moon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Oscuro</span>
                <Lock className="h-3 w-3 mt-1" />
              </div>

              <div
                onClick={handleUnavailableFeature}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 cursor-not-allowed bg-muted/20"
              >
                <div className="flex gap-1 mb-2">
                  <Sun className="h-3 w-3" />
                  <Moon className="h-3 w-3" />
                </div>
                <span className="text-sm font-medium">Sistema</span>
                <Lock className="h-3 w-3 mt-1" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              La selección de tema aún no está disponible.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Colores Personalizados</h3>
            <Separator className="my-2" />

            <div className="relative mt-3">
              <Button
                onClick={handleUnavailableFeature}
                variant="outline"
                className="w-full cursor-not-allowed"
                disabled
              >
                <Palette className="h-4 w-4 mr-2" />
                Personalizar paleta de colores
                <Lock className="h-3 w-3 ml-auto" />
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                La personalización de colores aún no está disponible.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={handleUnavailableFeature}
            variant="outline"
            className="cursor-not-allowed opacity-60"
            disabled
          >
            <Lock className="h-4 w-4 mr-2" />
            Guardar preferencias
          </Button>

          <p className="text-sm text-muted-foreground mt-3">
            Todas las funciones están en desarrollo y estarán disponibles
            pronto.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

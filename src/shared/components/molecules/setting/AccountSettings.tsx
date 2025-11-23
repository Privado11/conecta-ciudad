import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, LogOut, Trash2 } from "lucide-react";
import { ConfirmModal } from "../../atoms/ConfirmModal";

interface AccountSettingsProps {
  handleLogout: () => void;
  loading?: boolean;
  handleDeleteAccount?: () => Promise<void>;
}

export default function AccountSettings({
  handleLogout,
  loading = false,
  handleDeleteAccount,
}: AccountSettingsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteAccount = async () => {
    if (!handleDeleteAccount) return;
    setIsDeleting(true);
    await handleDeleteAccount();
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
    handleLogout();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cuenta</CardTitle>
          <CardDescription>
            Administra tu cuenta y tu sesión activa.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Sesión</h3>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer"
                disabled={loading}
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3 text-destructive">
                Zona de Peligro
              </h3>

              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Advertencia</AlertTitle>
                <AlertDescription>
                  Eliminar tu cuenta es una acción permanente y no se puede
                  deshacer. Toda tu información será eliminada para siempre.
                </AlertDescription>
              </Alert>

              <Button
                variant="destructive"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer hover:bg-destructive hover:text-white"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar cuenta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteAccount}
        loading={isDeleting}
        title="Confirmar eliminación de cuenta"
        description={
          <>
            <p className="mb-3">
              ¿Estás completamente seguro de que deseas eliminar tu cuenta?
            </p>
            <p className="text-muted-foreground">
              Esta acción es permanente e irreversible. Toda tu información será
              eliminada para siempre.
            </p>
          </>
        }
        confirmText="Eliminar cuenta"
        loadingText="Eliminando"
        variant="destructive"
      />
    </>
  );
}

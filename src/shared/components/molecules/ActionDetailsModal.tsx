import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Database,
  Calendar,
  FileJson,
  Shield,
  GitCompare,
  Loader2,
  Info,
  Globe,
} from "lucide-react";
import type { ActionDetails } from "@/shared/types/auditTypes";

interface ActionDetailsModalProps {
  action: ActionDetails | null;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

export const ActionDetailsModal: React.FC<ActionDetailsModalProps> = ({
  action,
  open,
  onClose,
  loading,
}) => {
  const isLoading = loading && !action;
  if (!open) return null;

  const resultVariant =
    action?.result === "SUCCESS" ? "outline" : "destructive";
  const hasMetadata =
    !!action?.metadata && Object.keys(action.metadata).length > 0;
  const hasChanges =
    !!action?.changes && Object.keys(action.changes).length > 0;
  const modalSize = hasMetadata ? "max-w-3xl" : "max-w-xl";

  const isGlobalAction =
    !action?.entityType ||
    !action?.entityData ||
    (typeof action.entityData.info === "string" &&
      action.entityData.info
        .toLowerCase()
        .includes("no tiene entidad asociada"));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${modalSize} rounded-2xl py-4`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">
              Cargando detalles de la acción...
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary shrink-0" />
                    <span className="truncate">{action?.actionType}</span>
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs">
                      {action?.actionAt
                        ? new Date(action.actionAt).toLocaleString("es-CO", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </span>
                  </p>
                </div>
                {action?.result && (
                  <Badge variant={resultVariant} className="shrink-0">
                    {action.result}
                  </Badge>
                )}
              </div>

              {action?.description && (
                <DialogDescription className="text-sm leading-relaxed">
                  {action.description}
                </DialogDescription>
              )}
            </DialogHeader>

            <Separator />

            <ScrollArea className="max-h-[calc(90vh-200px)]">
              <div className="px-6 py-4 space-y-4">
                {action?.user && (
                  <Section
                    icon={<User className="w-4 h-4" />}
                    title="Usuario que realizó la acción"
                  >
                    <InfoRow label="Nombre" value={action.user.name} />
                    <InfoRow label="Email" value={action.user.email} />
                    <InfoRow
                      label="ID"
                      value={action.user.id?.toString()}
                      mono
                    />
                  </Section>
                )}

                <Section
                  icon={<Database className="w-4 h-4" />}
                  title="Entidad Afectada"
                >
                  {action?.entityType ? (
                    <>
                      <InfoRow label="Tipo" value={action.entityType} />
                      {isGlobalAction ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                          <Globe className="w-4 h-4 text-primary" />
                          <span>
                            Esta acción es global y no tiene entidad asociada.
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2 border bg-muted/30 rounded-md p-3 text-xs font-mono space-y-2">
                          {Object.entries(action.entityData ?? {}).map(
                            ([k, v]) => (
                              <div
                                key={k}
                                className="flex flex-col sm:flex-row sm:gap-2"
                              >
                                <span className="font-semibold min-w-[100px] text-foreground">
                                  {k}:
                                </span>
                                <span className="text-muted-foreground wrap-break-word whitespace-pre-wrap break-all leading-relaxed w-full overflow-hidden">
                                  {String(v ?? "N/A")}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                      <Info className="w-4 h-4 text-primary" />
                      <span>
                        Esta acción no afecta a una entidad específica.
                      </span>
                    </div>
                  )}
                </Section>

                {hasChanges && (
                  <Section
                    icon={<GitCompare className="w-4 h-4" />}
                    title="Cambios Registrados"
                  >
                    <div className="rounded-md border bg-muted/30 p-3 text-xs font-mono space-y-1">
                      {Object.entries(action!.changes!).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:gap-2"
                        >
                          <span className="font-semibold min-w-[120px]">
                            {key}:
                          </span>
                          <span className="wrap-break-word whitespace-pre-wrap break-all">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {hasMetadata && (
                  <Section
                    icon={<FileJson className="w-4 h-4" />}
                    title="Metadatos Adicionales"
                  >
                    <div className="rounded-lg border bg-muted/30 overflow-hidden">
                      <ScrollArea className="max-h-64">
                        <div className="text-xs font-mono p-3 bg-background/50 leading-relaxed whitespace-pre-wrap wrap-break-word break-all text-foreground overflow-hidden">
                          {Object.entries(action.metadata ?? {}).map(
                            ([k, v]) => (
                              <div
                                key={k}
                                className="flex flex-col sm:flex-row sm:gap-2 mb-2"
                              >
                                <span className="font-semibold min-w-[100px]">
                                  {k}:
                                </span>
                                <span className="text-muted-foreground wrap-break-word whitespace-pre-wrap break-all leading-relaxed">
                                  {String(v ?? "N/A")}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </Section>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// 📦 Componentes auxiliares
const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-2.5">
    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
      <span className="text-primary">{icon}</span>
      {title}
    </h3>
    <div className="rounded-lg border bg-muted/30 p-3.5 space-y-2.5 text-sm">
      {children}
    </div>
  </section>
);

const InfoRow = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2">
    <span className="text-muted-foreground min-w-[100px] shrink-0 text-sm">
      {label}:
    </span>
    <span
      className={`flex-1 ${
        mono ? "font-mono text-xs" : "text-sm"
      } wrap-break-word whitespace-pre-wrap break-all leading-relaxed`}
    >
      {value || "N/A"}
    </span>
  </div>
);

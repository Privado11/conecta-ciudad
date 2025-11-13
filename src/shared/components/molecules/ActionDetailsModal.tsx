import React from 'react';
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
  ChevronDown,
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
  const modalSize = hasMetadata || hasChanges ? "max-w-3xl" : "max-w-xl";

  const isGlobalAction =
    !action?.entityType ||
    !action?.entityData ||
    (typeof action.entityData.info === "string" &&
      action.entityData.info
        .toLowerCase()
        .includes("no tiene entidad asociada"));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className={`${modalSize} rounded-2xl py-4`}
        aria-describedby="action-details-description"
      >
        {isLoading ? (
          <div 
            className="flex flex-col items-center justify-center py-20 gap-3 text-center"
            role="status"
            aria-live="polite"
          >
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
                    <Shield className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                    <span className="truncate" title={action?.actionType}>
                      {action?.actionType || "Acción sin tipo"}
                    </span>
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <time className="text-xs">
                      {action?.actionAt
                        ? new Date(action.actionAt).toLocaleString("es-CO", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })
                        : "Fecha no disponible"}
                    </time>
                  </p>
                </div>
                {action?.result && (
                  <Badge 
                    variant={resultVariant} 
                    className="shrink-0"
                    aria-label={`Resultado: ${action.result}`}
                  >
                    {action.result}
                  </Badge>
                )}
              </div>

              {action?.description && (
                <DialogDescription 
                  id="action-details-description"
                  className="text-sm leading-relaxed"
                >
                  {action.description}
                </DialogDescription>
              )}
            </DialogHeader>

            <Separator className="my-2" />

            <ScrollArea className="max-h-[calc(90vh-200px)]">
              <div className="px-6 py-4 space-y-5">
                {action?.user && (
                  <Section
                    icon={<User className="w-4 h-4" />}
                    title="Responsable"
                  >
                    <InfoRow
                      label="ID"
                      value={action.user.id?.toString()}
                      mono
                      truncate
                    />
                    
                    <InfoRow 
                      label="Nombre" 
                      value={action.user.name} 
                      truncate
                    />
                    <InfoRow 
                      label="Email" 
                      value={action.user.email}
                      truncate
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground italic py-1">
                          <Globe className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                          <span>
                            Esta acción es global y no tiene entidad asociada.
                          </span>
                        </div>
                      ) : (
                        <DataBlock 
                          data={action.entityData ?? {}} 
                          emptyMessage="Sin datos de entidad"
                        />
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground italic py-1">
                      <Info className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
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
                    <DataBlock 
                      data={action!.changes!} 
                      emptyMessage="Sin cambios registrados"
                      variant="changes"
                    />
                  </Section>
                )}

                {hasMetadata && (
                  <Section
                    icon={<FileJson className="w-4 h-4" />}
                    title="Metadatos Adicionales"
                  >
                    <div className="rounded-lg border bg-muted/30 overflow-hidden relative">
                      <ScrollArea className="max-h-72">
                        <DataBlock 
                          data={action.metadata ?? {}} 
                          emptyMessage="Sin metadatos"
                          variant="metadata"
                        />
                      </ScrollArea>
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none flex items-end justify-center pb-1">
                        <ChevronDown className="w-4 h-4 text-muted-foreground/50 animate-pulse" aria-hidden="true" />
                      </div>
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
      <span className="text-primary" aria-hidden="true">{icon}</span>
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
  truncate = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  truncate?: boolean;
}) => {
  const displayValue = value || "N/A";
  const isTooLong = displayValue.length > 50;
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2">
      <span className="text-muted-foreground min-w-[100px] shrink-0 text-sm font-medium">
        {label}:
      </span>
      <span
        className={`flex-1 ${mono ? "font-mono text-xs" : "text-sm"} ${
          truncate && isTooLong ? "truncate" : "break-words"
        } leading-relaxed`}
        title={truncate && isTooLong ? displayValue : undefined}
      >
        {displayValue}
      </span>
    </div>
  );
};

const DataBlock = ({
  data,
  emptyMessage = "Sin datos",
  variant = "default",
}: {
  data: Record<string, any>;
  emptyMessage?: string;
  variant?: "default" | "changes" | "metadata";
}) => {
  const entries = Object.entries(data);
  
  if (entries.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic py-2 text-center">
        {emptyMessage}
      </div>
    );
  }

  const bgClass = variant === "metadata" ? "bg-background/50" : "bg-muted/30";

  return (
    <div className={`rounded-md border ${bgClass} p-3 text-xs font-mono space-y-2 overflow-hidden`}>
      {entries.map(([key, value]) => {
        const stringValue = value === null || value === undefined 
          ? "N/A" 
          : typeof value === "object"
          ? JSON.stringify(value, null, 2)
          : String(value);
        
        const isLongValue = stringValue.length > 100;

        return (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:gap-2 pb-2 border-b border-border/50 last:border-0 last:pb-0"
          >
            <span className="font-semibold min-w-[120px] text-foreground shrink-0 mb-1 sm:mb-0">
              {key}:
            </span>
            <span 
              className={`text-muted-foreground break-words whitespace-pre-wrap leading-relaxed flex-1 ${
                isLongValue ? "max-h-32 overflow-y-auto text-[11px]" : ""
              }`}
              title={isLongValue ? stringValue : undefined}
            >
              {stringValue}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ActionDetailsModal;
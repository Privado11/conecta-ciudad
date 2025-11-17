import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  User as UserIcon,
  Mail,
  Award,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProjectDto } from "@/shared/types/projectTypes";
import type { CuratorDto } from "@/shared/types/userTYpes";

interface AssignCuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDto | null;
  currentCurator?: CuratorDto | null;
  curators: CuratorDto[] | null;
  onAssign: (curatorId: string) => void;
  loadingFetchingCurators: boolean;
  loadingAssigningCurator: boolean;
}

export function AssignCuratorModal({
  isOpen,
  onClose,
  project,
  currentCurator,
  curators,
  onAssign,
  loadingFetchingCurators,
  loadingAssigningCurator,
}: AssignCuratorModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedCuratorId, setSelectedCuratorId] = useState<number>(
    currentCurator?.curator.id || 0
  );

  const selectedCurator = curators?.find(
    (c) => c.curator.id === selectedCuratorId
  );

  const handleClose = () => {
    setSelectedCuratorId(currentCurator?.curator.id || 0);
    onClose();
  };

  const handleAssign = () => {
    if (selectedCuratorId) {
      onAssign(selectedCuratorId.toString());
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-linear-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden rounded-2xl shadow-2xl border-slate-200/50 dark:border-slate-700/50">
        {loadingFetchingCurators ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-3 text-center"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">
              Cargando curadores...
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 bg-linear-to-br from-white/80 via-slate-50/50 to-transparent dark:from-slate-900/80 dark:via-slate-800/50 backdrop-blur-sm">
              <DialogTitle className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                {currentCurator ? "Reasignar Curador" : "Asignar Curador"}
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                Selecciona un curador para el proyecto "{project?.name}"
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-6 space-y-6">
              {currentCurator && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Curador Actual
                  </h3>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50">
                    <Avatar className="h-12 w-12 border-2 border-blue-300 dark:border-blue-700">
                      <AvatarFallback className="bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                        {getInitials(currentCurator.curator.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {currentCurator.curator.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {currentCurator.curator.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      >
                        {currentCurator?.activeProjects} proyectos activos
                      </Badge>

                      <Badge
                        variant="secondary"
                        className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                      >
                        {currentCurator?.completedProjects} proyectos
                        completados
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {currentCurator && (
                <Separator className="bg-linear-to-r from-transparent via-slate-300 to-transparent dark:from-transparent dark:via-slate-600 dark:to-transparent" />
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  {currentCurator
                    ? "Seleccionar Nuevo Curador"
                    : "Seleccionar Curador"}
                </h3>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between h-auto py-3 px-4 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {selectedCurator ? (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-blue-500 dark:bg-blue-600 text-white font-semibold">
                              {getInitials(selectedCurator.curator.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {selectedCurator.curator.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {selectedCurator.curator.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">
                          Buscar curador...
                        </span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px] p-0" align="start">
                    <Command
                      className="rounded-lg border shadow-md"
                      shouldFilter={true}
                    >
                      <CommandInput
                        placeholder="Buscar por nombre o email..."
                        className="h-12"
                      />
                      <CommandList
                        className="max-h-[300px] overflow-y-auto overscroll-contain"
                        style={{ overflowY: "auto" }}
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <CommandEmpty className="py-6 text-center text-sm text-slate-500">
                          No se encontraron curadores.
                        </CommandEmpty>
                        <CommandGroup>
                          {curators?.map((curator) => (
                            <CommandItem
                              key={curator.curator.id}
                              value={`${curator.curator.name} ${curator.curator.email}`}
                              onSelect={() => {
                                setSelectedCuratorId(curator.curator.id);
                                setOpen(false);
                              }}
                              className="flex items-center gap-3 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 data-[selected=true]:bg-slate-100 dark:data-[selected=true]:bg-slate-800"
                            >
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="text-xs bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold">
                                  {getInitials(curator.curator.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {curator.curator.name}
                                  </p>
                                  {curator.curator.id ===
                                    currentCurator?.curator.id && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Actual
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {curator.curator.email}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-2 py-0.5"
                                  >
                                    {curator.activeProjects} activos
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-2 py-0.5"
                                  >
                                    {curator.completedProjects} completados
                                  </Badge>
                                </div>
                              </div>
                              <Check
                                className={`h-4 w-4 ${
                                  selectedCuratorId === curator.curator.id
                                    ? "opacity-100 text-blue-600"
                                    : "opacity-0"
                                }`}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {selectedCurator &&
                selectedCuratorId !== currentCurator?.curator.id && (
                  <div className="p-4 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-200 dark:bg-green-900/50">
                        <UserIcon className="w-4 h-4 text-green-700 dark:text-green-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Nuevo curador seleccionado
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {selectedCurator.curator.name} será asignado a este
                          proyecto
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200/60 dark:border-slate-700/60 bg-linear-to-t from-white/90 via-slate-50/50 to-transparent dark:from-slate-900/90 dark:via-slate-800/50 backdrop-blur-sm flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAssign}
                disabled={
                  loadingAssigningCurator ||
                  !selectedCuratorId ||
                  selectedCuratorId === currentCurator?.curator.id
                }
                className="cursor-pointer flex items-center gap-2"
              >
                {loadingAssigningCurator ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {currentCurator ? "Reasignando..." : "Asignando..."}
                  </>
                ) : currentCurator ? (
                  "Reasignar Curador"
                ) : (
                  "Asignar Curador"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

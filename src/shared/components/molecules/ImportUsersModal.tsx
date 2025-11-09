import { useState, useRef } from "react";
import { Upload, X, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserImportError {
  rowNumber: number;
  email: string;
  nationalId: string;
  role: string;
  errorMessage: string;
}

interface BulkUserImportResult {
  totalProcessed: number;
  successfulImports: number;
  failedImports: number;
  errors: UserImportError[];
}

interface ImportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<BulkUserImportResult>;
}

export default function ImportUsersModal({
  isOpen,
  onClose,
  onImport,
}: ImportUsersModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkUserImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        alert("Por favor selecciona un archivo CSV");
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const importResult = await onImport(file);
      setResult(importResult);
    } catch (error) {
      console.error("Error importing users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar Usuarios desde CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Formato del archivo CSV
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>El archivo debe contener las siguientes columnas:</p>
                <code className="block bg-background p-2 rounded mt-2">
                  name,email,nationalId,phone,password,role
                </code>
                <p className="mt-2">
                  <strong>Roles válidos:</strong> ADMIN, CIUDADANO, CURATOR,
                  LIDER_COMUNITARIO
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            {!file ? (
              <div>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Arrastra un archivo CSV aquí o haz clic para seleccionar
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  Seleccionar archivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden cursor-pointer"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {result && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Resultado de la importación</h3>
                  <Badge
                    variant={
                      result.failedImports === 0 ? "default" : "destructive"
                    }
                  >
                    {result.failedImports === 0 ? "Completo" : "Parcial"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">
                      {result.totalProcessed}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Procesados
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {result.successfulImports}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Exitosos
                    </div>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded">
                    <div className="text-2xl font-bold text-red-600">
                      {result.failedImports}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Fallidos
                    </div>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      Errores detectados:
                    </h4>
                    <div className="space-y-2">
                      {result.errors.map((error, index) => (
                        <Card
                          key={index}
                          className="bg-destructive/5 border-destructive/20"
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <div className="text-xs font-medium">
                                  Fila {error.rowNumber}
                                </div>
                                <Badge 
                                  variant="destructive" 
                                  className="text-xs whitespace-normal text-left max-w-[60%]"
                                >
                                  {error.errorMessage}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-0.5 pl-2 border-l-2 border-muted">
                                <div className="break-all">
                                  <span className="font-medium">Email:</span> {error.email || 'N/A'}
                                </div>
                                <div className="break-all">
                                  <span className="font-medium">Cédula:</span> {error.nationalId || 'N/A'}
                                </div>
                                <div>
                                  <span className="font-medium">Rol:</span> {error.role || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {result.successfulImports > 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {result.successfulImports} usuario(s) importado(s)
                    exitosamente
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="cursor-pointer"
          >
            {result ? "Cerrar" : "Cancelar"}
          </Button>
          {!result && (
            <Button
              onClick={handleImport}
              disabled={!file || loading}
              className="cursor-pointer"
            >
              {loading ? "Importando..." : "Importar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
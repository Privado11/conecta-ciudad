import type React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl"; 
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = "lg",
}: ModalProps) {
  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${widthClasses[width]} mx-auto bg-card border border-border rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh] animate-in fade-in-50 zoom-in-95`}
      >
        <div className="flex justify-between items-center mb-6 px-6">
          <div>
            <h2 className="text-2xl font-bold">{title ? title : ""}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {description ? description : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

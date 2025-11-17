import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { MenuProvider } from "./MenuContext";
import { UserProvider } from "./UserContext";
import { AuditProvider } from "./AuditContext";
import { PermissionProvider } from "./PermissionContext";
import { ProjectProvider } from "./ProjectContext";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <MenuProvider>
        <UserProvider>
          <AuditProvider>
            <PermissionProvider>
              <ProjectProvider>{children}</ProjectProvider>
            </PermissionProvider>
          </AuditProvider>
        </UserProvider>
      </MenuProvider>
    </AuthProvider>
  );
}

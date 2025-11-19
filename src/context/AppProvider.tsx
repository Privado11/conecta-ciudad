import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { MenuProvider } from "./MenuContext";
import { UserProvider } from "./UserContext";
import { AuditProvider } from "./AuditContext";
import { PermissionProvider } from "./PermissionContext";
import { ProjectProvider } from "./ProjectContext";
import { AdminUsersProvider } from "./AdminUsersContext";
import { AdminProjectsProvider } from "./AdminProjectsContext";
import { CuratorProvider } from "./CuratorContext";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <MenuProvider>
        <UserProvider>
          <AdminUsersProvider>
            <AdminProjectsProvider>
              <AuditProvider>
                <CuratorProvider>
                  <PermissionProvider>
                    <ProjectProvider>{children}</ProjectProvider>
                  </PermissionProvider>
                </CuratorProvider>
              </AuditProvider>
            </AdminProjectsProvider>
          </AdminUsersProvider>
        </UserProvider>
      </MenuProvider>
    </AuthProvider>
  );
}

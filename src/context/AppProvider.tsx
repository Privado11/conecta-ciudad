import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { MenuProvider } from "./MenuContext";
import { UserProvider } from "./UserContext";
import { AuditProvider } from "./AuditContext";
import { PermissionProvider } from "./PermissionContext";
import { ProjectProvider } from "./ProjectContext";
import { VotingProvider } from "./VotingContext";
import { AdminUsersProvider } from "./AdminUsersContext";
import { AdminProjectsProvider } from "./AdminProjectsContext";
import { CuratorProvider } from "./CuratorContext";
import { DashboardProvider } from "./DashboardContext";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <MenuProvider>
        <UserProvider>
          <AdminUsersProvider>
            <DashboardProvider>
              <CuratorProvider>
                <AdminProjectsProvider>
                  <VotingProvider>
                    <ProjectProvider>
                      <AuditProvider>
                        <PermissionProvider>{children}</PermissionProvider>
                      </AuditProvider>
                    </ProjectProvider>
                  </VotingProvider>
                </AdminProjectsProvider>
              </CuratorProvider>
            </DashboardProvider>
          </AdminUsersProvider>
        </UserProvider>
      </MenuProvider>
    </AuthProvider>
  );
}

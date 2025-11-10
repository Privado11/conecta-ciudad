import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { MenuProvider } from "./MenuContext";
import { UserProvider } from "./UserContext";
import { AuditProvider } from "./AuditContext";


interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <MenuProvider>
        <UserProvider>
            <AuditProvider>
                {children}
            </AuditProvider>
        </UserProvider>
      </MenuProvider>
    </AuthProvider>
  );
}

import AuthService from "@/service/AuthService";
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedUser = await AuthService.login(email, password);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await AuthService.register(data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  
  const isAuthenticated = (): boolean => {
    return AuthService.isAuthenticated();
  };

  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

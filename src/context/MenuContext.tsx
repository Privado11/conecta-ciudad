import MenuService from "@/service/MenuService";
import type { MenuItem, UserInfo } from "@/shared/types/menuTypes";
import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { isTokenExpired } from "@/utils/tokenUtils";

type MenuContextType = {
  user: UserInfo | null;
  menu: MenuItem[];
  loading: boolean;
  reloadMenu: () => Promise<void>;
};

export const MenuContext = createContext<MenuContextType | null>(null);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const authContext = useContext(AuthContext);

  const reloadMenu = async () => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      setMenu([]);
      setUser(null);
      MenuService.clearMenu(); 
      return;
    }

    setLoading(true);
    try {
     
      const cachedMenu = MenuService.getCurrentMenu();
      
     
      if (
        cachedMenu && 
        authContext?.user?.email && 
        cachedMenu.user.username === authContext.user.email
      ) {
        setMenu(cachedMenu.menu);
        setUser(cachedMenu.user);
        setLoading(false);
        return;
      }

      
      const data = await MenuService.getMenu();
      setMenu(data.menu);
      setUser(data.user);
    } catch (err) {
      console.error("Error cargando menú:", err);
      setMenu([]);
      setUser(null);
      MenuService.clearMenu(); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authContext?.user) {
      reloadMenu();
    } else {
      setMenu([]);
      setUser(null);
      MenuService.clearMenu(); 
    }
  }, [authContext?.user]);

  return (
    <MenuContext.Provider value={{ user, menu, loading, reloadMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
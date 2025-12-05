import { create } from "zustand";
import { logger } from "./middleware/logger";
import MenuService from "@/service/MenuService";
import type { MenuItem, UserInfo } from "@/shared/types/menuTypes";
import { isTokenExpired } from "@/utils/tokenUtils";
import { useAuthStore } from "./authStore";

interface MenuState {
  user: UserInfo | null;
  menu: MenuItem[];
  loading: boolean;

  // Actions
  reloadMenu: () => Promise<void>;
  clearMenu: () => void;
}

export const useMenuStore = create<MenuState>()(
  logger(
    (set) => ({
      user: null,
      menu: [],
      loading: false,

      reloadMenu: async () => {
        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
          set({ menu: [], user: null });
          MenuService.clearMenu();
          return;
        }

        set({ loading: true });
        try {
          const cachedMenu = MenuService.getCurrentMenu();
          const authUser = useAuthStore.getState().user;

          if (
            cachedMenu &&
            authUser?.email &&
            cachedMenu.user.username === authUser.email
          ) {
            set({
              menu: cachedMenu.menu,
              user: cachedMenu.user,
              loading: false,
            });
            return;
          }

          const data = await MenuService.getMenu();
          set({ menu: data.menu, user: data.user });
        } catch (err) {
          console.error("Error cargando menú:", err);
          set({ menu: [], user: null });
          MenuService.clearMenu();
        } finally {
          set({ loading: false });
        }
      },

      clearMenu: () => {
        set({ menu: [], user: null });
        MenuService.clearMenu();
      },
    }),
    "MenuStore"
  )
);

// Setup event listeners
if (typeof window !== "undefined") {
  const handleUserLoggedIn = () => {
    useMenuStore.getState().reloadMenu();
  };

  const handleUserLoggedOut = () => {
    useMenuStore.getState().clearMenu();
  };

  window.addEventListener("userLoggedIn", handleUserLoggedIn);
  window.addEventListener("userLoggedOut", handleUserLoggedOut);

  // Initial load if user is authenticated
  if (useAuthStore.getState().user) {
    useMenuStore.getState().reloadMenu();
  }
}

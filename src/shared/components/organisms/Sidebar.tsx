import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import { ChevronDown, Settings, User } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";
import type { MenuItem } from "@/shared/types/menuTypes";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const { menu, loading } = useMenu();

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isMenuItemActive = (route: string): boolean => {
    if (route === "#") return false;
    return location.pathname.startsWith(route);
  };

  const mainMenuItems = menu.filter(
    (item) => !["Configuración", "Perfil", "Mi Perfil"].includes(item.label)
  );

  const settingsItems = menu.filter((item) =>
    ["Configuración", "Perfil", "Mi Perfil"].includes(item.label)
  );

  const renderMenuItems = (items: MenuItem[], depth = 0) => {
    return items.map((item) => {
      const isActive = isMenuItemActive(item.route);
      const isExpanded = expandedItems.includes(item.label);
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;

      const IconComponent =
        (Icons[item.icon as keyof typeof Icons] as React.ElementType) ||
        Icons.FileText;

      return (
        <div key={item.label}>
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.label)}
              className={`w-full flex items-center py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 group relative cursor-pointer ${
                isExpanded
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <div className="w-12 flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <div
                className={`flex items-center justify-between flex-1 pr-3 overflow-hidden transition-all duration-300 ${
                  isHovered || isOpen
                    ? "opacity-100 max-w-full"
                    : "opacity-0 max-w-0"
                }`}
              >
                <span className="truncate whitespace-nowrap">{item.label}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
          ) : (
            <Link
              to={item.route}
              className={`flex items-center py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 group relative ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <div className="w-12 flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <span
                className={`truncate whitespace-nowrap transition-all duration-300 ${
                  isHovered || isOpen
                    ? "opacity-100 max-w-full"
                    : "opacity-0 max-w-0"
                }`}
              >
                {item.label}
              </span>
            </Link>
          )}

          {hasChildren && isExpanded && (isHovered || isOpen) && (
            <div className="ml-4 mt-1 space-y-0.5">
              {renderMenuItems(item.children ?? [], depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${isHovered ? "md:w-64" : "md:w-12"}
          ${
            isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
          }
          fixed md:relative left-0 top-16 md:top-0 z-40
          bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 
          h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 ease-in-out shadow-xl overflow-hidden
        `}
      >
        <nav className="flex-1 py-4 space-y-4 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : mainMenuItems.length > 0 ? (
            renderMenuItems(mainMenuItems)
          ) : (
            <div className="flex items-center justify-center py-8">
              <Icons.Inbox className="w-8 h-8 text-slate-300" />
            </div>
          )}
        </nav>

        <div className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4 space-y-1">
          {settingsItems.length > 0 ? (
            renderMenuItems(settingsItems)
          ) : (
            <>
              <Link
                to="/configuracion"
                className="flex items-center py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <div className="w-12 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <span
                  className={`truncate whitespace-nowrap transition-all duration-300 ${
                    isHovered || isOpen ? "opacity-100" : "opacity-0 w-0"
                  }`}
                >
                  Configuración
                </span>
              </Link>
              <Link
                to="/perfil"
                className="flex items-center py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <div className="w-12 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <span
                  className={`truncate whitespace-nowrap transition-all duration-300 ${
                    isHovered || isOpen ? "opacity-100" : "opacity-0 w-0"
                  }`}
                >
                  Mi Perfil
                </span>
              </Link>
            </>
          )}
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => {
            onClose();
          }}
        />
      )}
    </>
  );
};

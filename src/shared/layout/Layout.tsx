import { Sidebar } from "../components/organisms/Sidebar";
import { Header } from "../components/organisms/Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";

interface LayoutProps {
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const Layout = ({ actionButton }: LayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const onCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
      <Header actionButton={actionButton} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <div className="shrink-0 h-full overflow-y-auto">
          <Sidebar isOpen={isSidebarOpen} onClose={onCloseSidebar} />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

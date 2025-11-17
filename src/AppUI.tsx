import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import LoginPage from "./views/auth/Login";
import RegisterPage from "./views/auth/Register";
import { Layout } from "./shared/layout/Layout";
import Home from "./views/home/Home";
import PublicRoute from "./route/PublicRoute";
import UserManagementPage from "./views/users/UserManagementPage";
import SystemAuditPage from "./views/audit/SystemAuditPage";
import RolePermissionPage from "./views/users/RolePermissionPage";
import ProfilePage from "./views/profile/ProfilePage";
import SettingsPage from "./views/setting/SettingPage";

//   PÁGINAS DEL GRUPO 1
import PublicProjects from "./pages/PublicProjects";
import VotingResults from "./pages/VotingResults";
import CommunicationsHistory from "./pages/CommunicationsHistory";
import NotificationsCenter from "./pages/NotificationsCenter";

function AppUI() {
  return (
    <Routes>
      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Home />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/roles" element={<RolePermissionPage />} />
        <Route path="/admin/audit" element={<SystemAuditPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/setting" element={<SettingsPage />} />
        
        {/* RUTAS DEL GRUPO 1 - Comunicación, Transparencia y Resultados */}
        <Route path="/projects/public" element={<PublicProjects />} />
        <Route path="/results" element={<VotingResults />} />
        <Route path="/results/:id" element={<VotingResults />} />
        <Route path="/communications/history" element={<CommunicationsHistory />} />
        <Route path="/notifications" element={<NotificationsCenter />} />
      </Route>

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default AppUI;
``
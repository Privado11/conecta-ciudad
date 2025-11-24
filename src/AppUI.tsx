import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import LoginPage from "./views/auth/Login";
import RegisterPage from "./views/auth/Register";
import { Layout } from "./shared/layout/Layout";
import Home from "./views/home/Home";
import PublicRoute from "./route/PublicRoute";

//  RUTAS ACTUALIZADAS DE DEV (movidas a admin/)
import UserManagementPage from "./views/admin/users/UserManagementPage";
import SystemAuditPage from "./views/admin/audit/SystemAuditPage";
import RolePermissionPage from "./views/admin/users/RolePermissionPage";
import ProfilePage from "./views/admin/profile/ProfilePage";
import SettingsPage from "./views/setting/SettingPage";

//  NUEVAS PÁGINAS DE DEV (otros grupos)
import ProjectManagementPage from "./views/project/ProjectManagementPage";
import VotingManagementPage from "./views/admin/voting/VotingManagementPage";
import ProjectPendingReviewManagementPage from "./views/curator/ProjectPendingReviewManagementPage";
import ReviewHistoryManagementPage from "./views/curator/ReviewHistoryManagementPage";
import VotingProjectsView from "./views/citizen/VotingProjectsView";
import VotingHistoryView from "./views/citizen/VotingHistoryView";
import VotingResultsView from "./views/citizen/VotingResultsView";
import ReadyProjectsView from "./views/citizen/ReadyProjectsView";

// TUS PÁGINAS DEL GRUPO 1
import CommunicationsHistory from "./pages/CommunicationsHistory";
import NotificationsCenter from "./pages/NotificationsCenter";
// import VotingResults from "./pages/VotingResults"; // ⚠️ COMENTADO - Conflicto con VotingResultsView de dev

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
        
        {/* Rutas de Admin */}
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/roles" element={<RolePermissionPage />} />
        <Route path="/admin/audit" element={<SystemAuditPage />} />
        <Route path="/admin/voting" element={<VotingManagementPage />} />
        
        {/* Rutas de Proyectos */}
        <Route path="/projects" element={<ProjectManagementPage />} />
        
        {/* Rutas de Curator */}
        <Route path="/curator/pending" element={<ProjectPendingReviewManagementPage />} />
        <Route path="/curator/history" element={<ReviewHistoryManagementPage />} />
        
        {/* Rutas de Ciudadano (Votaciones) */}
        <Route path="/voting/projects" element={<VotingProjectsView />} />
        <Route path="/voting/history" element={<VotingHistoryView />} />
        <Route path="/voting/results" element={<VotingResultsView />} />
        <Route path="/ready-projects" element={<ReadyProjectsView />} />
        
        {/* Rutas de Usuario */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/setting" element={<SettingsPage />} />
        
        {/*  RUTAS DEL GRUPO 1 - Comunicación, Transparencia y Resultados */}
        <Route path="/communications/history" element={<CommunicationsHistory />} />
        <Route path="/notifications" element={<NotificationsCenter />} />
      </Route>

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default AppUI;
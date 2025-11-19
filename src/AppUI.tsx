import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import LoginPage from "./views/auth/Login";
import RegisterPage from "./views/auth/Register";
import { Layout } from "./shared/layout/Layout";
import Home from "./views/home/Home";
import PublicRoute from "./route/PublicRoute";
import UserManagementPage from "./views/admin/users/UserManagementPage";
import SystemAuditPage from "./views/admin/audit/SystemAuditPage";
import RolePermissionPage from "./views/admin/users/RolePermissionPage";
import ProfilePage from "./views/admin/profile/ProfilePage";
import SettingsPage from "./views/setting/SettingPage";
import ProjectManagementPage from "./views/project/ProjectManagementPage";
import ProjectPendingReviewManagementPage from "./views/curator/ProjectPendingReviewManagementPage";
import ReviewHistoryManagementPage from "./views/curator/ReviewHistoryManagementPage";

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
        <Route path="/admin/projects" element={<ProjectManagementPage />} />
        <Route path="/admin/audit" element={<SystemAuditPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/setting" element={<SettingsPage />} />
        <Route path="/curator/review/pending" element={<ProjectPendingReviewManagementPage />} />
        <Route path="/curator/review/history" element={<ReviewHistoryManagementPage />} />
      </Route>
      

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default AppUI;

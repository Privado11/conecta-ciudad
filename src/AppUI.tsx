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
import ReadyProjectsView from "./views/citizen/ReadyProjectsView";
import VotingProjectsView from "./views/citizen/VotingProjectsView";
import VotingManagementPage from "./views/admin/voting/VotingManagementPage";
import Projects from "./views/projects/Pojects";
import VotingResults from "./views/projects/VotingResults";

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
        <Route path="/admin/voting" element={<VotingManagementPage />} />
        <Route path="/admin/audit" element={<SystemAuditPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/setting" element={<SettingsPage />} />
        <Route
          path="/curator/review/pending"
          element={<ProjectPendingReviewManagementPage />}
        />
        <Route
          path="/curator/review/history"
          element={<ReviewHistoryManagementPage />}
        />
        <Route
          path="/citizen/projects/upcoming"
          element={<ReadyProjectsView />}
        />
        <Route
          path="/citizen/projects/voting"
          element={<VotingProjectsView />}
        />
        <Route
          path="/leader/projects/"
          element={<Projects />}
        />
        <Route
          path="/lider/results"
          element={<VotingResults />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default AppUI;

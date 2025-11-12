import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import LoginPage from "./views/auth/Login";
import RegisterPage from "./views/auth/Register";
import { Layout } from "./shared/layout/Layout";
import Home from "./views/home/Home";
import PublicRoute from "./route/PublicRoute";
import UserManagementPage from "./views/users/UserManagementPage";
import SystemAuditPage from "./views/audit/SystemAuditPage";

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
        <Route path="/admin/audit" element={<SystemAuditPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default AppUI;

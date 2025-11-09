import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import LoginPage from "./views/auth/Login";
import RegisterPage from "./views/auth/Register";
import { Layout } from "./shared/layout/Layout";
import Home from "./views/home/Home";
import PublicRoute from "./route/PublicRoute";
import ListUsers from "./views/auth/ListUsers";
import Projects from "./views/projects/Pojects";


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
        <Route path="/admin/users" element={<ListUsers />} />
        <Route path="/projects/my-projects" element={<Projects />} />
      </Route>

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}


export default AppUI;

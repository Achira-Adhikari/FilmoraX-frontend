import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../store/useStore";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, justLoggedOut } = useStore();

  if (!user) {
    if (justLoggedOut) {
      return <Navigate to="/" replace />;
    }

    // If direct access without login → go login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
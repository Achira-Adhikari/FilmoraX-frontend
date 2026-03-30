import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../store/useStore";

export const PublicRoute = () => {
  const { user } = useStore();

  // If already logged in → redirect home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated || user.role !== "ADMIN") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthenticated || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AnonymousRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

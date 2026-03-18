import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token || !user?.role) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/modules" replace />;
  }

  return children;
}
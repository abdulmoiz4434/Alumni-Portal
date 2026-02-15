import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!allowedRoles) {
    return children;
  }
  if (allowedRoles.includes(user?.role)) {
    return children;
  }

  return <Navigate to="/modules" replace />;
}
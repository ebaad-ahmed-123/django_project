import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth(); 

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Authenticating...</h2>; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user.role) {
    const userRoleCaps = user.role.toUpperCase();
    const allowedRolesCaps = allowedRoles.map(role => role.toUpperCase());

    if (!allowedRolesCaps.includes(userRoleCaps)) {
      return <Navigate to="/unauthorized" replace />; 
    }
  }

  return children;
}
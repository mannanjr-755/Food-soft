import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Protects admin panel routes. Requires an authenticated
 * ADMIN or MANAGER session. Cashiers/Waiters are denied.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, canAccessAdmin, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!canAccessAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ error: "unauthorized" }}
      />
    );
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, canAccessAdmin } = useAuth();

  if (isAuthenticated && canAccessAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

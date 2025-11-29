import { Navigate, Outlet } from "react-router-dom";

// Placeholder for actual auth logic
const useAuth = () => {
  // Mock authenticated state
  return {
    user: { role: "student" }, // Change to "admin" to test admin routes
    isAuthenticated: true,
  };
};

export default function ProtectedRoute({ role }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // Or unauthorized page
  }

  return <Outlet />;
}

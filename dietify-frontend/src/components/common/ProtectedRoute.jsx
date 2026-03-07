import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {

  const { isAuthenticated, isAuthReady } = useAuth();

  // Wait until the authentication state is restored from storage
  if (!isAuthReady) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Checking session...
      </div>
    );
  }

  // If user is not logged in, redirect them to login page
  if (!isAuthenticated) {
    return <Navigate to="/registration" replace />;
  }

  // If user is authenticated, render the requested page
  return children;
}
import { Navigate } from "react-router-dom";

// Simple route guard
function RequireAuth({ children }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // Logged in → show the requested page
  return children;
}

export default RequireAuth;

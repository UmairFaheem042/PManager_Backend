import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Redirect to signin while saving the attempted url
    return (
      <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
    );
  }

  return children;
};

export default ProtectedRoute;

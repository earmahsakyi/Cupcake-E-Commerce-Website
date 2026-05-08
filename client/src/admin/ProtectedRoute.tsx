import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return children;
};

export default ProtectedRoute;

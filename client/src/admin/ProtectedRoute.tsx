import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/index";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isCheckingAuth } = useAppSelector(
    (state) => state.adminAuth
  );
  const location = useLocation();

  if (isCheckingAuth)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );

  if (!isAuthenticated)
    return <Navigate to="/admin/login" replace state={{ from: location }} />;

  return children;
};

export default ProtectedRoute;
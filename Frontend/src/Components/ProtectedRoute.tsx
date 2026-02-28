import { Navigate } from "react-router-dom";
import { useAuth } from "../Components/Context/AuthContext";

export default function ProtectedRoute({ children }: any) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
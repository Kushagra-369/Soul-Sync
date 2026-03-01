import { Navigate } from "react-router-dom";
import { useAuth } from "../Components/Context/AuthContext";

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth();

  // 🔥 Jab tak auth check ho raha hai, kuch mat render karo
  if (loading) {
    return null; // ya loader dikha sakta hai
  }

  // 🔥 Agar loading complete hai aur user nahi hai tab redirect karo
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
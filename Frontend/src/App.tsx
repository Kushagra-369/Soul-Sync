import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./Components/Context/AuthContext";

export default function App() {
  const { user, loading } = useAuth();

  // 🔥 Important: Wait until auth check finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center 
        bg-linear-to-br 
        from-sky-100 via-indigo-100 to-emerald-100 
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <p className="text-lg font-semibold animate-pulse">
          Checking session...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-br 
        from-sky-100 via-indigo-100 to-emerald-100 
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 
        transition-all duration-500">

        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <>
                  <Navbar />
                  <div className="pt-20">
                    <Home />
                  </div>
                </>
              ) : (
                <Login />
              )
            }
          />
        </Routes>

      </div>
    </BrowserRouter>
  );
}
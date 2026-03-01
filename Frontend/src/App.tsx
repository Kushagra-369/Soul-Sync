import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./Components/Context/AuthContext";
import OTP from "./Components/Login/Otp";
import User_Login from "./Components/Login/User_Login";
import DailyMood from "./Components/Mood/DailyMood";
import { useState, useEffect } from "react";
import Connect from "./Components/Connect/Connect";
import Community from "./Components/Community/Community";
import Wellness from "./Components/Wellness/Wellness";
import { APIURL } from "./GlobalAPIURL";
import AICounselor from "./Components/AICounceller/AIcounceller";
import Dashboard from "./Components/Dashboard/Dashboard";
export default function App() {
  const { user, loading } = useAuth();
  const [showMood, setShowMood] = useState(false);

  // ✅ Auto show once per day when user exists
  useEffect(() => {
    const checkMood = async () => {
      if (!user) return;

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${APIURL}/check_mood`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && !data.submitted) {
          setShowMood(true);
        }

      } catch (err) {
        console.error("Mood check failed");
      }
    };

    checkMood();
  }, [user]);

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

        {/* ✅ Correctly pass props */}
        {user && (
          <DailyMood
            open={showMood}
            onClose={() => setShowMood(false)}
          />
        )}

        <Routes>
          <Route path="/" element={user ? (
              <>
                <Navbar onMoodClick={() => setShowMood(true)} />
                <div className="pt-20">
                  <Home />
                </div>
              </>
            ) : (
              <Login />
            )
          }
          />
          <Route path="/community" element={
            user ? (
              <>
                <Navbar onMoodClick={() => setShowMood(true)} />
                <div className="pt-20">
                  <Community />
                </div>
              </>
            ) : (
              <Login />
            )
          }
          />
          <Route path="/wellness" element={
            user ? (
              <>
                <Navbar onMoodClick={() => setShowMood(true)} />
                <div className="pt-20">
                  <Wellness />
                </div>
              </>
            ) : (
              <Login />
            )
          }
          />
        
          <Route path="/ai-counselor" element={
            user ? (
              <>
                <Navbar onMoodClick={() => setShowMood(true)} />
                <div className="pt-20">
                  <AICounselor />
                </div>
              </>
            ) : (
              <Login />
            )
          }
          />


          <Route path="/otp" element={<OTP />} />
          <Route path="/login" element={<User_Login />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/dashboard" element={<Dashboard />}/>

        </Routes>
      </div>
    </BrowserRouter>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { APIURL } from "../../GlobalAPIURL";
import { useAuth } from "../Context/AuthContext"; // 👈 ADD THIS

export default function User_Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 GET LOGIN FUNCTION

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(`${APIURL}/login`, {
        email,
        password,
      });

      if (res.data.success) {
        // ✅ IMPORTANT CHANGE
        login(res.data.user, res.data.token);

        navigate("/");
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-linear-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">

      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6">

        <h1 className="text-xl font-bold text-center text-gray-800 dark:text-white">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl text-sm font-medium bg-linear-to-r from-blue-600 to-emerald-600 text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIURL } from "../../GlobalAPIURL";
import { useAuth } from "../Context/AuthContext";
type Level = "school" | "college" | "";
type Assistant = "boy" | "girl" | "";

export default function Login() {
    const navigate = useNavigate();

    const [level, setLevel] = useState<Level>("");
    const [selection, setSelection] = useState("");
    const [assistant, setAssistant] = useState<Assistant>("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const classes = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];
    const courses = ["B.Tech", "BBA", "BCA", "BA", "BSc", "MBA", "MCA"];

    const handleLogin = async () => {
        try {
            setLoading(true);

            let deviceId = localStorage.getItem("deviceId");

            if (!deviceId) {
                deviceId = crypto.randomUUID();
                localStorage.setItem("deviceId", deviceId);
            }

            const res = await fetch(`${APIURL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    level,
                    classOrCourse: selection,
                    assistantType: assistant,
                    deviceId,
                }),
            });

            const data = await res.json();

            if (data.success) {
                login(data.user);
                navigate("/");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden">
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-8 transition-all duration-500">

                <h1 className="text-3xl font-bold text-center bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Welcome to SoulSync 💙
                </h1>

                {/* Step 1 */}
                <div>
                    <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                        Select Your Level
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => { setLevel("school"); setSelection(""); }}
                            className={`p-4 rounded-xl border ${level === "school"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 dark:bg-gray-700"
                                }`}
                        >
                            🏫 School
                        </button>

                        <button
                            onClick={() => { setLevel("college"); setSelection(""); }}
                            className={`p-4 rounded-xl border ${level === "college"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 dark:bg-gray-700"
                                }`}
                        >
                            🎓 College
                        </button>
                    </div>
                </div>

                {/* Step 2 */}
                {level && (
                    <div>
                        <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                            {level === "school" ? "Choose Your Class" : "Choose Your Course"}
                        </h2>

                        <div className="grid grid-cols-3 gap-3">
                            {(level === "school" ? classes : courses).map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setSelection(item)}
                                    className={`p-3 rounded-lg text-sm border ${selection === item
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-700"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {selection && (
                    <div>
                        <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                            Choose Your AI Assistant
                        </h2>

                        <div className="grid grid-cols-2 gap-6">
                            <button
                                onClick={() => setAssistant("boy")}
                                className={`p-6 rounded-2xl text-4xl ${assistant === "boy"
                                    ? "bg-blue-600 text-white scale-105"
                                    : "bg-gray-100 dark:bg-gray-700"
                                    }`}
                            >
                                👨🏻‍💻
                                <p className="text-sm mt-2">Acetone</p>
                            </button>

                            <button
                                onClick={() => setAssistant("girl")}
                                className={`p-6 rounded-2xl text-4xl ${assistant === "girl"
                                    ? "bg-pink-600 text-white scale-105"
                                    : "bg-gray-100 dark:bg-gray-700"
                                    }`}
                            >
                                👩🏻‍💻
                                <p className="text-sm mt-2">Aura</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Final Button */}
                {assistant && (
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-linear-to-r from-blue-600 to-emerald-600 text-white font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-lg"
                    >
                        {loading ? "Loading..." : "Continue →"}
                    </button>
                )}
            </div>
        </div>
    );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIURL } from "../../GlobalAPIURL";

type Level = "school" | "college" | "";
type Assistant = "boy" | "girl" | "";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [level, setLevel] = useState<Level>("");
    const [selection, setSelection] = useState("");
    const [assistant, setAssistant] = useState<Assistant>("");
    const [loading, setLoading] = useState(false);

    const classes = ["6", "7", "8", "9", "10", "11", "12"];
    const courses = ["B.Tech", "BBA", "BCA", "BA", "BSc", "MBA", "MCA"];

    const handleCreate = async () => {
        if (!email || !password || !level || !selection || !assistant) {
            alert("All fields required");
            return;
        }

        try {
            setLoading(true);

            let deviceId = localStorage.getItem("deviceId");

            if (!deviceId) {
                deviceId = crypto.randomUUID();
                localStorage.setItem("deviceId", deviceId);
            }

            const res = await fetch(`${APIURL}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    level,
                    classOrCourse: selection,
                    assistantType: assistant,
                    deviceId, // ✅ THIS WAS MISSING
                }),
            });

            const data = await res.json();

            if (data.success) {
                navigate("/otp", { state: { email } });
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] text-white flex items-center justify-center overflow-hidden px-3 bg-linear-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 space-y-4">

                <h1 className="text-xl font-bold text-center bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    SoulSync 💙
                </h1>

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-lg text-sm border bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded-lg text-sm border bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Level */}
                <div className="grid grid-cols-2 gap-2">
                    {["school", "college"].map((item) => (
                        <button
                            key={item}
                            onClick={() => { setLevel(item as Level); setSelection(""); }}
                            className={`p-2 rounded-lg text-sm ${level === item
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-700"
                                }`}
                        >
                            {item === "school" ? "🏫" : "🎓"} {item}
                        </button>
                    ))}
                </div>

                {/* Class/Course */}
                {level && (
                    <div className="grid grid-cols-4 gap-1">
                        {(level === "school" ? classes : courses).map((item) => (
                            <button
                                key={item}
                                onClick={() => setSelection(item)}
                                className={`p-1.5 text-xs rounded-md ${selection === item
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-700"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}

                {/* Assistant */}
                {selection && (
                    <div className="grid grid-cols-2 gap-2">
                        {["boy", "girl"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setAssistant(type as Assistant)}
                                className={`p-3 text-2xl rounded-xl ${assistant === type
                                        ? type === "boy"
                                            ? "bg-blue-600 text-white"
                                            : "bg-pink-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-700"
                                    }`}
                            >
                                {type === "boy" ? "👨🏻‍💻" : "👩🏻‍💻"}
                            </button>
                        ))}
                    </div>
                )}

                {/* Continue */}
                {assistant && (
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-full py-2 rounded-xl text-sm bg-linear-to-r from-blue-600 to-emerald-600 text-white font-medium disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : "Continue →"}
                    </button>
                )}

                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Already registered?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 cursor-pointer"
                    >
                        Login
                    </span>
                </div>

            </div>
        </div>
    );
}
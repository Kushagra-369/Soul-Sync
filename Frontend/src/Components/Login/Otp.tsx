import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { APIURL } from "../../GlobalAPIURL";

export default function OTP() {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Email should come from previous page
    const email = location.state?.email;

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const finalOtp = otp.join("");

        if (finalOtp.length !== 6) {
            setError("Enter complete OTP");
            return;
        }

        if (!email) {
            setError("Email missing. Please register again.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await axios.post(`${APIURL}/verify_otp`, {
                email,
                otp: finalOtp,
            });

            if (res.data.success) {
                navigate("/");
            }

        } catch (err: any) {
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;

        try {
            await axios.post(`${APIURL}/resend_otp`, { email });
            alert("New OTP sent to email");
        } catch (err) {
            alert("Failed to resend OTP");
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-linear-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">

            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6">

                <h1 className="text-xl font-bold text-center text-gray-800 dark:text-white">
                    Enter OTP
                </h1>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    We’ve sent a 6-digit code to your email
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputs.current[index] = el;
                            }}
                            type="text"
                            value={digit}
                            maxLength={1}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-10 h-12 text-center text-lg font-semibold border rounded-lg bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-center text-sm text-red-500">{error}</p>
                )}

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full py-2 rounded-xl text-sm font-medium bg-linear-to-r from-blue-600 to-emerald-600 text-white disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Didn’t receive code?{" "}
                    <span
                        onClick={handleResend}
                        className="text-blue-600 cursor-pointer hover:underline"
                    >
                        Resend OTP
                    </span>
                </div>

            </div>
        </div>
    );
}
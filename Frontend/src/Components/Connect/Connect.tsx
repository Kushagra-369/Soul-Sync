import { useState } from "react";
import { Link } from "react-router-dom";
import { APIURL } from "../../GlobalAPIURL";

export default function Connect() {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    problem: "",
    sessionType: "call",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.phone || !formData.problem) {
      setError("All fields are required");
      return;
    }

    if (formData.phone.length < 10) {
      setError("Enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${APIURL}/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSubmitted(true);

      // reset form
      setFormData({
        username: "",
        phone: "",
        problem: "",
        sessionType: "call",
      });

    } catch (err: any) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-linear-to-br from-indigo-100 via-sky-100 to-purple-100
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4"
    >
      <div
        className="bg-white dark:bg-gray-800 
        w-full max-w-md rounded-2xl shadow-xl p-8 transition"
      >
        {/* Go Back */}
        <div className="mb-4">
          <Link
            to="/"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Go Back
          </Link>
        </div>

        <h2
          className="text-2xl font-bold text-center mb-6 
          text-indigo-600 dark:text-indigo-400"
        >
          Book a Session
        </h2>

        {submitted ? (
          <div className="text-center space-y-3">
            <p className="text-green-600 dark:text-green-400 font-semibold">
              🎉 Session Request Submitted!
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We will contact you soon.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 text-indigo-600 dark:text-indigo-400 underline text-sm"
            >
              Book Another Session
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-lg 
                bg-white dark:bg-gray-700
                text-gray-800 dark:text-white
                border-gray-300 dark:border-gray-600
                focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border rounded-lg 
                bg-white dark:bg-gray-700
                text-gray-800 dark:text-white
                border-gray-300 dark:border-gray-600
                focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Problem */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Describe Your Problem
              </label>
              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                rows={4}
                placeholder="Write your concern here..."
                className="w-full px-4 py-2 border rounded-lg
                bg-white dark:bg-gray-700
                text-gray-800 dark:text-white
                border-gray-300 dark:border-gray-600
                focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Session Type */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Session Type
              </label>

              <div className="flex gap-6 text-gray-700 dark:text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sessionType"
                    value="call"
                    checked={formData.sessionType === "call"}
                    onChange={handleChange}
                  />
                  Call
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sessionType"
                    value="text"
                    checked={formData.sessionType === "text"}
                    onChange={handleChange}
                  />
                  Text
                </label>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 dark:bg-indigo-500
              text-white py-2 rounded-lg 
              hover:bg-indigo-700 dark:hover:bg-indigo-600 
              transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
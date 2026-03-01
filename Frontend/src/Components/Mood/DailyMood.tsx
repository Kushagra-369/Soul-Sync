import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { APIURL } from "../../GlobalAPIURL";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DailyMood({ open, onClose }: Props) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🚫 Only render if open is true
  if (!open) return null;

  const moods = [
    { label: "Very Bad", value: "very_bad", emoji: "😭" },
    { label: "Bad", value: "bad", emoji: "😞" },
    { label: "Average", value: "average", emoji: "😐" },
    { label: "Good", value: "good", emoji: "🙂" },
    { label: "Awesome", value: "awesome", emoji: "🤩" },
  ];

  const handleSubmit = async () => {
    if (!selectedMood) return;

    try {
      setLoading(true);

      await axios.post(
        `${APIURL}/mood`,
        { mood: selectedMood },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 Close popup after successful submission
      onClose();

    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[90%] max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
          How are you feeling today?
        </h2>

        <div className="grid grid-cols-5 gap-3 text-center">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-3 rounded-xl transition ${
                selectedMood === mood.value
                  ? "bg-blue-500 text-white scale-105"
                  : "bg-gray-100 dark:bg-gray-700 hover:scale-105"
              }`}
            >
              <div className="text-2xl">{mood.emoji}</div>
              <div className="text-xs">{mood.label}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedMood || loading}
          className="mt-6 w-full py-2 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Submit Mood"}
        </button>
      </div>
    </div>
  );
}
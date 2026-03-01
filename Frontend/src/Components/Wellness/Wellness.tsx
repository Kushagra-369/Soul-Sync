import { useEffect, useState } from "react";
import { APIURL } from "../../GlobalAPIURL";

interface IExercise {
  id: string;
  title: string;
  category: string;
  content: string;
  emoji: string;
  duration?: string;
  intensity?: string;
}


export default function Wellness() {
    const [mood, setMood] = useState<string>("");
    const [exercises, setExercises] = useState<IExercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    // 🔥 Frontend Exercise Library
    const moodExercises: Record<string, IExercise[][]> = {
        very_bad: [
            [
                {
                    id: "1",
                    title: "Box Breathing",
                    category: "Meditation",
                    content: "Inhale 4 sec - Hold 4 sec - Exhale 4 sec - Hold 4 sec. Repeat 5 times.",
                    emoji: "🧘",
                    duration: "3 mins",
                    intensity: "Low"
                },
                {
                    id: "2",
                    title: "Gentle Neck Stretch",
                    category: "Physical",
                    content: "Slowly tilt head right (hold 15 sec), left (15 sec), forward (15 sec).",
                    emoji: "🦒",
                    duration: "2 mins",
                    intensity: "Low"
                },
                {
                    id: "3",
                    title: "Body Scan Meditation",
                    category: "Meditation",
                    content: "Lie down, slowly bring awareness from toes to head, relaxing each part.",
                    emoji: "🔍",
                    duration: "5 mins",
                    intensity: "Low"
                },
            ],
            [
                {
                    id: "4",
                    title: "Deep Breathing",
                    category: "Meditation",
                    content: "Inhale deeply (4 sec), hold (2 sec), exhale slowly (6 sec). 10 rounds.",
                    emoji: "🌬️",
                    duration: "4 mins",
                    intensity: "Low"
                },
                {
                    id: "5",
                    title: "Seated Twist",
                    category: "Physical",
                    content: "Sit cross-legged, twist right (hold 20 sec), left (20 sec). 3 rounds each.",
                    emoji: "🔄",
                    duration: "3 mins",
                    intensity: "Low"
                },
                {
                    id: "6",
                    title: "Loving-Kindness",
                    category: "Meditation",
                    content: "Repeat: 'May I be happy, may I be healthy, may I be peaceful.' 5 mins.",
                    emoji: "💝",
                    duration: "5 mins",
                    intensity: "Low"
                },
            ],
        ],

        bad: [
            [
                {
                    id: "7",
                    title: "Cat-Cow Stretch",
                    category: "Physical",
                    content: "On hands & knees: arch back (cow), round spine (cat). 12 slow rounds.",
                    emoji: "🐱",
                    duration: "3 mins",
                    intensity: "Low"
                },
                {
                    id: "8",
                    title: "Walking Meditation",
                    category: "Meditation",
                    content: "Walk slowly, focus on each step. Feel ground beneath feet.",
                    emoji: "🚶",
                    duration: "5 mins",
                    intensity: "Low"
                },
                {
                    id: "9",
                    title: "Shoulder Rolls",
                    category: "Physical",
                    content: "Roll shoulders forward 10x, backward 10x. Deep breaths.",
                    emoji: "🤸",
                    duration: "2 mins",
                    intensity: "Low"
                },
            ],
        ],

        average: [
            [
                {
                    id: "10",
                    title: "Sun Salutation",
                    category: "Physical",
                    content: "5 rounds of Surya Namaskar at comfortable pace. Breathe with movement.",
                    emoji: "☀️",
                    duration: "5 mins",
                    intensity: "Medium"
                },
                {
                    id: "11",
                    title: "Mindful Breathing",
                    category: "Meditation",
                    content: "Focus on breath at nostrils. When mind wanders, gently return.",
                    emoji: "🧠",
                    duration: "5 mins",
                    intensity: "Medium"
                },
                {
                    id: "12",
                    title: "High Knees",
                    category: "Physical",
                    content: "March in place, knees to waist level. 30 sec on, 15 sec rest. 4 rounds.",
                    emoji: "🏃",
                    duration: "4 mins",
                    intensity: "Medium"
                },
            ],
        ],

        good: [
            [
                {
                    id: "13",
                    title: "Vinyasa Flow",
                    category: "Physical",
                    content: "Down dog → Plank → Chaturanga → Up dog → Down dog. 8 rounds.",
                    emoji: "🌊",
                    duration: "6 mins",
                    intensity: "Medium"
                },
                {
                    id: "14",
                    title: "Trataka Meditation",
                    category: "Meditation",
                    content: "Focus on candle flame or dot. Build concentration without blinking.",
                    emoji: "🕯️",
                    duration: "5 mins",
                    intensity: "Medium"
                },
                {
                    id: "15",
                    title: "Bodyweight Circuit",
                    category: "Physical",
                    content: "15 squats, 10 pushups, 20 crunches. 3 rounds, 30 sec rest.",
                    emoji: "💪",
                    duration: "7 mins",
                    intensity: "Medium"
                },
            ],
        ],

        awesome: [
            [
                {
                    id: "16",
                    title: "Power Yoga",
                    category: "Physical",
                    content: "Warrior I → II → Reverse Warrior → Side Angle. 5 rounds each side.",
                    emoji: "⚡",
                    duration: "8 mins",
                    intensity: "High"
                },
                {
                    id: "17",
                    title: "Pranayama",
                    category: "Meditation",
                    content: "Alternate nostril breathing: Close right, inhale left, switch, exhale right. 10 rounds.",
                    emoji: "🌀",
                    duration: "5 mins",
                    intensity: "Medium"
                },
                {
                    id: "18",
                    title: "HIIT",
                    category: "Physical",
                    content: "30 sec each: Burpees, Mountain climbers, Jump squats, Pushups. 2 rounds.",
                    emoji: "💥",
                    duration: "4 mins",
                    intensity: "High"
                },
            ],
        ],
    };

    // 🔥 Fetch Only Mood
    useEffect(() => {
        const fetchMood = async () => {
            try {
                const res = await fetch(`${APIURL}/get_mood`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                console.log("Mood response:", data);

                if (res.ok && data.success) {
                    setMood(data.mood);

                    const sets = moodExercises[data.mood];

                    if (sets && sets.length > 0) {
                        const randomSet =
                            sets[Math.floor(Math.random() * sets.length)];
                        setExercises(randomSet);
                    }
                }

            } catch (err) {
                console.error("Mood fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMood();
    }, []);

    const currentExercise = exercises[currentIndex];

    const handleDone = () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setCompleted(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setCompleted(false);
        setStarted(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:text-white">
                Loading your personalized session...
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-8 bg-linear-to-br from-indigo-100 via-sky-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-2xl font-bold dark:text-white mb-2">
                    Guided Wellness
                </h1>

                <p className="text-sm text-gray-500 mb-6">
                    Today’s Mood: <span className="font-semibold uppercase">{mood}</span>
                </p>

                {!started && !completed && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
                        <button
                            onClick={() => setStarted(true)}
                            className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
                        >
                            Start
                        </button>
                    </div>
                )}

                {started && !completed && currentExercise && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                        <div className="text-4xl mb-3">{currentExercise.emoji}</div>
                        <h2 className="text-lg font-bold dark:text-white">
                            {currentExercise.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            {currentExercise.category}
                        </p>
                        <p className="mt-4 dark:text-gray-300">
                            {currentExercise.content}
                        </p>

                        <div className="mt-6 flex justify-between items-center">
                            <span className="text-xs text-gray-400">
                                Step {currentIndex + 1} of {exercises.length}
                            </span>
                            <button
                                onClick={handleDone}
                                className="px-5 py-2 rounded-lg bg-emerald-600 text-white"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}

                {completed && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
                        <h2 className="text-xl font-bold text-emerald-600 mb-3">
                            🎉 Excellent!
                        </h2>
                        <button
                            onClick={handleRestart}
                            className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
                        >
                            Restart
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
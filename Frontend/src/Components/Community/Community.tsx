import { useEffect, useRef, useState } from "react";
import { APIURL } from "../../GlobalAPIURL";

interface IUser {
  _id: string;
  username: string;
}

interface IMessage {
  _id: string;
  user: IUser;
  text: string;
  createdAt: string;
}

export default function Community() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const token = localStorage.getItem("token");

  // ✅ Fetch all messages (oldest → newest)
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${APIURL}/get_all_messages`);
      const data = await res.json();

      if (res.ok) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error("Error fetching messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ✅ Auto scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`${APIURL}/send_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (res.ok) {
        setInput("");
        fetchMessages();
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 h-[calc(100vh-64px)] flex flex-col overflow-hidden
      bg-linear-to-br from-indigo-100 via-sky-100 to-purple-100
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Header */}
      <div className="p-4 shadow-md bg-white dark:bg-gray-800 flex justify-center items-center shrink-0">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          Community Space
        </h1>
      </div>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No thoughts shared yet. Be the first ✨
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">
                {msg.user?.username}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {msg.text}
            </p>
          </div>
        ))}

        {/* Auto scroll target */}
        <div ref={bottomRef}></div>
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white dark:bg-gray-800 shadow-inner shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Share your thought or what happened today..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 rounded-lg border 
            bg-white dark:bg-gray-700
            text-gray-800 dark:text-white
            border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 dark:bg-indigo-500
            text-white rounded-lg hover:bg-indigo-700 
            dark:hover:bg-indigo-600 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
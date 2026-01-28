"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { CircleStop, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { getToken } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages])

  useEffect(() => {
    if (!chatId) return;

    async function fetchHistory() {
      try {
        const token = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/${chatId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 404) {
          setError("Invalid or expired chat session.");
          return;
        }

        if (!res.ok) throw new Error("Failed to load chat");

        const data = await res.json();
        setMessages(data.messages);

      } catch (err) {
        setError("Unable to load chat history.");
      }
    }

    fetchHistory();
  }, [chatId]);


  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const token = await getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        chatId,
        message: input
      })
    });

    const reader = res.body?.getReader();
    if (!reader) return;

    let aiMessage = "";

    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      aiMessage += chunk;

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: aiMessage
        };
        return updated;
      });
    }

    setLoading(false);
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="bg-black/60 border border-red-500/20 p-10 rounded-3xl text-center">
          <h2 className="text-2xl font-semibold text-red-400">
            Invalid Chat Session
          </h2>
          <p className="text-slate-400 mt-3">
            This interview session does not exist or has expired.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-transparent px-6 py-28">
      <div className="max-w-4xl mx-auto flex flex-col h-[75vh] border border-red-500/20 bg-black/60 backdrop-blur-xl rounded-3xl">

        {/* Header */}
        <div className="p-6 border-b border-red-500/20">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">
            AI Interview Simulator
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time interview with resume-aware AI
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide" ref={containerRef}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`
                max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === "user"
                  ? "ml-auto bg-gradient-to-r from-red-600 to-rose-600 text-white"
                  : "mr-auto bg-black/60 border border-red-500/20 text-slate-200"
                }
              `}
            >
              {msg.content}
              {loading && i === messages.length - 1 && msg.role === "assistant" && (
                <span className="animate-pulse">▌</span>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-red-500/20 flex gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Answer the question..."
            className="flex-1 bg-black/60 border border-red-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 transition"
          />
          <button
            onClick={sendMessage} disabled={loading}
            className={`p-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:scale-105 transition `}
          >
            {(loading)?<CircleStop />:<Send />}
          </button>
        </div>
      </div>
    </div>
  );
}

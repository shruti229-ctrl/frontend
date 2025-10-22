import React, { useEffect, useState, useRef } from "react";
import { sendMessage, getHistory } from "../services/api";
import ChatBubble from "../components/ChatBubble";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const listRef = useRef(null);

  useEffect(() => {
    if (!token) navigate("/");
    (async () => {
      try {
        const res = await getHistory(token);
        setMessages(Array.isArray(res.data) ? res.data : res.data.messages || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const res = await sendMessage(token, input);
      const botText = res?.data?.response || "No response";
      setMessages([...messages, { sender: "user", text: input }, { sender: "bot", text: botText }]);
      setInput("");
    } catch {
      setMessages([...messages, { sender: "bot", text: "Error sending message" }]);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", padding: 24 }}>
      <h2>FinGenie — Financial Advisor</h2>
      <div
        ref={listRef}
        style={{
          minHeight: 400,
          maxHeight: 600,
          border: "1px solid #eee",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
          background: "#fafafa",
          scrollBehavior: "smooth",
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: "#666" }}>
            No messages yet — ask about crypto, stocks, gold, investing, or risk.
          </div>
        )}
        {messages.map((m, i) => <ChatBubble key={i} sender={m.sender} text={m.text} />)}
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about finance (crypto, stocks, investing)..."
          style={{ flex: 1, padding: 10, fontSize: 14 }}
        />
        <button onClick={handleSend} style={{ padding: "10px 16px", fontSize: 14 }}>Send</button>
      </div>
    </div>
  );
}

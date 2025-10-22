import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import ChatBubble from "../components/ChatBubble";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", padding: 24 }}>
      <h2>Chat History</h2>
      <div style={{ border: "1px solid #eee", padding: 16, minHeight: 200, background: "#fff" }}>
        {messages.length === 0 && <div style={{ color: "#666" }}>No history found.</div>}
        {messages.map((m, i) => <ChatBubble key={i} sender={m.sender} text={m.text} />)}
      </div>
    </div>
  );
}

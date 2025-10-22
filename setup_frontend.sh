#!/bin/bash
echo "🚀 Setting up FinGenie frontend structure..."

mkdir -p src/{pages,services,components} && \
cat > src/services/api.js <<'EOF'
import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const sendMessage = (token, message) =>
  API.post("/chat", { message }, { headers: { Authorization: `Bearer ${token}` } });
export const getHistory = (token) =>
  API.get("/chat/history", { headers: { Authorization: `Bearer ${token}` } });

export default API;
EOF

cat > src/pages/Login.jsx <<'EOF'
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await loginUser({ email, password });
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setErr("Invalid response from server");
      }
    } catch (error) {
      setErr(error?.response?.data?.error || error.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h2>Login</h2>
      {err && <div style={{ color: "red" }}>{err}</div>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 10 }}>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>Login</button>
      </form>
      <p style={{ marginTop: 12 }}>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
EOF

cat > src/pages/Signup.jsx <<'EOF'
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signupUser({ name, email, password });
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.error || error.message || "Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h2>Sign up</h2>
      {err && <div style={{ color: "red" }}>{err}</div>}
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 10 }}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>Create account</button>
      </form>
      <p style={{ marginTop: 12 }}>Already have an account? <Link to="/">Login</Link></p>
    </div>
  );
}
EOF

cat > src/components/ChatBubble.jsx <<'EOF'
import React from "react";

export default function ChatBubble({ sender, text }) {
  const isUser = sender === "user";
  const style = {
    alignSelf: isUser ? "flex-end" : "flex-start",
    background: isUser ? "#DCF8C6" : "#FFF",
    border: "1px solid #ddd",
    padding: "8px 12px",
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: "80%",
    wordBreak: "break-word"
  };
  return (
    <div style={style}>
      <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{isUser ? "You" : "FinGenie"}</div>
      <div>{text}</div>
    </div>
  );
}
EOF

cat > src/pages/Dashboard.jsx <<'EOF'
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
    if (!token) {
      navigate("/");
      return;
    }
    (async () => {
      try {
        const res = await getHistory(token);
        if (Array.isArray(res.data)) setMessages(res.data);
        else if (res.data?.messages) setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const res = await sendMessage(token, input);
      const botText = res?.data?.response ?? "No response";
      setMessages([...messages, { sender: "user", text: input }, { sender: "bot", text: botText }]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2>FinGenie — Financial Advisor</h2>
        <div>
          <button onClick={() => navigate("/history")} style={{ marginRight: 8 }}>History</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div ref={listRef} style={{ minHeight: 320, border: "1px solid #eee", padding: 12, display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", background: "#fafafa" }}>
        {messages.map((m, i) => <ChatBubble key={i} sender={m.sender} text={m.text} />)}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about finance..." style={{ flex: 1, padding: 8 }} />
        <button onClick={handleSend} style={{ padding: "8px 12px" }}>Send</button>
      </div>
    </div>
  );
}
EOF

cat > src/pages/History.jsx <<'EOF'
import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import ChatBubble from "../components/ChatBubble";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    (async () => {
      try {
        const res = await getHistory(token);
        if (Array.isArray(res.data)) setMessages(res.data);
        else if (res.data?.messages) setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
      <h2>Chat History</h2>
      <div style={{ border: "1px solid #eee", padding: 12, minHeight: 200, background: "#fff" }}>
        {messages.map((m, i) => <ChatBubble key={i} sender={m.sender} text={m.text} />)}
      </div>
    </div>
  );
}
EOF

cat > src/App.jsx <<'EOF'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
EOF

echo "✅ Frontend scaffolding complete! Run: npm run dev"

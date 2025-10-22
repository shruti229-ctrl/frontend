import React, { useState } from "react";
import { signupUser, loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (isLogin) {
        const res = await loginUser({ email: form.email, password: form.password });
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        await signupUser(form);
        setIsLogin(true);
      }
    } catch (error) {
      setErr(error?.response?.data?.error || error.message || "Action failed");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardWrapper}>
        <div style={{ ...cardStyle, transform: isLogin ? "translateX(0%)" : "translateX(-50%)" }}>
          {/* Login Form */}
          <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Login</h2>
            {err && <div style={errStyle}>{err}</div>}
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={inputStyle} />
            <button type="submit" style={buttonStyle}>Login</button>
          </form>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Sign Up</h2>
            {err && <div style={errStyle}>{err}</div>}
            <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} style={inputStyle} />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={inputStyle} />
            <button type="submit" style={buttonStyle}>Sign Up</button>
          </form>
        </div>
      </div>

      <div style={toggleStyle}>
        <span>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", fontWeight: "bold", color: "#1976d2" }}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </span>
      </div>
    </div>
  );
}

// ---------- Styles ----------
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 64px)", // navbar height offset
  background: "#f0f2f5",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const cardWrapper = {
  width: 800,
  overflow: "hidden",
  borderRadius: 8,
  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
};

const cardStyle = {
  display: "flex",
  width: 1600, // two forms side by side
  transition: "transform 0.5s ease-in-out",
};

const formStyle = {
  width: 800,
  padding: 40,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const inputStyle = {
  padding: 12,
  fontSize: 14,
  borderRadius: 4,
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: 12,
  fontSize: 16,
  borderRadius: 4,
  border: "none",
  background: "#1976d2",
  color: "#fff",
  cursor: "pointer",
};

const toggleStyle = {
  marginTop: 20,
  fontSize: 14,
  color: "#555",
};

const errStyle = {
  color: "#f44336",
  fontSize: 14,
};

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
      {/* Background geometric pattern */}
      <div style={backgroundPattern}></div>

      <div style={cardWrapper}>
        <div
          style={{
            ...cardStyle,
            transform: isLogin ? "translateX(0%)" : "translateX(-50%)",
          }}
        >
          {/* Login Form */}
          <form onSubmit={handleSubmit} style={formStyle}>
            <h2 style={headingStyle}>Welcome Back 💖</h2>
            {err && <div style={errStyle}>{err}</div>}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Login
            </button>
          </form>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} style={formStyle}>
            <h2 style={headingStyle}>Join the Magic ✨</h2>
            {err && <div style={errStyle}>{err}</div>}
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <div style={toggleStyle}>
        <span>
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              color: "#e91e63",
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </span>
      </div>
    </div>
  );
}

// ---------- Styles ----------

const containerStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  fontFamily: "'Poppins', sans-serif",
  background: "linear-gradient(135deg, #ffafbd, #ffc3a0)",
  overflow: "hidden",
};

const backgroundPattern = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)",
  zIndex: 0,
};

const cardWrapper = {
  width: 800,
  overflow: "hidden",
  borderRadius: 20,
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 32px rgba(255, 105, 180, 0.3)",
  zIndex: 1,
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const cardStyle = {
  display: "flex",
  width: 1600, // Two forms side-by-side
  transition: "transform 0.6s ease-in-out",
};

const formStyle = {
  width: 800,
  padding: "50px 60px",
  display: "flex",
  flexDirection: "column",
  gap: 18,
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(16px)",
  color: "#fff",
  transition: "all 0.3s ease",
};

const headingStyle = {
  textAlign: "center",
  color: "#fff",
  textShadow: "0 2px 10px rgba(255,255,255,0.3)",
};

const inputStyle = {
  padding: 14,
  fontSize: 15,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.5)",
  background: "rgba(255,255,255,0.3)",
  color: "#fff",
  outline: "none",
  transition: "all 0.3s ease",
};

const buttonStyle = {
  padding: 14,
  fontSize: 16,
  borderRadius: 10,
  border: "none",
  background:
    "linear-gradient(135deg, #ff6f91, #ff8fab, #f48fb1)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  boxShadow: "0 4px 12px rgba(255, 105, 180, 0.3)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  hover: {
    transform: "scale(1.05)",
  },
};

const toggleStyle = {
  marginTop: 25,
  fontSize: 15,
  color: "#fff",
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
  zIndex: 2,
};

const errStyle = {
  color: "#ffebee",
  background: "rgba(244,67,54,0.4)",
  padding: "8px 12px",
  borderRadius: 6,
  fontSize: 14,
  textAlign: "center",
};

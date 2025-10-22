// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={navbarStyle}>
      <div style={logoStyle}>FinGenie</div>
      <div style={navLinksStyle}>
        {!token && (
          <span style={linkStyle} onClick={() => navigate("/")}>
            Login / Sign Up
          </span>
        )}
        {token && (
          <>
            <span style={linkStyle} onClick={() => navigate("/dashboard")}>
              Dashboard
            </span>
            <span style={linkStyle} onClick={() => navigate("/history")}>
              History
            </span>
            <button onClick={handleLogout} style={buttonStyle}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const navbarStyle = {
  width: "100vw",          // full viewport width
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 32px",
  background: "#1976d2",
  color: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  boxSizing: "border-box", // include padding in width
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const logoStyle = {
  fontSize: 22,
  fontWeight: "bold",
};

const navLinksStyle = {
  display: "flex",
  gap: 20,
  alignItems: "center",
};

const linkStyle = {
  cursor: "pointer",
  color: "#fff",
  fontWeight: 500,
};

const buttonStyle = {
  background: "#f44336",
  border: "none",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 4,
  cursor: "pointer",
};

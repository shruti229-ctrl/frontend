// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar should be top-level, outside any container */}
      <Navbar />
      <div style={{ width: "100%", minHeight: "calc(100vh - 64px)" }}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

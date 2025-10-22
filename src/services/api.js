import axios from "axios";

// Detect environment: local dev vs deployed frontend
const BASE_URL = (() => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000/api"; // local backend
  }
  // deployed backend URL on Render
  return "https://backend-rsxi.onrender.com/api";
})();

// Create axios instance
const API = axios.create({ baseURL: BASE_URL });

// Auth endpoints
export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Chat endpoints
export const sendMessage = (token, message) =>
  API.post("/chat", { message }, { headers: { Authorization: `Bearer ${token}` } });

export const getHistory = (token) =>
  API.get("/chat/history", { headers: { Authorization: `Bearer ${token}` } });

export default API;

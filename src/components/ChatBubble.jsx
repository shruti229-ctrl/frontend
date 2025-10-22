import React from "react";

export default function ChatBubble({ sender, text }) {
  const isUser = sender === "user";
  const style = {
    alignSelf: isUser ? "flex-end" : "flex-start",
    background: isUser ? "#DCF8C6" : "#EDEDED",
    color: "#000",
    border: "1px solid #ddd",
    padding: "10px 14px",
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
    wordBreak: "break-word",
    fontSize: 14,
    boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease-in-out",
  };
  return (
    <div style={style}>
      <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
        {isUser ? "You" : "FinGenie"}
      </div>
      <div>{text}</div>
    </div>
  );
}

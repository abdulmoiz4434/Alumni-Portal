import { useState } from "react";

import "./Networking.css";
export default function Chat() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
    { text: "Hi! I want to know about upcoming events.", sender: "user" },
    { text: "Sure! Check the Events section for all upcoming events.", sender: "bot" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    // Dummy bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Kya begay boy dekhny mey ? .", sender: "bot" },
      ]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <h1>Chat</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-input-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

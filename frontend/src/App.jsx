import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Welcome to HomeLab Helper! Paste your error logs or ask for config help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // In production, this would point to the deployed worker URL.
      // For local dev, we might need to proxy or use absolute URL if CORS allows.
      // Assuming same origin or configured CORS.
      const response = await fetch("http://localhost:8787/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "error", content: `Error: ${data.error}` },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: `Network Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>HomeLab Helper 🛠️</h1>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>
              {msg.role === "user"
                ? "You"
                : msg.role === "assistant"
                  ? "AI"
                  : "System"}
              :
            </strong>
            <pre className="message-content">{msg.content}</pre>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <em>Thinking...</em>
          </div>
        )}
      </div>
      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste ssh -vvv output or describe your setup..."
          rows={4}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8787/chat");
      const data = await res.json();
      if (data.messages && Array.isArray(data.messages)) {
        // Only override if we have history (preserve system prompt if empty)
        if (data.messages.length > 0) {
          setMessages((prev) => {
            // Keep system prompt if it exists in prev but not in data?
            // Actually server messages include system prompt if pushed?
            // The DO messages array as implemented in step 467 only pushes user/assistant.
            // It does NOT store the system prompt.
            // So we should merge: default system prompt + server messages.
            return [
              {
                role: "system",
                content:
                  "Welcome to HomeLab Helper! Paste your error logs or ask for config help.",
              },
              ...data.messages,
            ];
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch history:", e);
    }
  };

  const resetChat = async () => {
    if (!confirm("Are you sure you want to clear the chat history?")) return;
    try {
      await fetch("http://localhost:8787/chat", { method: "DELETE" });
      setMessages([
        {
          role: "system",
          content: "Chat history has been cleared.",
        },
      ]);
    } catch (e) {
      alert("Failed to reset chat");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Optimistic UI update
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
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
      <h1>
        HomeLab Helper
        <button onClick={resetChat} className="reset-btn" title="Reset Chat">
          ↺
        </button>
      </h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "Helper"}</strong>
            <div className="message-content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="message assistant">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message... (Enter to send)"
          rows={1}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

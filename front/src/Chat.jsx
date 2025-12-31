// import { useEffect, useRef, useState } from "react";

// const API_URL = "http://localhost:3001/chat/message";

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const sessionId = localStorage.getItem("sessionId");

//   // Auto scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   async function sendMessage() {
//     if (!input.trim()) return;

//     const userMessage = {
//       sender: "user",
//       text: input,
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: input,
//           sessionId,
//         }),
//       });

//       const data = await res.json();

//       if (data.sessionId) {
//         localStorage.setItem("sessionId", data.sessionId);
//       }

//       setMessages((prev) => [
//         ...prev,
//         { sender: "ai", text: data.reply },
//       ]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "ai", text: "Error connecting to server." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.chatBox}>
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             style={{
//               ...styles.message,
//               alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
//               background:
//                 msg.sender === "user" ? "#DCF8C6" : "#ffffff",
//             }}
//           >
//             {msg.text}
//           </div>
//         ))}

//         {loading && (
//           <div style={{ ...styles.message, alignSelf: "flex-start" }}>
//             AI is typing...
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       <div style={styles.inputBox}>
//         <input
//           style={styles.input}
//           value={input}
//           placeholder="Type a message..."
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           style={styles.button}
//           onClick={sendMessage}
//           disabled={loading}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     maxWidth: "500px",
//     margin: "40px auto",
//     display: "flex",
//     flexDirection: "column",
//     height: "80vh",
//     background: "#fff",
//     borderRadius: "8px",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//   },
//   chatBox: {
//     flex: 1,
//     padding: "10px",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//   },
//   message: {
//     maxWidth: "70%",
//     padding: "8px 12px",
//     borderRadius: "8px",
//     fontSize: "14px",
//   },
//   inputBox: {
//     display: "flex",
//     borderTop: "1px solid #ddd",
//   },
//   input: {
//     flex: 1,
//     padding: "10px",
//     border: "none",
//     outline: "none",
//     fontSize: "14px",
//   },
//   button: {
//     padding: "10px 16px",
//     border: "none",
//     background: "#007bff",
//     color: "#fff",
//     cursor: "pointer",
//   },
// };
import { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:3001/chat/message";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sessionId = localStorage.getItem("sessionId");

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          sessionId,
        }),
      });

      const data = await res.json();

      if (data.sessionId) {
        localStorage.setItem("sessionId", data.sessionId);
      }

      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.chatContainer}>
        {/* Header */}
        <div style={styles.header}>
          <span>🛍️ Spur Support AI</span>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(msg.sender === "user"
                  ? styles.userMessage
                  : styles.aiMessage),
              }}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.message, ...styles.aiMessage }}>
              Typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <input
            style={styles.input}
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button style={styles.sendBtn} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  chatContainer: {
    width: "400px",
    height: "600px",
    background: "#f9f9f9",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },

  header: {
    padding: "16px",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
  },

  messages: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  message: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: "14px",
    fontSize: "14px",
    lineHeight: "1.4",
  },

  userMessage: {
    alignSelf: "flex-end",
    background: "#4facfe",
    color: "#fff",
    borderBottomRightRadius: "4px",
  },

  aiMessage: {
    alignSelf: "flex-start",
    background: "#e4e6eb",
    color: "#333",
    borderBottomLeftRadius: "4px",
  },

  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
    background: "#fff",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  },

  sendBtn: {
    marginLeft: "8px",
    padding: "10px 16px",
    borderRadius: "20px",
    border: "none",
    background: "#4facfe",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

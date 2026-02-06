import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/axios";
import { useSocket } from "../../../context/SocketContext";
import "./Messaging.css";

export default function Messaging() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id || currentUser?.id;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await API.get("/messages/conversations");
        setConversations(res.data.data || []);
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!conversationId || !socket) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${conversationId}`);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };

    fetchMessages();

    socket.emit("join_conversation", conversationId);

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (data.conversationId !== conversationId) return;

      const senderId =
        typeof data.sender === "string"
          ? data.sender
          : data.sender?._id;

      if (senderId === currentUserId) return;

      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [socket, conversationId, currentUserId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    try {
      const currentChat = conversations.find(c => c._id === conversationId);
      if (!currentChat) return;

      const receiverId = currentChat.participants.find(
        p => p._id !== currentUserId
      )?._id;

      const res = await API.post("/messages/send", {
        conversationId,
        content: newMessage,
        receiverId
      });

      socket.emit("send_message", res.data.data);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <h3>Messages</h3>

        <div className="conv-list">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find(
              p => p._id !== currentUserId
            );

            return (
              <div
                key={conv._id}
                className={`conv-item ${conversationId === conv._id ? "active" : ""}`}
                onClick={() => navigate(`/dashboard/messages/${conv._id}`)}
              >
                <div className="conv-avatar">
                  {otherUser?.fullName?.charAt(0) || "?"}
                </div>

                <div className="conv-info">
                  <h4>{otherUser?.fullName || "Unknown User"}</h4>
                  <p className="last-msg">
                    {conv.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chat-main">
        {conversationId ? (
          <>
            <div className="chat-messages">
              {messages.map((m, i) => {
                const senderId =
                  typeof m.sender === "string"
                    ? m.sender
                    : m.sender?._id;

                return (
                  <div
                    key={i}
                    className={`msg-row ${
                      senderId === currentUserId ? "me" : "them"
                    }`}
                  >
                    <div className="msg-bubble">
                      {m.content}
                      <span className="msg-time">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <form className="chat-input" onSubmit={handleSend}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
              />
              <button type="submit" disabled={!newMessage.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state-icon">💬</div>
            <h3>Select a conversation to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
}
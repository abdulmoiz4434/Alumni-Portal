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
  const [activeChatUser, setActiveChatUser] = useState(null);

  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. Fetch all conversations for the sidebar
  const fetchConversations = async () => {
    try {
      const res = await API.get("/messages/conversations");
      setConversations(res.data.data || []);
    } catch (err) {
      console.error("Error fetching conversations", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [conversationId]);

  // 2. Initialize the active chat - DEBUGGED VERSION
  useEffect(() => {
    if (!conversationId || !socket) return;

    const initChat = async () => {
      try {
        const res = await API.get(`/messages/${conversationId}`);
        const { conversation, messages: chatMessages } = res.data.data;

        // Safety check to ensure the URL matches the current conversation
        if (conversation._id !== conversationId) {
          navigate(`/dashboard/messaging/${conversation._id}`, { replace: true });
          return;
        }

        setMessages(chatMessages || []);

        conversation.participants.forEach((p, index) => {
          
          const participantId = (p._id || p).toString();
          const myId = currentUserId?.toString();
          console.log(`  - Participant ID (string): "${participantId}"`);
          console.log(`  - My ID (string): "${myId}"`);
          console.log(`  - Are they equal?: ${participantId === myId}`);
          console.log(`  - Are they NOT equal?: ${participantId !== myId}`);
        });

        const otherParticipant = conversation.participants.find((p) => {
          const participantId = (p._id || p).toString();
          const myId = currentUserId?.toString();
          return participantId !== myId;
        });

        console.log("=== Found other participant ===");
        console.log("Other participant:", otherParticipant);

        if (otherParticipant) {
          // If it's a populated object with user details
          if (otherParticipant._id && otherParticipant.fullName) {
            console.log("Setting activeChatUser with populated data:", otherParticipant);
            setActiveChatUser(otherParticipant);
          } else if (otherParticipant._id) {
            // Has _id but missing other fields - treat as populated but incomplete
            console.log("Participant has _id but may be missing fields:", otherParticipant);
            setActiveChatUser(otherParticipant);
          } else {
            // It's just an ID string, fetch full details
            console.warn("Participant is just an ID string, fetching details...");
            try {
              const userRes = await API.get(`/auth/user/${otherParticipant}`);
              setActiveChatUser(userRes.data.data);
            } catch (err) {
              console.error("Failed to fetch user details:", err);
              setActiveChatUser({ _id: otherParticipant, fullName: "Unknown User" });
            }
          }
        } else {
          console.error("Could not find other participant");
          console.error("Current user ID:", currentUserId);
          console.error("Participants:", conversation.participants);
          setActiveChatUser(null);
        }

      } catch (err) {
        console.error("Error initializing chat", err);
      }
    };

    initChat();
    socket.emit("join_conversation", conversationId);

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId, socket, currentUserId, navigate]);

  // 3. Socket listener for real-time messages
useEffect(() => {
  if (!socket) return;

  const handleReceiveMessage = (data) => {
    console.log("📨 Received message via socket:", data);
    if (data.conversationId === conversationId) {
      setMessages((prev) => {
        const exists = prev.some(m => m._id === data._id);
        if (exists) {
          console.log("⚠️ Message already in state, skipping");
          return prev;
        }
        console.log("✅ Adding message to state");
        return [...prev, data];
      });
    }
    fetchConversations();
  };

  socket.on("receive_message", handleReceiveMessage);
  return () => socket.off("receive_message", handleReceiveMessage);
}, [socket, conversationId]);

  // 4. Handle sending messages
  const handleSend = async (e) => {
  e.preventDefault();
  if (!newMessage.trim() || !conversationId) return;

  try {
    let receiverId = activeChatUser?._id;

    if (!receiverId) {
      const currentChat = conversations.find((c) => c._id === conversationId);
      const otherParticipant = currentChat?.participants.find(
        (p) => {
          const pId = (p._id || p).toString();
          return pId !== currentUserId.toString();
        }
      );
      receiverId = otherParticipant?._id || otherParticipant;
    }

    // 1. Create message via API
    const res = await API.post("/messages/send", {
      conversationId,
      content: newMessage,
      receiverId: receiverId?.toString(),
    });

    const sentMsg = res.data.data;
    
    // 2. Emit to socket for real-time delivery (don't add to state here)
    socket.emit("send_message", sentMsg);
    
    // 3. Clear input
    setNewMessage("");
    
    // 4. Refresh conversation list
    fetchConversations();
  } catch (err) {
    console.error("Failed to send message", err);
  }
};

  return (
    <div className="chat-layout">
      {/* SIDEBAR */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Messages</h3>
        </div>

        <div className="conv-list">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const otherUser = conv.participants.find((p) => {
                const pId = (p._id || p).toString();
                return pId !== currentUserId.toString();
              });

              return (
                <div
                  key={conv._id}
                  className={`conv-item ${conversationId === conv._id ? "active" : ""}`}
                  onClick={() => navigate(`/dashboard/messaging/${conv._id}`)}
                >
                  <div className="conv-avatar">
                    {otherUser?.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>

                  <div className="conv-info">
                    <div className="conv-info-top">
                      <h4>{otherUser?.fullName || "Unknown User"}</h4>
                    </div>
                    <p className="last-msg">
                      {typeof conv.lastMessage === "object"
                        ? conv.lastMessage.content
                        : conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-convs">No conversations yet</p>
          )}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="chat-main">
        {conversationId ? (
          <>
            <div className="chat-header">
              {activeChatUser ? (
                <div className="header-content">
                  <div className="header-avatar">
                    {activeChatUser.profilePicture ? (
                      <img src={activeChatUser.profilePicture} alt="profile" />
                    ) : (
                      <span>{activeChatUser.fullName?.charAt(0).toUpperCase() || "?"}</span>
                    )}
                  </div>
                  <div className="header-text">
                    <h4>{activeChatUser.fullName || "Unknown User"}</h4>
                    <p>{activeChatUser.role || "Member"}</p>
                  </div>
                </div>
              ) : (
                <h4>Loading chat...</h4>
              )}
            </div>

            <div className="chat-messages">
              {messages.map((m, i) => {
                const senderId = typeof m.sender === "string" ? m.sender : m.sender?._id;
                const isMe = senderId.toString() === currentUserId.toString();

                return (
                  <div key={m._id || i} className={`msg-row ${isMe ? "me" : "them"}`}>
                    <div className="msg-bubble">
                      <p>{m.content}</p>
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
                placeholder="Type your message..."
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
            <p>Connect with alumni and students across the portal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
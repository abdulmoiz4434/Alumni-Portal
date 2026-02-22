// Messaging.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/axios";
import { Loader } from "lucide-react";
import * as socketService from "../../../services/socketService";
import "./Messaging.css";

export default function Messaging() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id || currentUser?.id;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  const scrollRef = useRef(null);

  // Socket.IO: connect on mount with JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = socketService.connect(token);
    if (!socket) return;

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (socket.connected) setSocketConnected(true);

    return () => {
      if (socket) {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      }
    };
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, loading, conversationId]);

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

  // Initialize active chat and messages (HTTP)
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const initChat = async () => {
      try {
        const res = await API.get(`/messages/${conversationId}`);
        const { conversation, messages: chatMessages } = res.data.data || {};

        if (!conversation) {
          setMessages([]);
          setActiveChatUser(null);
          setLoading(false);
          return;
        }

        const convId = conversation._id || conversation.id;
        if (convId !== conversationId) {
          navigate(`/modules/messaging/${convId}`, { replace: true });
          return;
        }

        setMessages(chatMessages || []);

        const otherParticipantId = conversation.participants?.find(
          (p) => (p._id || p.id || p).toString() !== currentUserId?.toString(),
        );

        if (otherParticipantId) {
          const id =
            otherParticipantId._id ||
            otherParticipantId.id ||
            otherParticipantId;
          if (typeof id === "string") {
            try {
              const userRes = await API.get(`/auth/user/${id}`);
              setActiveChatUser(userRes.data.data);
            } catch {
              setActiveChatUser({ _id: id, fullName: "Unknown User" });
            }
          } else {
            setActiveChatUser(otherParticipantId);
          }
        } else {
          setActiveChatUser(null);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error initializing chat", err);
        setLoading(false);
      }
    };

    initChat();
  }, [conversationId, currentUserId, navigate]);

  // Socket.IO: join conversation room and listen for message:new
  useEffect(() => {
    if (!conversationId) return;

    socketService.joinConversation(conversationId);

    const unsubscribe = socketService.on("message:new", (payload) => {
      setMessages((prev) => {
        const exists = prev.some((m) => (m.id || m._id) === payload.id);
        if (exists) return prev;
        return [...prev, payload];
      });
      fetchConversations();
    });

    return () => {
      unsubscribe();
      socketService.leaveConversation(conversationId);
    };
  }, [conversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    socketService.sendMessage(conversationId, newMessage);
    setNewMessage("");
  };

  return (
    <div className="messaging">
      <div className={`chat-layout ${conversationId ? "chat-open" : ""}`}>
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h3>Messages</h3>
          </div>

          <div className="conv-list">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                // Improved identification logic for the other user
                const otherParticipant = conv.participants?.find(
                  (p) => (p._id || p.id || p).toString() !== currentUserId?.toString()
                );
                
                const displayName = otherParticipant?.fullName || "Unknown User";
                const displayInitial = displayName.charAt(0).toUpperCase();
                const convId = conv._id || conv.id;
                const profilePic = otherParticipant?.profilePicture;

                return (
                  <div
                    key={convId}
                    className={`conv-item ${conversationId === convId ? "active" : ""}`}
                    onClick={() => navigate(`/modules/messaging/${convId}`)}
                  >
                    <div className="conv-avatar">
                      {profilePic ? (
                        <img 
                          src={profilePic} 
                          alt={displayName} 
                          className="sidebar-avatar-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerText = displayInitial;
                          }}
                        />
                      ) : (
                        displayInitial
                      )}
                    </div>

                    <div className="conv-info">
                      <div className="conv-info-top">
                        <h4>{displayName}</h4>
                      </div>
                      <p className="last-msg">
                        {conv.last_message_content || "Start a conversation"}
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

        <div className="chat-main">
          {loading ? (
            <div className="mentorship-loading">
              <Loader className="loading-spinner" />
              <p>Loading chat...</p>
            </div>
          ) : conversationId ? (
            <>
              <div className="chat-header">
                <button
                  className="messaging-back-btn"
                  onClick={() => navigate("/modules/messaging")}
                  aria-label="Back to conversations"
                >
                  ←
                </button>

                {activeChatUser ? (
                  <div className="header-content">
                    <div className="header-avatar">
                      {activeChatUser.profilePicture ? (
                        <img
                          src={activeChatUser.profilePicture}
                          alt="profile"
                        />
                      ) : (
                        <span>
                          {activeChatUser.fullName?.charAt(0).toUpperCase() || "?"}
                        </span>
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
                  const senderId = m.sender_id || m.sender?._id || m.sender?.id || m.sender;
                  const isMe = senderId?.toString() === currentUserId?.toString();

                  return (
                    <div
                      key={m.id || m._id || i}
                      className={`msg-row ${isMe ? "me" : "them"}`}
                    >
                      <div className="msg-bubble">
                        <p>{m.content}</p>
                        <span className="msg-time">
                          {new Date(m.created_at || m.createdAt).toLocaleTimeString([], {
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
    </div>
  );
}
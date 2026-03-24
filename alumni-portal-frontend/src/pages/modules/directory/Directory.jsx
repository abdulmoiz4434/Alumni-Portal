import { useState, useEffect } from "react";
import { Search, UserPlus, CheckCircle, MessageCircle, Trash2, User, Loader } from "lucide-react";
import API from "../../../api/axios";
import { Toast, useToast } from "../profile/Toast";
import "./Directory.css";

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn confirm-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sentRequests, setSentRequests] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id || currentUser?.id;
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await API.get("/auth/all-users");
        const filteredUsers = (usersRes.data.data || []).filter(
          (user) => user.role !== "admin"
        );
        setUsers(filteredUsers);

        if (!isAdmin) {
          const statusRes = await API.get("/connections/status");
          const { pending, connected } = statusRes.data.data;
          setSentRequests(pending || []);
          setConnectedUsers(connected || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load directory data.");
        addToast("Failed to load directory data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const handleConnectRequest = async (targetUserId) => {
    try {
      const res = await API.post("/connections/send", {
        receiverId: targetUserId,
      });

      if (res.data.success) {
        setSentRequests((prev) => [...prev, targetUserId]);
        addToast("Connection request sent successfully!", "success");
      }
    } catch (err) {
      console.error("Error sending request:", err);
      addToast(
        err.response?.data?.message || "Failed to send request. It might already be pending.",
        "error"
      );
    }
  };

  const handleDeleteUser = (userId, userName) => {
    setConfirmDialog({ userId, userName });
  };

  const confirmDelete = async () => {
    const { userId, userName } = confirmDialog;
    setConfirmDialog(null);
    try {
      const res = await API.delete(`/auth/delete-user/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        addToast(`${userName} has been deleted successfully.`, "success");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      addToast(err.response?.data?.message || "Failed to delete user.", "error");
    }
  };

  const filteredUsers = users.filter((user) => {
    if (user._id === currentUserId) return false;

    const matchesFilter = filter === "all" || user.role === filter;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      user.fullName?.toLowerCase().includes(search) ||
      (user.department && user.department.toLowerCase().includes(search));

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="directory">
        <div className="directory-loading">
          <Loader className="loading-spinner" />
          <p>Loading directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="directory">
        <div className="directory-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="directory">
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message={`Are you sure you want to delete ${confirmDialog.userName}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      <div className="directory-hero">
        <div className="directory-hero-content">
          <h1 className="directory-title">Directory Listing</h1>
          <p className="directory-subtitle">
            Connect with alumni and students to grow your network for future success.
          </p>
        </div>
      </div>

      <div className="directory-container">
        <div className="directory-search-filter-section">
          <div className="search-box">
            <Search size={22} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            {["all", "alumni", "student"].map((type) => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? "active" : ""}`}
                onClick={() => setFilter(type)}
              >
                {type === "all"
                  ? "All Members"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="results-info">
          <p>
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "member" : "members"} found
          </p>
        </div>

        <div className="directory-grid">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isRequestSent = sentRequests.includes(user._id);
              const isConnected = connectedUsers.includes(user._id);

              return (
                <article key={user._id} className="directory-card">
                  {isAdmin && (
                    <button
                      className="directory-delete-btn"
                      onClick={() => handleDeleteUser(user._id, user.fullName)}
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  <div className="directory-card-header">
                    <div className="directory-avatar-wrapper">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.fullName}
                          className="directory-avatar"
                        />
                      ) : (
                        <div className="directory-avatar-placeholder">
                          <User size={40} />
                        </div>
                      )}
                    </div>
                    <span className={`directory-role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="directory-card-body">
                    <h3 className="directory-name">{user.fullName}</h3>
                    <p className="directory-dept">
                      {user.department || "Department not listed"}
                    </p>
                  </div>

                  <div className="directory-card-footer">
                    {!isAdmin && (
                      <>
                        {isConnected ? (
                          <button
                            className="directory-message-btn connected"
                            disabled
                          >
                            <MessageCircle size={18} /> Connected
                          </button>
                        ) : isRequestSent ? (
                          <button
                            className="directory-message-btn sent"
                            disabled
                          >
                            <CheckCircle size={18} /> Sent
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConnectRequest(user._id)}
                            className="directory-message-btn"
                          >
                            <UserPlus size={18} /> Connect
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No members found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
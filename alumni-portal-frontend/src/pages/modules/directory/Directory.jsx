import { useState, useEffect } from "react";
import { Search, UserPlus, CheckCircle } from "lucide-react"; // Added icons for feedback
import API from "../../../api/axios";
import "./Directory.css";

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  // NEW: State to track which users have been sent a request during this session
  const [sentRequests, setSentRequests] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/all-users");
        setUsers(res.data.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // NEW: Updated function to send a connection request instead of starting a chat
  const handleConnectRequest = async (targetUserId) => {
    try {
      const res = await API.post("/connections/send", { 
        receiverId: targetUserId 
      });

      if (res.data.success) {
        // Add to sentRequests to update button UI locally
        setSentRequests((prev) => [...prev, targetUserId]);
        alert("Connection request sent successfully!");
      }
    } catch (err) {
      console.error("Error sending request:", err);
      alert(err.response?.data?.message || "Failed to send request. It might already be pending.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const isSelf = user._id === currentUserId;
    if (isSelf) return false;

    const matchesFilter = filter === "all" || user.role === filter;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      user.fullName?.toLowerCase().includes(search) ||
      (user.department && user.department.toLowerCase().includes(search));

    return matchesFilter && matchesSearch;
  });

  if (loading) return <div className="directory-loader">Loading community...</div>;

  return (
    <div className="directory">
      {/* ... Hero section remains the same ... */}
      <div className="directory-hero">
        <div className="directory-hero-content">
          <h1 className="directory-title">Directory Listing</h1>
          <p className="directory-subtitle">
            Connect with alumni and students to grow your network for future success.
          </p>
        </div>
      </div>

      <div className="directory-container">
        <div className="directory-controls">
          <div className="search-filter-section">
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
                  {type === "all" ? "All Members" : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="results-info">
          <p>{filteredUsers.length} {filteredUsers.length === 1 ? "member" : "members"} found</p>
        </div>

        <div className="directory-grid">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isRequestSent = sentRequests.includes(user._id);

              return (
                <article key={user._id} className="directory-card">
                  <div className="directory-card-header">
                    <div className="directory-avatar-wrapper">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.fullName} className="directory-avatar" />
                      ) : (
                        <div className="directory-avatar-placeholder">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className={`directory-role-badge ${user.role}`}>{user.role}</span>
                  </div>

                  <div className="directory-card-body">
                    <h3 className="directory-name">{user.fullName}</h3>
                    <p className="directory-dept">{user.department || "Department not listed"}</p>
                  </div>

                  <div className="directory-card-footer">
                    <button
                      onClick={() => handleConnectRequest(user._id)}
                      className={`directory-message-btn ${isRequestSent ? "sent" : ""}`}
                      disabled={isRequestSent}
                    >
                      {isRequestSent ? (
                        <>
                          <CheckCircle size={18} /> Sent
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} /> Connect
                        </>
                      )}
                    </button>
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
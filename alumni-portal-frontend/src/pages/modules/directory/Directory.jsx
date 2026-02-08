import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { startConversation } from "../../../api/messages";
import API from "../../../api/axios";
import "./Directory.css";

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // Get current user info for RBAC checks
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserRole = currentUser?.role;
  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/all-users");
        setUsers(res.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleStartChat = async (targetUser) => {
    if (targetUser.role === "admin" && currentUserRole !== "admin") {
      alert("Unauthorized: You cannot message the administrative account.");
      return;
    }

    try {
      const res = await startConversation(targetUser._id);

      if (res.data.success && res.data.data) {
        navigate(`/modules/messaging/${res.data.data._id}`);
      } else {
        alert("Could not start conversation");
      }
    } catch (err) {
      console.error("Error starting chat:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const isSelf = user._id === currentUserId;
    const isAdminVisible = currentUserRole === "admin" || user.role !== "admin";
    
    if (isSelf || !isAdminVisible) return false;
    const matchesFilter = filter === "all" || user.role === filter;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      user.fullName.toLowerCase().includes(search) ||
      (user.department && user.department.toLowerCase().includes(search));

    return matchesFilter && matchesSearch;
  });

  if (loading)
    return <div className="directory-loader">Loading community...</div>;

  return (
    <div className="directory">
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
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Members
              </button>
              <button
                className={`filter-btn ${filter === "alumni" ? "active" : ""}`}
                onClick={() => setFilter("alumni")}
              >
                Alumni
              </button>
              <button
                className={`filter-btn ${filter === "student" ? "active" : ""}`}
                onClick={() => setFilter("student")}
              >
                Students
              </button>
              {/* Only show Admin filter to other Admins */}
              {currentUserRole === "admin" && (
                <button
                  className={`filter-btn ${filter === "admin" ? "active" : ""}`}
                  onClick={() => setFilter("admin")}
                >
                  Admins
                </button>
              )}
            </div>
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
            filteredUsers.map((user) => (
              <article key={user._id} className="directory-card">
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
                        {user.fullName.charAt(0).toUpperCase()}
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

                  {user.role === "alumni" && user.graduationYear && (
                    <p className="directory-meta">Class of {user.graduationYear}</p>
                  )}
                  {user.role === "student" && (user.batch || user.semester) && (
                    <p className="directory-meta">Batch {user.batch || user.semester}</p>
                  )}
                </div>

                <div className="directory-card-footer">
                  <button
                    onClick={() => handleStartChat(user)}
                    className="directory-message-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Connect
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No members found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
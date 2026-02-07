import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { startConversation } from "../../../api/messages";
import API from "../../../api/axios";
import "./Networking.css";

export default function Networking() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); 
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/all-users");
      setUsers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  fetchUsers();
}, []);

  const handleStartChat = async (receiverId) => {
  try {
    const res = await startConversation(receiverId);

    if (res.data.success && res.data.data) {
      const conversationId = res.data.data._id;
      navigate(`/dashboard/messaging/${res.data.data._id}`);
    } else {
      alert("Could not start conversation");
    }
  } catch (err) {
    console.error("Error starting chat:", err);
    alert("Something went wrong. Please try again.");
  }
};
  const filteredUsers = (users ?? []).filter((user) => {
  const matchesFilter = filter === "all" || user.role === filter;
  const search = searchTerm.toLowerCase();
  const matchesSearch =
    user.fullName.toLowerCase().includes(search) ||
    (user.department && user.department.toLowerCase().includes(search));
  return matchesFilter && matchesSearch;
});

  if (loading) return <div className="loader">Loading community...</div>;

  return (
    <div className="networking-page">
      <header className="networking-header">
        <h1>Networking Hub</h1>
        <p>Connect with Alumni and fellow Students</p>
      </header>

      <div className="networking-controls">
        <input
          type="text"
          placeholder="Search by name or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="filter-buttons">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'alumni' ? 'active' : ''} onClick={() => setFilter('alumni')}>Alumni</button>
          <button className={filter === 'student' ? 'active' : ''} onClick={() => setFilter('student')}>Students</button>
        </div>
      </div>

      <div className="user-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} />
                ) : (
                  <div className="avatar-placeholder">{user.fullName.charAt(0)}</div>
                )}
              </div>
              <div className="user-info">
                <h3>{user.fullName}</h3>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
                
                {/* Added University Specific Info */}
                <p className="user-dept">{user.department || "No Department listed"}</p>
                {user.role === 'alumni' && <p className="user-meta">Class of {user.graduationYear}</p>}
                {user.role === 'student' && <p className="user-meta">Batch {user.batch || user.semester}</p>}
                
                <button 
                  onClick={() => handleStartChat(user._id)}
                  className="message-btn"
                >
                  Message
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No members found matching your search.</p>
        )}
      </div>
    </div>
  );
}
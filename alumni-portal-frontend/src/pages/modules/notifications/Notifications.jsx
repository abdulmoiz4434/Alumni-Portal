import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { FiUserPlus, FiBookOpen, FiCheck, FiX, FiMessageSquare, FiArrowLeft } from "react-icons/fi";
import API from "../../../api/axios"; 
import "./Notifications.css";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("connections");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Endpoint logic: depending on activeTab, fetch from /connections or /mentorship
      const endpoint = activeTab === "connections" ? "/connections/requests" : "/mentorship/requests";
      const response = await API.get(endpoint);
      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const endpoint = activeTab === "connections" 
        ? `/connections/requests/${requestId}/${action}` 
        : `/mentorship/requests/${requestId}/${action}`;
      
      await API.patch(endpoint);
      // Remove the request from UI after action
      setRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (error) {
      console.error("Action Error:", error);
      alert("Action failed. Please try again.");
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1>Notifications Center</h1>
        <p>Manage your pending invitations and mentorship applications</p>
      </div>

      <div className="notifications-tabs">
        <button 
          className={`tab-btn ${activeTab === "connections" ? "active" : ""}`}
          onClick={() => setActiveTab("connections")}
        >
          <FiUserPlus /> Connection Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === "mentorship" ? "active" : ""}`}
          onClick={() => setActiveTab("mentorship")}
        >
          <FiBookOpen /> Mentorship Requests
        </button>
      </div>

      <div className="notifications-list">
        {loading ? (
          <div className="notif-loader">
            <div className="spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          requests.map((req) => {
            // --- LOGIC CHANGE START ---
            // Determine who the requester is based on the active tab
            // Connection model uses 'sender', Mentorship model uses 'student'
            const requester = req.sender || req.student;
            // --- LOGIC CHANGE END ---

            return (
              <div key={req._id} className="request-card">
                <div className="req-user-info">
                  <img 
                    src={requester?.profilePicture || "/default-avatar.png"} 
                    alt={requester?.fullName || "User"} 
                    className="req-avatar" 
                  />
                  <div className="req-details">
                    <h3>{requester?.fullName || "Unknown User"}</h3>
                    <p>
                      {requester?.role} • {activeTab === "connections" ? "wants to connect" : "applied for mentorship"}
                    </p>
                    {req.message && <p className="req-message">"{req.message}"</p>}
                  </div>
                </div>
                
                <div className="req-actions">
                  <button className="btn-accept" onClick={() => handleAction(req._id, "accept")}>
                    <FiCheck /> Accept
                  </button>
                  <button className="btn-reject" onClick={() => handleAction(req._id, "reject")}>
                    <FiX /> Decline
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <FiMessageSquare size={48} />
            <p>No pending {activeTab === "connections" ? "connection requests" : "mentorship applications"} at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUserPlus,
  FiBookOpen,
  FiCheck,
  FiX,
  FiMessageSquare,
  FiArrowLeft,
} from "react-icons/fi";
import { User } from "lucide-react";

import API from "../../../api/axios";
import "./Notifications.css";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("connections");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isStudent = user.role === "student";
  const isAdmin = user.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      navigate(-1);
      return;
    }
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const endpoint =
        activeTab === "connections"
          ? "/connections/requests"
          : "/mentorship/requests";
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
      const endpoint =
        activeTab === "connections"
          ? `/connections/requests/${requestId}/${action}`
          : `/mentorship/requests/${requestId}/${action}`;

      await API.patch(endpoint);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      window.dispatchEvent(new Event("notificationUpdate"));
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

        {!isStudent && (
          <button
            className={`tab-btn ${activeTab === "mentorship" ? "active" : ""}`}
            onClick={() => setActiveTab("mentorship")}
          >
            <FiBookOpen /> Mentorship Requests
          </button>
        )}
      </div>

      <div className="notifications-list">
        {loading ? (
          <div className="notif-loader">
            <div className="spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          requests.map((req) => {
            const requester = req.sender || req.student;
            const isMentorship = activeTab === "mentorship";
            const studentProfile = req.studentProfile;

            return (
              <div key={req._id} className="request-card">
                <div className="req-user-info">
                  <div className="req-avatar-wrapper">
                    {requester?.profilePicture ? (
                      <img
                        src={requester.profilePicture}
                        alt={requester.fullName}
                        className="req-avatar"
                      />
                    ) : (
                      <div className="req-avatar-placeholder">
                        <User size={36} />
                      </div>
                    )}
                  </div>

                  <div className="req-details">
                    <h3>{requester?.fullName || "Unknown User"}</h3>
                    <p className="req-role">
                      {requester?.role} •{" "}
                      {isMentorship
                        ? "applied for mentorship"
                        : "wants to connect"}
                    </p>

                    {isMentorship && studentProfile && (
                      <div className="student-details">
                        <div className="detail-row">
                          <span className="detail-label">Degree:</span>
                          <span className="detail-value">
                            {studentProfile.degree || "N/A"}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Department:</span>
                          <span className="detail-value">
                            {studentProfile.department || "N/A"}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Semester:</span>
                          <span className="detail-value">
                            {studentProfile.semester || "N/A"}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">CGPA:</span>
                          <span className="detail-value">
                            {studentProfile.cgpa
                              ? studentProfile.cgpa.toFixed(2)
                              : "N/A"}
                          </span>
                        </div>
                        {studentProfile.skills &&
                          studentProfile.skills.length > 0 && (
                            <div className="detail-row skills-row">
                              <span className="detail-label">Skills:</span>
                              <div className="skills-tags">
                                {studentProfile.skills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="notification-skill-tag"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    {req.message && (
                      <p className="req-message">"{req.message}"</p>
                    )}
                  </div>
                </div>

                <div className="req-actions">
                  <button
                    className="btn-accept"
                    onClick={() => handleAction(req._id, "accept")}
                  >
                    <FiCheck /> Accept
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleAction(req._id, "reject")}
                  >
                    <FiX /> Decline
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <FiMessageSquare size={48} />
            <p>
              No pending{" "}
              {activeTab === "connections"
                ? "connection requests"
                : "mentorship applications"}{" "}
              at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import API from "../../api/axios";
import "./Topbar.css";

export default function Topbar() {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
  fetchNotificationCount();

  const interval = setInterval(fetchNotificationCount, 30000);

  const handleUpdate = () => fetchNotificationCount();
  window.addEventListener('notificationUpdate', handleUpdate);
  
  return () => {
    clearInterval(interval);
    window.removeEventListener('notificationUpdate', handleUpdate);
  };
}, []);

  const fetchNotificationCount = async () => {
    try {
      const response = await API.get("/connections/notification-count");
      if (response.data.success) {
        setNotificationCount(response.data.data.total);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  const handleNotificationClick = () => {
    navigate("/modules/notifications");
    // Optionally refresh count after navigating
    setTimeout(fetchNotificationCount, 1000);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <img
          src="/Round-Logo-USP.png"
          alt="University Logo"
          className="topbar-logo-img"
        />
        <h2 className="topbar-logo">Alumni Portal</h2>
      </div>

      <div className="topbar-welcome">
        Alumni Portal of University of Southern Punjab, Multan
      </div>

      <div className="topbar-right">
        <button 
          className="notification-btn" 
          onClick={handleNotificationClick}
          title="Notifications"
        >
          <FiBell size={22} />
          {notificationCount > 0 && (
            <span className="notification-badge">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
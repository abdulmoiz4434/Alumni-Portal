import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import API from "../../api/axios";
import "./Topbar.css";

export default function Topbar() {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  useEffect(() => {
    if (isAdmin) return;

    fetchNotificationCount();

    const interval = setInterval(fetchNotificationCount, 30000);
    window.addEventListener("notificationUpdate", fetchNotificationCount);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationUpdate", fetchNotificationCount);
    };
  }, [isAdmin]);

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
    setTimeout(fetchNotificationCount, 1000);
  };

  return (
    <header className="topbar">
      <Link to="/modules" className="topbar-left">
        <img
          src="/Round-Logo-USP.png"
          alt="University Logo"
          className="topbar-logo-img"
        />
        <h2 className="topbar-logo">Alumni Portal</h2>
      </Link>

      <div className="topbar-welcome">
        Alumni Portal of University of Southern Punjab, Multan
      </div>

      <div className="topbar-right">
        {!isAdmin && (
          <button
            className="notification-btn"
            onClick={handleNotificationClick}
            title="Notifications"
          >
            <FiBell size={26} />
            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
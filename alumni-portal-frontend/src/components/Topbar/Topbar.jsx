import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import "./Topbar.css";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      {/* Left side: logo + title */}
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
          // FIX: Updated path to match App.jsx nesting
          onClick={() => navigate("/modules/notifications")} 
          title="Notifications"
        >
          <FiBell size={22} />
          <span className="notification-badge" />
        </button>
      </div>
    </header>
  );
}
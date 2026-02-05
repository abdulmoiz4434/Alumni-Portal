import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/", { replace: true });
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="menu-btn" onClick={() => setIsOpen(true)}>
        <Menu size={26} />
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Sidebar */}
  <aside className={`sidebar ${isOpen ? "open" : ""}`}>
  {/* Close button (mobile only) */}


        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end onClick={closeSidebar}>
            Dashboard
          </NavLink>

          <NavLink to="/dashboard/profile" onClick={closeSidebar}>
            Profile
          </NavLink>

          <NavLink to="/dashboard/events" onClick={closeSidebar}>
            Events
          </NavLink>

          <NavLink to="/dashboard/jobs" onClick={closeSidebar}>
            Jobs / Internships
          </NavLink>

          <NavLink to="/dashboard/mentorship" onClick={closeSidebar}>
            Mentorship
          </NavLink>

          <NavLink to="/dashboard/networking" onClick={closeSidebar}>
            Networking
          </NavLink>

          <NavLink to="/dashboard/stories" onClick={closeSidebar}>
            Success Stories
          </NavLink>

          <button onClick={handleLogout}>Logout</button>
        </nav>
      </aside>
    </>
  );
}

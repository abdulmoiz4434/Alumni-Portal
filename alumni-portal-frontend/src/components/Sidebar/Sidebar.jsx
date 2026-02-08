import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Check role before clearing storage
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);

    if (isAdmin) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button className="menu-btn" onClick={() => setIsOpen(true)}>
        <Menu size={26} />
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          <NavLink to="/modules" end onClick={closeSidebar}>
            Dashboard
          </NavLink>

          <NavLink to="/modules/profile" onClick={closeSidebar}>
            Profile
          </NavLink>

          <NavLink to="/modules/events" onClick={closeSidebar}>
            Events
          </NavLink>

          <NavLink to="/modules/jobs" onClick={closeSidebar}>
            Jobs / Internships
          </NavLink>

          <NavLink to="/modules/mentorship" onClick={closeSidebar}>
            Mentorship
          </NavLink>

          <NavLink to="/modules/directory" onClick={closeSidebar}>
            Directory
          </NavLink>

          <NavLink to="/modules/messaging" onClick={closeSidebar}>
            Messages
          </NavLink>

          <NavLink to="/modules/careerInsights" onClick={closeSidebar}>
            Career Insights
          </NavLink>

          <NavLink to="/modules/stories" onClick={closeSidebar}>
            Success Stories
          </NavLink>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}

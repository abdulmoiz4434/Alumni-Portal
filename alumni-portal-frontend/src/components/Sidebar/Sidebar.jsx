import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end>Dashboard</NavLink>
          <NavLink to="/dashboard/profile">Profile</NavLink>
          <NavLink to="/dashboard/events">Events</NavLink>
          <NavLink to="/dashboard/jobs">Jobs / Internships</NavLink>
          <NavLink to="/dashboard/mentorship">Mentorship</NavLink>
          <NavLink to="/dashboard/networking">Networking</NavLink>
          <NavLink to="/dashboard/stories">Success Stories</NavLink>
          <button>Logout</button>
        </nav>
      </aside>
    </>
  );
}

import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      {/* Top navigation bar */}
      <Topbar />

      {/* Dashboard body */}
      <div className="body">
        <Sidebar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

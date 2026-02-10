import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Footer from "../../components/Footer/Footer";
import "./Layout.css";

export default function Layout() {
  const location = useLocation();

  // Hide footer on messages routes
  const hideFooter = location.pathname.startsWith("/modules/messaging");

  return (
    <div className="layout">
      <Topbar />

      <div className="body">
        <Sidebar />

        <main className="content">
          <div className="content-wrapper">
            <div className="content-main">
              <Outlet />
            </div>

            {/* Render footer only when allowed */}
            {!hideFooter && <Footer />}
          </div>
        </main>
      </div>
    </div>
  );
}

import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Footer from "../../components/Footer/Footer";
import "./Layout.css";

export default function Layout() {
  const location = useLocation();
  const contentRef = useRef(null);

  // Hide footer on messages routes
  const hideFooter = location.pathname.startsWith("/modules/messaging");

  // Scroll to top on route change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "instant" 
      });
    }
  }, [location.pathname]);

  return (
    <div className="layout">
      <Topbar />

      <div className="body">
        <Sidebar />

        <main
          ref={contentRef}
          className={`content ${hideFooter ? "no-scroll" : ""}`}
        >
          <div className="content-wrapper">
            <div className="content-main">
              <Outlet />
            </div>

            {!hideFooter && <Footer />}
          </div>
        </main>
      </div>
    </div>
  );
}

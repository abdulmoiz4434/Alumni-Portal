import { Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Footer from "../../components/Footer/Footer";
import "./Layout.css";

export default function Layout() {
  const location = useLocation();
  const contentRef = useRef(null);
  
  // 1. Detect if we are in a specific chat (e.g., /modules/messaging/123)
  // This regex checks if there is something after the base messaging path
  const isInsideSpecificChat = /^\/modules\/messaging\/.+/.test(location.pathname);
  const isMessagingBase = location.pathname.startsWith("/modules/messaging");

  // Hide footer on all messaging routes
  const hideFooter = isMessagingBase;

  // 2. Hide Navigation elements when inside a specific chat on mobile
  const hideNavForChat = isInsideSpecificChat;

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "instant" 
      });
    }
  }, [location.pathname]);

  return (
    <div className={`layout ${hideNavForChat ? "is-chat-active" : ""}`}>
      {/* Hide Topbar entirely when in a specific chat */}
      {!hideNavForChat && <Topbar />}

      <div className="body">
        {/* We pass a prop or use CSS to hide the hamburger icon in Sidebar */}
        <Sidebar hideHamburger={hideNavForChat} />

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
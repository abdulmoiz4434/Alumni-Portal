import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Footer from "../../components/Footer/Footer";
import "./Layout.css";

export default function Layout() {
  const location = useLocation();
  const contentRef = useRef(null);
  
  // Changed from 768 to 480 to target PHONES only
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isInsideSpecificChat = /^\/modules\/messaging\/.+/.test(location.pathname);
  const isMessagingBase = location.pathname.startsWith("/modules/messaging");

  const hideFooter = isMessagingBase;

  // Now this only becomes true on small mobile screens
  const hideNavForChat = isInsideSpecificChat && isPhone;

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
      {!hideNavForChat && <Topbar />}

      <div className="body">
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
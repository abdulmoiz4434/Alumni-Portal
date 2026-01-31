import "./Topbar.css";

export default function Topbar() {
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
      {/* Sliding welcome text */}
      <div className="topbar-welcome">
        Welcome to the Alumni Portal of University of Southern Punjab, Multan
      </div>

      {/* Right side: notifications, social icons, logout */}
      <div className="topbar-right">
        <div className="topbar-social">
          <a
            href="https://www.linkedin.com/school/uspmultan/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img src="/icons/linkedin-linked-in.svg" alt="LinkedIn" />
          </a>
          <a
            href="https://www.instagram.com/uspofficialmultan?igsh=ZDY4eTllbzlqNms1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img src="/icons/instagram-2-1-logo.svg" alt="Instagram" />
          </a>
          <a
            href="https://www.facebook.com/share/1EvDXpD6Gv/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <img src="/icons/facebook.svg" alt="Facebook" />
          </a>
        </div>
      </div>
    </header>
  );
}

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
      Alumni Portal of University of Southern Punjab, Multan
      </div>
    </header>
  );
}

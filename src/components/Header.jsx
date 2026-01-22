import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header
      className="hero-header"
      style={{
        height: "10vh",            // header ~10% of viewport height
        minHeight: "60px",         // ensure not too small on mobile
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left: small Ramanujan image */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src="/ramanujan.png"
          alt="Ramanujan"
          style={{
            height: "50px",         // smaller image
            width: "50px",
            borderRadius: "50%",
          }}
        />
        <h1 style={{ fontSize: "1rem", margin: 0 }}>Ramanujan Daily Math Challenge</h1>
      </div>

      {/* Right: existing nav links */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <NavLink
          to="/question"
          className={({ isActive }) => `hero-btn ${isActive ? "active" : ""}`}
        >
          Daily Challenge
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) => `hero-btn secondary ${isActive ? "active" : ""}`}
        >
          Leaderboard
        </NavLink>
      </div>
    </header>
  );
}

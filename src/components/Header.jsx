import { Link } from "react-router-dom";
import "./Header.css";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="hero-header">

      <div className="hero-overlay">
        <div className="hero-text-container">
          <h1>Ramanujan Daily Math Challenge</h1>
          <p>Uncover the beauty hidden in every problem.</p>

          <div className="hero-nav">
            <NavLink
              to="/question"
              className={({ isActive }) =>
                `hero-btn ${isActive ? "active" : ""}`
              }
            >
              Daily Challenge
            </NavLink>

            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `hero-btn secondary ${isActive ? "active" : ""}`
              }
            >
              Leaderboard
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

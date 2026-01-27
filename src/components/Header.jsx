import "./Header.css";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { useNavigate } from "react-router-dom";

export default function Header({
  user,
  streak = 0,
  coins = 0,
  onProfileClick,
  onLogout,
  onLeaderboardClick,
  walletRef
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      className="hero-header"
      style={{
        // height: "10vh",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        padding: "0 16px 0 16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        overflow: "visible",
      }}
    >
      {/* Left: Branding */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <img
          src="/ramanujan.png"
          alt="Ramanujan"
          style={{
            height: 44,
            width: 44,
            borderRadius: "50%",
          }}
        />
        <h1 style={{ fontSize: "1rem", margin: 0 }}>
          Ramanujan Daily Math Challenge
        </h1>
      </div>

      {/* Right: Profile cluster */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {user && (
          <>
            {/* 🔥 Streak */}
            <div style={{ fontWeight: 700 }}>
              🔥 {streak} {streak === 1 ? "day" : "days"}
            </div>

            {/* 🪙 Coins */}
            <div
              ref={walletRef} // ✅ attach ref here
              style={{
                fontWeight: 700,
                position: "relative", // needed if you want to do pulse animation later
              }}
            >
              💰 {coins}
            </div>
          </>
        )}
        {/* 🏆 Leaderboard */}
        <button
          onClick={onLeaderboardClick}
          title="Today's Leaderboard"
          style={{
            background: "transparent", // no background
            border: "none", // no border
            padding: 0,
            fontSize: 22, // slightly bigger
            cursor: "pointer",
          }}
        >
          🏆
        </button>
        {user && (
          <>
            {/* 👤 Profile */}
            <button onClick={() => setShowMenu(v => !v)}
              style={{
                width: 36,
                height: 36,
                background: "#ffcc00",
                borderRadius: "50%",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                cursor: "pointer",
              }}>👤</button>
            {showMenu && (
              <ProfileMenu
                onProfile={onProfileClick}
                onLogout={onLogout}
                onClose={() => setShowMenu(false)}
              />
            )}
          </>
        )}
      </div>
    </header>
  );
}
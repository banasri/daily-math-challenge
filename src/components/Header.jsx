import "./Header.css";

export default function Header({ streak = 0, coins = 0, onProfileClick }) {
  return (
    <header
      className="hero-header"
      style={{
        height: "10vh",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left: Branding */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
        {/* 🔥 Streak */}
        <div style={{ fontWeight: 700 }}>
          🔥 {streak} {streak === 1 ? "day" : "days"}
        </div>

        {/* 🪙 Coins */}
        <div style={{ fontWeight: 700 }}>
          🪙 {coins}
        </div>

        {/* 👤 Profile */}
        <button
          onClick={onProfileClick}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
          }}
          title="Profile"
        >
          👤
        </button>
      </div>
    </header>
  );
}
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/question", { replace: true });
  }, [user]);

  const handleLogin = async () => {
    await login();
    // No need to navigate here, the useEffect will catch the user change
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "rgb(0, 208, 255)",
        color: "#1b1b1b",
      }}
    >
      {/* 🧠 Ramanujan Circular Frame */}
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "#ff9400",
          padding: 8,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <img
            src="/ramanujan.png"
            alt="Ramanujan"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Title */}
      <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700 }}>
        Ramanujan Daily Math Challenge
      </h2>

      <p style={{ margin: 0, opacity: 0.85 }}>
        Think. Solve. Grow daily.
      </p>

      {/* 🔘 Action Tabs */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 12,
        }}
      >
        {/* Sign in */}
        <button className="btn btn-primary" onClick={handleLogin}>
          Sign in with Google
        </button>

        {/* Leaderboard */}
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/leaderboard")}
        >
          🏆 Today’s Leaderboard
        </button>
      </div>
    </div>
  );
}
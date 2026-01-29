import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export default function StreaksAndStats() {
  const { user, logout } = useAuth();
  const [streak, setStreak] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Load user stats from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const stats = snap.data().stats || {};
          setStreak(stats.playedStreak || 0);
          setGamesPlayed(stats.gamesPlayed || 0);
          setCorrectAnswers(stats.correctAnswers || 0);
        }
      } catch (err) {
        console.error("Failed to load user stats:", err);
      }
    };

    fetchStats();
  }, [user]);

  const milestones = [
    { days: 10, label: "Good", emoji: "👍" },
    { days: 20, label: "Great", emoji: "🚀" },
    { days: 30, label: "Incredible", emoji: "💎" },
    { days: 50, label: "Unstoppable", emoji: "🏆" },
  ];

  const nextMilestone = milestones.find((m) => streak < m.days);

  return (
    <>
      <AppHeader user={user} streak={streak} coins={0} onLogout={logout} />

      <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
        {/* 🔥 Streak Hero */}  
        <div style={cardStyle}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>🔥 {streak} Day Streak</h1>
          {streak > 0 ? <p>You’re building a great habit 👏</p> : <p>Every great habit starts with day one 🌱</p>}
          {nextMilestone && (
            <p style={{ marginTop: 8 }}>
              Next milestone: {nextMilestone.days} days — {nextMilestone.label}{" "}
              {nextMilestone.emoji}
            </p>
          )}
        </div>

        {/* 🏆 Streak Levels */}
        <div style={cardStyle}>
          <h3>Streak Levels</h3>
          {milestones.map((m) => (
            <p key={m.days}>
              {m.days} days — {m.label} {m.emoji}
            </p>
          ))}
        </div>

        {/* 📊 Stats */}
        <div style={cardStyle}>
          <h3>Your journey so far</h3>
          <p>
            🎮 Games Played: <b>{gamesPlayed}</b>
          </p>
          <p>
            ✅ Correct Answers: <b>{correctAnswers}</b>
          </p>
        </div>
      </div>
    </>
  );
}

const cardStyle = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  marginBottom: 16,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  color: "#333",
};
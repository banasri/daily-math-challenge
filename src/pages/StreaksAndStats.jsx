import AppHeader from "../components/AppHeader";
export default function StreaksAndStats() {
  const currentStreak = 17;
  const gamesPlayed = 42;
  const correctAnswers = 118;

  const milestones = [
    { days: 10, label: "Good", emoji: "👍" },
    { days: 20, label: "Great", emoji: "🚀" },
    { days: 30, label: "Incredible", emoji: "💎" },
    { days: 50, label: "Unstoppable", emoji: "🏆" },
  ];

  const nextMilestone = milestones.find(m => currentStreak < m.days);

  return (
    <>
      <AppHeader />
      <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
        {/* 🔥 Streak Hero */}
        <div style={cardStyle}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>
            🔥 {currentStreak} Day Streak
          </h1>
          <p>You’re building a great habit 👏</p>
        </div>


        {/* 🏆 Streak Levels */}
        <div style={cardStyle}>
          <h3>Streak Levels</h3>
          <p>10 days — Good 👍</p>
          <p>20 days — Great 🚀</p>
          <p>30 days — Incredible 💎</p>
          <p>50 days — Unstoppable 🏆</p>
        </div>


        {/* 📊 Stats */}
        <div style={cardStyle}>
          <h3>Your journey so far</h3>
          <p>🎮 Games Played: <b>{gamesPlayed}</b></p>
          <p>✅ Correct Answers: <b>{correctAnswers}</b></p>
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

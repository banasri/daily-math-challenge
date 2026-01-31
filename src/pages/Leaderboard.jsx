import { useEffect, useState } from "react";
import { getTodayLeaderboard } from "../services/leaderboardService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import AppHeader from "../components/AppHeader";
import "../components/OtherPages.css";
export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getTodayLeaderboard();
        setEntries(data);
      } catch (err) {
        console.error("Leaderboard load failed", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!user) return;


    async function loadProfile() {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const profile = snap.data();
          setUserProfile(profile);
          setStreak(profile.stats?.playedStreak || 0);
          setCoins(profile.stats?.currentCoins || 0);
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    }
    loadProfile();
  }, [user]);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <>
      {/* 🔝 Shared Header */}
      <AppHeader />
      {/* <div
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer",
          color: "#aadfff",
          marginBottom: 12,
          fontSize: 14,
        }}
      >
        ← Back to Today’s Question
      </div> */}
      <h2 style={{ marginTop: 20, textAlign: "center" }}>🏆 Today’s Hall of Fame</h2>
      <div className="leaderboard-page">

        {entries.length === 0 ? (
          <p>
            No correct answers yet today.
            Be the first to solve today’s puzzle! 🚀
          </p>
        ) : (
          <ol style={{ marginTop: 20 }}>
            {entries.map((e, idx) => (
              <li key={idx} style={{ marginBottom: 10 }}>
                <span style={{ fontWeight: 700 }}>{e.fullName}</span>
                {e.grade && <span style={{ color: "#97096a" }}> • Grade {e.grade}</span>}
                {e.school && <span style={{ color: "#2116a2" }}> • {e.school}</span>}
              </li>
            ))}
          </ol>
        )}
      </div >
    </>
  );
}
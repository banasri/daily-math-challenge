// components/AppHeader.jsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firestore";
import Header from "./Header";

export default function AppHeader({
  walletRef = null,
  showLeaderboard = true,
  showStreaks = true,
  refreshKey = 0,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) return;

      const profile = snap.data();
      setStreak(profile.stats?.playedStreak || 0);
      setCoins(profile.stats?.currentCoins || 0);
    }

    loadProfile();
  }, [user, refreshKey]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Header
      user={user}
      streak={streak}
      coins={coins}
      walletRef={walletRef}
      onProfileClick={() => navigate("/profile")}
      onStreakClick={
        showStreaks ? () => navigate("/streaks") : undefined
      }
      onLeaderboardClick={
        showLeaderboard ? () => navigate("/leaderboard") : undefined
      }
      onLogout={handleLogout}
    />
  );
}
import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

import "../components/OtherPages.css";

import tshirt from "../assets/tshirt.png";
import bottle from "../assets/bottle.png";
import watch from "../assets/watch.png";
import backpack from "../assets/backpack.png";

export default function Rewards() {
  const { user, logout } = useAuth();
  const [streak, setStreak] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [currentCoins, setCurrentCoins] = useState(0);
  // Load user stats from Firestore (same as StreaksAndStats)
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const stats = snap.data().stats || {};
          const earned = stats.currentCoins || 0;
          const lifeEarned = stats.totalCoinsEarned || 0;
          console.log("Fetched coins:", earned, lifeEarned);
          setStreak(stats.playedStreak || 0);
          setCurrentCoins(earned);
          setTotalCoinsEarned(lifeEarned);
        }
      } catch (err) {
        console.error("Failed to load user stats:", err);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <>
      <AppHeader user={user} streak={streak} coins={0} onLogout={logout} />
      <h2 style={{ marginTop: 20, marginBottom: 0, textAlign: "center" }}>Rewards</h2>
      <h4 style={{ marginTop: 10, marginBottom: 5, textAlign: "center" }}>🎁 Redeem rewards using your available coins</h4>
      <div className="rewards-page">
        {/* Coins summary */}
        <div className="card stats-card">
          <div className="stat">
            <span className="label">Available Coins</span>
            <span className="value"> : {currentCoins}</span>
          </div>

          {/* <div className="stat">
            <span className="label">Lifetime Coins</span>
            <span className="value"> : {totalCoinsEarned}</span>
          </div> */}
        </div>

        {/* Rewards */}
        <div className="card rewards-card">
          <h3 className="section-title">Unlock with Coins (Sample items and More...)</h3>

          <div className="rewards-grid">
            <RewardItem img={tshirt} name="T-Shirt" coins="1350" />
            <RewardItem img={bottle} name="Water Bottle" coins="1880" />
            <RewardItem img={backpack} name="Backpack" coins="2250" />
            <RewardItem img={watch} name="Watch" coins="2750" />
          </div>
        </div>

        <p className="coming-soon">Referral rewards coming soon 🚀</p>
      </div>
    </>
  );
}

function RewardItem({ img, name, coins }) {
  return (
    <div className="reward-item">
      <img src={img} alt={name} />
      <div className="reward-name">{name}</div>
      <div className="reward-coins">{coins} coins</div>
    </div>
  );
}

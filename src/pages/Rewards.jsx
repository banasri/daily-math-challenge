import AppHeader from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import bottleImg from "../assets/bottle.png";
import tshirtImg from "../assets/tshirt.png";
import backpackImg from "../assets/backpack.png";
import watchImg from "../assets/watch.png";
export default function Rewards() {
  const { user, logout } = useAuth();

  // TEMP – later from Firestore
  const totalCoins = 380;
  const lifetimeCoins = 520;
  const redeemedCoins = 140;

  const rewards = [
    { name: "Water Bottle", coins: 680, imgUrl: bottleImg },
    { name: "Ramanujan Daily Challenge T-Shirt", coins: 890, imgUrl: tshirtImg },
    { name: "Backpack", coins: 1650, imgUrl: backpackImg },
    { name: "Watch", coins: 2150, imgUrl: watchImg },
  ];

  return (
    <>
      <AppHeader user={user} coins={totalCoins} onLogout={logout} />

      <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
        {/* 🎁 Header Card */}
        <div style={cardStyle}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>🎁 Rewards</h1>
          <p>Turn your consistency into something tangible</p>
        </div>

        {/* 🪙 Coins Summary */}
        <div style={cardStyle}>
          <h3>Your coins</h3>
          <p>
            🪙 Total Coins: <b>{totalCoins}</b>
          </p>
          <p>
            📈 Lifetime Earned: <b>{lifetimeCoins}</b>
          </p>
          <p>
            🎁 Redeemed: <b>{redeemedCoins}</b>
          </p>
          <p style={{ opacity: 0.6 }}>🤝 Referral Coins: Coming soon 🚧</p>
        </div>

        {/* 🛍 Rewards List */}
        <div style={cardStyle}>
          <h3>Spend your coins</h3>

          {rewards.map((reward) => {
            const canRedeem = totalCoins >= reward.coins;
            const progress = Math.min(
              Math.round((totalCoins / reward.coins) * 100),
              100
            );

            return (
              <div
                key={reward.name}
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid #eee",
                }}
              >
                <p style={{ marginBottom: 4 }}>
                  🎁 <b>{reward.name}</b>
                </p>

                <p style={{ fontSize: 14, color: "#555" }}>
                  🪙 {reward.coins} coins
                </p>
                <img
                  src={reward.imgUrl}
                  alt={reward.name}
                  style={{ height: 80, marginTop: 8 }}
                />
                {!canRedeem && (
                  <p style={{ fontSize: 13, opacity: 0.7 }}>
                    {progress}% unlocked
                  </p>
                )}

                <button
                  disabled={!canRedeem}
                  style={{
                    marginTop: 6,
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    fontWeight: 600,
                    cursor: canRedeem ? "pointer" : "not-allowed",
                    background: canRedeem ? "#4f46e5" : "#eee",
                    color: canRedeem ? "#fff" : "#888",
                  }}
                >
                  {canRedeem ? "Redeem" : "Keep earning"}
                </button>
              </div>
            );
          })}
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
import "./MilestoneBanner.css";

export default function MilestoneBanner({ visible }) {
  return (
    <div
      className={`milestone-banner ${visible ? "show" : "hide"}`}
    >
      🔥👏 <span>10-Day Streak Complete! 🎉 50 Coins 🪙</span>
    </div>
  );
}
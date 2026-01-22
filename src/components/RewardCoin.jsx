import Lottie from "lottie-react";

export default function RewardCoin({
  animationData,
  value,
  size = 120
}) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size
      }}
    >
      <Lottie
        animationData={animationData}
        loop={false}
        style={{ width: "100%", height: "100%" }}
      />

      <div className="coin-text">
        {value}
      </div>
    </div>
  );
}

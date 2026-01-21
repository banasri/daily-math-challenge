import { forwardRef } from "react";

const Wallet = forwardRef(({ coins, pulse }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontWeight: 600,
        transform: pulse ? "scale(1.25)" : "scale(1)",
        transition: "transform 0.3s ease-out",
      }}
    >
      <span style={{ fontSize: 20 }}>💰</span>
      <span>{coins}</span>
    </div>
  );
});

export default Wallet;
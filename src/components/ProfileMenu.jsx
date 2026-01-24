import { useEffect, useRef } from "react";

export default function ProfileMenu({ onProfile, onLogout, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: 56,
        right: 16,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        overflow: "hidden",
        zIndex: 1000,
        minWidth: 180,
      }}
    >
      <MenuItem label="✏️ Update Profile" onClick={onProfile} />
      <MenuItem label="🚪 Logout" danger onClick={onLogout} />
    </div>
  );
}

const MenuItem = ({ label, onClick, danger }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "none",
      background: "white",
      textAlign: "left",
      cursor: "pointer",
      fontWeight: 600,
      color: danger ? "#e53935" : "#333",
    }}
  >
    {label}
  </button>
);
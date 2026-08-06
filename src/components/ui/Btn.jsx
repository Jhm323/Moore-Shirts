import React from "react";
import { TOKENS } from "../../theme/tokens";

export default function Btn({ children, onClick, variant = "primary", style, disabled, type = "button" }) {
  const base = {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    padding: "13px 26px",
    border: "none",
    borderRadius: 999,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "transform 0.08s ease, opacity 0.15s ease",
  };
  const variants = {
    primary: { background: TOKENS.leaf, color: TOKENS.cream },
    accent: { background: TOKENS.gold, color: TOKENS.ink },
    ghost: { background: "transparent", color: TOKENS.leaf, border: `1.5px solid ${TOKENS.leaf}` },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

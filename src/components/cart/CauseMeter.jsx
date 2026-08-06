import React from "react";
import { TOKENS } from "../../theme/tokens";

/* ---------- Cause Meter (signature element) ---------- */
export default function CauseMeter({ cause, amount }) {
  if (!cause) return null;
  const give = (amount * 0.1).toFixed(2);
  return (
    <div style={{ marginTop: 16 }}>
      <svg viewBox="0 0 200 60" width="100%" height="60">
        <path d="M10 55 A90 90 0 0 1 190 55" fill="none" stroke={TOKENS.grey} strokeWidth="4" strokeLinecap="round" />
        <path
          d="M10 55 A90 90 0 0 1 190 55"
          fill="none"
          stroke={cause.color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset={283 - 283 * 0.1}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <circle cx={10 + 180 * 0.1} cy={55 - Math.sin(Math.PI * 0.1) * 90 * 0.55} r="5" fill={TOKENS.ink} />
      </svg>
      <div style={{ textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 12 }}>
        <strong>${give}</strong> (10%) goes to <strong>{cause.name}</strong>
      </div>
    </div>
  );
}

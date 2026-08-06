import React from "react";
import { TOKENS } from "../../theme/tokens";

export default function Input({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, color: TOKENS.leaf }}>
        {label}
      </div>
      <input
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 16px",
          border: `1.5px solid ${TOKENS.grey}`,
          borderRadius: 14,
          background: "#FFFFFF",
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
        }}
      />
    </label>
  );
}

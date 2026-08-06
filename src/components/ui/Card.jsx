import React from "react";
import { TOKENS } from "../../theme/tokens";

export default function Card({ children, style, bg = TOKENS.cream }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 24,
        boxShadow: "0 10px 30px rgba(37,51,42,0.12)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

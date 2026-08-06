import React from "react";
import { TOKENS } from "../../theme/tokens";

export default function Tag({ children, bg = TOKENS.gold, fg = TOKENS.ink }) {
  return (
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        background: bg,
        color: fg,
        padding: "5px 12px",
        borderRadius: 999,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

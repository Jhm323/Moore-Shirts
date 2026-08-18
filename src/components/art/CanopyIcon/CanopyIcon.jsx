import React from "react";
import { TOKENS } from "../../../theme/tokens";

/* small canopy motif used as a product tile icon */
export default function CanopyIcon({ size = 120, color = TOKENS.leaf }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="46" r="44" fill={TOKENS.sky} />
      <circle cx="50" cy="42" r="16" fill="#FFF6DC" opacity="0.7" />
      <g fill={color}>
        <path d="M2 10 C 20 0 40 2 54 14 C 40 20 20 20 2 10 Z" />
        <path d="M98 10 C 80 0 60 2 46 14 C 60 20 80 20 98 10 Z" />
        <path d="M2 90 C 20 100 40 98 54 86 C 40 80 20 80 2 90 Z" />
        <path d="M98 90 C 80 100 60 98 46 86 C 60 80 80 80 98 90 Z" />
      </g>
    </svg>
  );
}

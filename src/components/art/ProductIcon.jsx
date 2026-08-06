import React from "react";
import { TOKENS } from "../../theme/tokens";

/* ---------- icon tiles (original line-art, not photo reproductions) ---------- */
export default function ProductIcon({ icon, size = 120, color }) {
  const stroke = color || TOKENS.ink;
  const common = { width: size, height: size, viewBox: "0 0 100 100", fill: "none", stroke, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (icon) {
    case "owl":
      return (
        <svg {...common}>
          <path d="M30 30 Q20 15 26 8 Q34 14 36 24" />
          <path d="M70 30 Q80 15 74 8 Q66 14 64 24" />
          <ellipse cx="50" cy="50" rx="26" ry="30" />
          <circle cx="38" cy="46" r="9" />
          <circle cx="62" cy="46" r="9" />
          <circle cx="38" cy="46" r="2.5" fill={stroke} stroke="none" />
          <circle cx="62" cy="46" r="2.5" fill={stroke} stroke="none" />
          <path d="M50 54 L45 64 L55 64 Z" />
        </svg>
      );
    case "tiger":
      return (
        <svg {...common}>
          <path d="M28 25 L38 40 M72 25 L62 40" />
          <ellipse cx="50" cy="55" rx="30" ry="28" />
          <path d="M32 45 Q40 48 34 55 M68 45 Q60 48 66 55 M30 60 Q40 60 36 68 M70 60 Q60 60 64 68" />
          <circle cx="40" cy="52" r="2" fill={stroke} stroke="none" />
          <circle cx="60" cy="52" r="2" fill={stroke} stroke="none" />
          <path d="M45 62 L50 66 L55 62 M50 66 V72" />
        </svg>
      );
    case "panther":
      return (
        <svg {...common}>
          <path d="M28 34 L36 22 M72 34 L64 22" />
          <ellipse cx="50" cy="52" rx="26" ry="30" />
          <circle cx="40" cy="48" r="2.5" fill={stroke} stroke="none" />
          <circle cx="60" cy="48" r="2.5" fill={stroke} stroke="none" />
          <path d="M45 58 L50 62 L55 58 M50 62 V68" />
        </svg>
      );
    case "panthermoon":
      return (
        <svg {...common}>
          <path d="M68 20 A12 12 0 1 0 68 40 A9 9 0 1 1 68 20 Z" fill={stroke} stroke="none" />
          <path d="M28 40 L36 28 M64 42 L58 30" />
          <ellipse cx="46" cy="58" rx="24" ry="28" />
          <circle cx="38" cy="54" r="2.3" fill={stroke} stroke="none" />
          <circle cx="54" cy="54" r="2.3" fill={stroke} stroke="none" />
        </svg>
      );
    case "cardcat":
      return (
        <svg {...common}>
          <rect x="15" y="10" width="70" height="80" rx="10" />
          <path d="M22 18 L27 26 L22 34 M78 18 L73 26 L78 34" fill={stroke} stroke="none" />
          <path d="M32 45 L38 33 M68 45 L62 33" />
          <ellipse cx="50" cy="60" rx="20" ry="24" />
          <circle cx="43" cy="56" r="2" fill={stroke} stroke="none" />
          <circle cx="57" cy="56" r="2" fill={stroke} stroke="none" />
        </svg>
      );
    case "coyote":
      return (
        <svg {...common}>
          <path d="M50 15 L40 32 L60 32 Z" />
          <path d="M50 32 Q30 35 28 55 Q28 75 50 82 Q72 75 72 55 Q70 35 50 32 Z" />
          <circle cx="42" cy="52" r="2" fill={stroke} stroke="none" />
          <circle cx="58" cy="52" r="2" fill={stroke} stroke="none" />
          <path d="M46 62 L54 62 L50 68 Z" fill={stroke} stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

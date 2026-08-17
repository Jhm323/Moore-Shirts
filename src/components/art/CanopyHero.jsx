import React from "react";
import { TOKENS } from "../../theme/tokens";
import "./CanopyHero.css";

/* ---------- canopy / sky hero art (original illustration, not a
   reproduction of any photo) ---------- */
function Leaf({ x, y, rot, scale = 1, color = TOKENS.leaf, rim = TOKENS.gold }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <path d="M0 0 C 34 -20 88 -18 130 0 C 88 18 34 20 0 0 Z" fill={color} />
      <path d="M2 0 C 34 -17 84 -15 122 0" fill="none" stroke={rim} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M8 0 L118 0" stroke={rim} strokeWidth="1" opacity="0.4" />
    </g>
  );
}

export default function CanopyHero({ height = 360 }) {
  return (
    <svg viewBox="0 0 800 500" width="100%" height={height} className="canopy-hero" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TOKENS.skyDeep} />
          <stop offset="55%" stopColor={TOKENS.sky} />
          <stop offset="100%" stopColor="#EFE6C8" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="42%" r="45%">
          <stop offset="0%" stopColor="#FFF6DC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFF6DC" stopOpacity="0" />
        </radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="800" height="500" fill="url(#skyGrad)" />
      <ellipse cx="420" cy="190" rx="230" ry="140" fill="url(#glow)" />
      <ellipse cx="180" cy="90" rx="70" ry="20" fill="#FFFFFF" opacity="0.35" filter="url(#soft)" />
      <ellipse cx="560" cy="130" rx="90" ry="24" fill="#FFFFFF" opacity="0.3" filter="url(#soft)" />

      {/* corner leaves framing inward, like looking straight up through a canopy */}
      <Leaf x={-30} y={-20} rot={18} scale={2.1} color={TOKENS.leafDeep} />
      <Leaf x={10} y={40} rot={40} scale={1.7} color={TOKENS.leaf} />
      <Leaf x={60} y={110} rot={62} scale={1.3} color={TOKENS.leaf} />

      <Leaf x={830} y={-10} rot={162} scale={2.1} color={TOKENS.leafDeep} />
      <Leaf x={790} y={50} rot={140} scale={1.7} color={TOKENS.leaf} />
      <Leaf x={740} y={120} rot={118} scale={1.3} color={TOKENS.leaf} />

      <Leaf x={-20} y={520} rot={-18} scale={2.1} color={TOKENS.leafDeep} />
      <Leaf x={30} y={450} rot={-40} scale={1.7} color={TOKENS.leaf} />
      <Leaf x={90} y={390} rot={-62} scale={1.3} color={TOKENS.leaf} />

      <Leaf x={820} y={520} rot={198} scale={2.1} color={TOKENS.leafDeep} />
      <Leaf x={770} y={450} rot={220} scale={1.7} color={TOKENS.leaf} />
      <Leaf x={710} y={390} rot={242} scale={1.3} color={TOKENS.leaf} />

      <Leaf x={400} y={-30} rot={92} scale={1.9} color={TOKENS.leafDeep} />
      <Leaf x={400} y={530} rot={-88} scale={1.9} color={TOKENS.leafDeep} />
    </svg>
  );
}

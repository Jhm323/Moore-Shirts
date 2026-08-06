import React from "react";
import { TOKENS } from "../../theme/tokens";
import CanopyIcon from "./CanopyIcon";
import ProductIcon from "./ProductIcon";

/* A tile that shows a product's icon, or the canopy motif for the flagship print */
export default function PosterTile({ product, size = 120 }) {
  const bg = product.tileBg || TOKENS.cream;
  const fg = product.tileFg || TOKENS.ink;
  return (
    <div
      style={{
        background: bg,
        color: fg,
        width: "100%",
        height: size + 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        padding: 12,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {product.icon === "canopy" ? <CanopyIcon size={size} color={fg} /> : <ProductIcon icon={product.icon} size={size} color={fg} />}
    </div>
  );
}

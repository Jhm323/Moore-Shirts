import React from "react";
import { TOKENS } from "../../theme/tokens";
import CanopyIcon from "./CanopyIcon";
import ProductIcon from "./ProductIcon";
import "./PosterTile.css";

/* A tile that shows a product's icon, or the canopy motif for the flagship print */
export default function PosterTile({ product, size = 120 }) {
  const bg = product.tileBg || TOKENS.cream;
  const fg = product.tileFg || TOKENS.ink;
  return (
    <div
      className="poster-tile"
      style={{ "--tile-bg": bg, "--tile-fg": fg, "--tile-size": `${size}px` }}
    >
      {product.image ? (
        <img className="poster-tile__image" src={product.image} alt={product.name} />
      ) : product.icon === "canopy" ? (
        <CanopyIcon size={size} color={fg} />
      ) : (
        <ProductIcon icon={product.icon} size={size} color={fg} />
      )}
    </div>
  );
}

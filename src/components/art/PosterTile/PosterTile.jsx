import React, { useState, useEffect } from "react";
import { TOKENS } from "../../../theme/tokens";
import CanopyIcon from "../CanopyIcon";
import ProductIcon from "../ProductIcon";
import "./PosterTile.css";

// Map of every raw source image under products-raw, keyed by its full path,
// to an async loader -- only images actually referenced by a rendered
// product get bundled into dist, not the whole products-raw folder.
const productImageLoaders = import.meta.glob("/src/assets/products-raw/**/*.{png,jpg,jpeg}");

/* A tile that shows a product's icon, or the canopy motif for the flagship print */
export default function PosterTile({ product, size = 120 }) {
  const bg = product.tileBg || TOKENS.cream;
  const fg = product.tileFg || TOKENS.ink;
  const [rawImageUrl, setRawImageUrl] = useState(null);

  useEffect(() => {
    if (!product.rawImage) {
      setRawImageUrl(null);
      return;
    }
    const loader = productImageLoaders[`/src/assets/products-raw/${product.rawImage}`];
    if (!loader) {
      setRawImageUrl(null);
      return;
    }
    let cancelled = false;
    loader().then((mod) => {
      if (!cancelled) setRawImageUrl(mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, [product.rawImage]);

  return (
    <div
      className="poster-tile"
      style={{ "--tile-bg": bg, "--tile-fg": fg, "--tile-size": `${size}px` }}
    >
      {rawImageUrl ? (
        <img className="poster-tile__image" src={rawImageUrl} alt={product.name} />
      ) : product.image ? (
        <img className="poster-tile__image" src={product.image} alt={product.name} />
      ) : product.icon === "canopy" ? (
        <CanopyIcon size={size} color={fg} />
      ) : (
        <ProductIcon icon={product.icon} size={size} color={fg} />
      )}
    </div>
  );
}

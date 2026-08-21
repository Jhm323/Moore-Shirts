import React, { useState, useEffect } from "react";
import "./ShirtMockup.css";

// Map of every raw source image under products-raw, keyed by its full path,
// to an async loader -- only images actually referenced by a rendered
// product get bundled into dist, not the whole products-raw folder.
const productImageLoaders = import.meta.glob("/src/assets/products-raw/**/*.{png,jpg,jpeg}");

export default function ShirtMockup({ product, size = 320 }) {
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
    <div className="shirt-mockup" style={{ width: size, height: size }}>
      {rawImageUrl ? (
        <img className="shirt-mockup__image" src={rawImageUrl} alt={product.name} />
      ) : product.image ? (
        <img className="shirt-mockup__image" src={product.image} alt={product.name} />
      ) : (
        <div className="shirt-mockup__fallback" style={{ background: product.tileBg || "#3D2740" }} />
      )}
    </div>
  );
}

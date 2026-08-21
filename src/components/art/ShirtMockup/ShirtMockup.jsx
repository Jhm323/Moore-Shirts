import React, { useState, useEffect } from "react";
import "./ShirtMockup.css";

// Map of every raw source image under products-raw, keyed by its full path,
// to an async loader -- only images actually referenced by a rendered
// product get bundled into dist, not the whole products-raw folder.
const productImageLoaders = import.meta.glob("/src/assets/products-raw/**/*.{png,jpg,jpeg}");

export default function ShirtMockup({ product, size = 320 }) {
  const clipId = `shirt-print-${product.id}`;
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
    <svg viewBox="0 0 200 200" width={size} height={size} className="shirt-mockup">
      <path
        d="M70 20 L60 40 L30 55 L45 85 L60 75 L60 175 L140 175 L140 75 L155 85 L170 55 L140 40 L130 20
           C130 20 122 32 100 32 C78 32 70 20 70 20 Z"
        fill="#161016"
        stroke="#0B080B"
        strokeWidth="1.5"
      />
      <path
        d="M70 20 C70 20 78 32 100 32 C122 32 130 20 130 20"
        fill="none"
        stroke="#2A1F2A"
        strokeWidth="1.5"
      />
      <clipPath id={clipId}>
        <rect x="72" y="55" width="56" height="56" rx="4" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        {rawImageUrl ? (
          <image
            href={rawImageUrl}
            x="72"
            y="55"
            width="56"
            height="56"
            preserveAspectRatio="xMidYMid slice"
          />
        ) : product.image ? (
          <image
            href={product.image}
            x="72"
            y="55"
            width="56"
            height="56"
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <rect x="72" y="55" width="56" height="56" fill={product.tileBg || "#3D2740"} />
        )}
      </g>
    </svg>
  );
}

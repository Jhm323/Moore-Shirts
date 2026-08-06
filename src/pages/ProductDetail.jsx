import React, { useState } from "react";
import { TOKENS } from "../theme/tokens";
import { SIZES } from "../data/products";
import Card from "../components/ui/Card";
import Tag from "../components/ui/Tag";
import Btn from "../components/ui/Btn";
import PosterTile from "../components/art/PosterTile";

/* ---------------- Product Detail ---------------- */
export default function ProductDetail({ product, liked, toggleLike, onAdd, onBack }) {
  const [size, setSize] = useState("M");
  return (
    <div style={{ padding: "40px 20px 70px", maxWidth: 1000, margin: "0 auto" }}>
      <span style={{ cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, opacity: 0.7 }} onClick={onBack}>
        {"←"} Back to shop
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 20 }}>
        <Card style={{ padding: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <PosterTile product={product} size={240} />
        </Card>
        <div>
          {product.tag && <Tag>{product.tag}</Tag>}
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 34, margin: "12px 0", color: TOKENS.leaf }}>{product.name}</h1>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, marginBottom: 14 }}>${product.price}</div>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 22 }}>{product.blurb} Screen-printed on heavyweight organic cotton, unisex fit.</p>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, textTransform: "uppercase", marginBottom: 8 }}>Size</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    width: 46,
                    height: 46,
                    border: `1.5px solid ${TOKENS.leaf}`,
                    background: size === s ? TOKENS.leaf : "transparent",
                    color: size === s ? TOKENS.cream : TOKENS.leaf,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    cursor: "pointer",
                    borderRadius: 999,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Btn variant="primary" onClick={() => onAdd(size)}>
              Add to cart
            </Btn>
            <Btn variant="ghost" onClick={toggleLike}>
              {liked ? "♥ Saved" : "♡ Save"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

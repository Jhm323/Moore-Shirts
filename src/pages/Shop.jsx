import React from "react";
import { TOKENS } from "../theme/tokens";
import { PRODUCTS } from "../data/products";
import Card from "../components/ui/Card";
import Tag from "../components/ui/Tag";
import PosterTile from "../components/art/PosterTile";

/* ---------------- Shop / grid ---------------- */
export function ProductGrid({ onProduct, liked, toggleLike, limit }) {
  const items = limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 22 }}>
      {items.map((p) => (
        <Card key={p.id} style={{ padding: 18, cursor: "pointer" }}>
          <div onClick={() => onProduct(p.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              {p.tag ? <Tag bg={p.tag === "New" ? TOKENS.skyDeep : TOKENS.gold} fg={p.tag === "New" ? TOKENS.cream : TOKENS.ink}>{p.tag}</Tag> : <span />}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(p.id);
                }}
                style={{ fontSize: 20, cursor: "pointer" }}
                title="Save"
              >
                {liked.includes(p.id) ? "♥" : "♡"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", padding: "18px 0" }}>
              <PosterTile product={p} size={110} />
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 18, color: TOKENS.leaf }}>{p.name}</div>
            <div style={{ fontSize: 14, opacity: 0.75, margin: "4px 0 10px" }}>{p.blurb}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15 }}>${p.price}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function Shop({ onProduct, liked, toggleLike }) {
  return (
    <div style={{ padding: "40px 20px 70px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 32, marginBottom: 8, color: TOKENS.leaf }}>Shop all</h1>
      <p style={{ marginBottom: 26, opacity: 0.75 }}>Naturalist portraits, printed on heavyweight organic cotton.</p>
      <ProductGrid onProduct={onProduct} liked={liked} toggleLike={toggleLike} />
    </div>
  );
}

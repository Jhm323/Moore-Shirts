import React from "react";
import { TOKENS } from "../theme/tokens";
import { CAUSES } from "../data/causes";
import Card from "../components/ui/Card";
import Tag from "../components/ui/Tag";
import Btn from "../components/ui/Btn";
import CanopyHero from "../components/art/CanopyHero";
import { ProductGrid } from "./Shop";

/* ---------------- Landing ---------------- */
export default function Landing({ onShop, onProduct, liked, toggleLike }) {
  return (
    <div>
      <section style={{ position: "relative", maxWidth: 1200, margin: "24px auto 0", padding: "0 20px" }}>
        <Card style={{ overflow: "hidden", position: "relative" }} bg={TOKENS.sky}>
          <CanopyHero height={420} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <Card style={{ padding: "40px 44px", maxWidth: 560, textAlign: "center" }} bg="rgba(246,241,228,0.92)">
              <Tag>10% of every order funds a cause you pick</Tag>
              <h1
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 500,
                  fontSize: "clamp(30px, 4.4vw, 48px)",
                  lineHeight: 1.08,
                  margin: "18px 0 14px",
                  color: TOKENS.leaf,
                }}
              >
                Portraits of the wild,
                <br />
                worn with purpose.
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24, color: TOKENS.ink }}>
                Painterly wildlife prints on heavyweight organic cotton. Every order routes real dollars to the
                cause that matters to you.
              </p>
              <Btn variant="primary" onClick={onShop}>
                Shop the collection
              </Btn>
            </Card>
          </div>
        </Card>
      </section>

      <section style={{ padding: "56px 20px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 26, marginBottom: 20, color: TOKENS.leaf }}>
          The collection
        </h2>
        <ProductGrid onProduct={onProduct} liked={liked} toggleLike={toggleLike} limit={4} />
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Btn variant="ghost" onClick={onShop}>
            View all designs
          </Btn>
        </div>
      </section>

      <section style={{ background: TOKENS.leaf, color: TOKENS.cream, padding: "60px 20px", borderRadius: "36px 36px 0 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 26, marginBottom: 22 }}>Where your 10% can go</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {CAUSES.map((c) => (
              <div key={c.id} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 18 }}>
                <div style={{ width: 14, height: 14, background: c.color, borderRadius: "50%", marginBottom: 10 }} />
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, textTransform: "uppercase", marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 14, opacity: 0.8 }}>{c.blurb}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

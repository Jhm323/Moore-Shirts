import React, { useState, useEffect } from "react";
import { TOKENS } from "../theme/tokens";
import { PRODUCTS } from "../data/products";
import { getJSON, setJSON } from "../lib/storage";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import PosterTile from "../components/art/PosterTile";

/* ---------------- Profile ---------------- */
export default function Profile({ user, logout, liked, purchases, setView, toggleLike, onProduct }) {
  const [twoFAEnabled, setTwoFAEnabled] = useState(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const acc = await getJSON(`account:${user.email}`);
      setTwoFAEnabled(acc ? acc.twoFA : false);
    })();
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <p>You're not logged in.</p>
        <Btn variant="primary" onClick={() => setView("auth")}>
          Log in
        </Btn>
      </div>
    );
  }

  async function toggle2FA() {
    const acc = await getJSON(`account:${user.email}`);
    const next = !twoFAEnabled;
    await setJSON(`account:${user.email}`, { ...acc, twoFA: next });
    setTwoFAEnabled(next);
  }

  const likedProducts = PRODUCTS.filter((p) => liked.includes(p.id));

  return (
    <div style={{ padding: "40px 20px 80px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 30, color: TOKENS.leaf }}>Profile</h1>

      <Card style={{ padding: 22, marginBottom: 24 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, opacity: 0.7 }}>Signed in as</div>
        <div style={{ fontSize: 18, marginBottom: 12 }}>{user.email}</div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: "'Space Mono', monospace", fontSize: 13, marginBottom: 14 }}>
          <input type="checkbox" checked={!!twoFAEnabled} onChange={toggle2FA} />
          Require 2FA code at login
        </label>
        <Btn
          variant="ghost"
          onClick={() => {
            logout();
            setView("landing");
          }}
        >
          Log out
        </Btn>
      </Card>

      <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 20, marginBottom: 12, color: TOKENS.leaf }}>Liked items</h2>
      {likedProducts.length === 0 ? (
        <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 24 }}>Nothing saved yet {"—"} tap the heart on any design.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 14, marginBottom: 30 }}>
          {likedProducts.map((p) => (
            <Card key={p.id} style={{ padding: 14, cursor: "pointer" }}>
              <div onClick={() => onProduct(p.id)}>
                <PosterTile product={p} size={70} />
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 14, marginTop: 6 }}>{p.name}</div>
              <span onClick={() => toggleLike(p.id)} style={{ fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                Remove
              </span>
            </Card>
          ))}
        </div>
      )}

      <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 20, marginBottom: 12, color: TOKENS.leaf }}>Purchase history</h2>
      {purchases.length === 0 ? (
        <p style={{ fontSize: 14, opacity: 0.7 }}>No orders yet.</p>
      ) : (
        purchases.map((o) => (
          <Card key={o.id} style={{ padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
              <span>{o.id}</span>
              <span>{new Date(o.date).toLocaleDateString()}</span>
            </div>
            <div style={{ fontSize: 14, margin: "6px 0" }}>
              {o.items.map((i) => PRODUCTS.find((p) => p.id === i.productId)?.name).join(", ")}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
              <span>{o.cause ? `Supported: ${o.cause}` : ""}</span>
              <span>${o.total.toFixed(2)}</span>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

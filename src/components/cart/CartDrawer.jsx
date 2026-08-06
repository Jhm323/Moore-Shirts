import React from "react";
import { TOKENS } from "../../theme/tokens";
import { PRODUCTS } from "../../data/products";
import PosterTile from "../art/PosterTile";
import Btn from "../ui/Btn";

const qtyBtnStyle = {
  width: 28,
  height: 28,
  border: `1.5px solid ${TOKENS.leaf}`,
  background: "transparent",
  borderRadius: 999,
  cursor: "pointer",
  fontFamily: "'Space Mono', monospace",
};

/* ---------------- Cart Drawer ---------------- */
export default function CartDrawer({ cart, onClose, removeFromCart, updateQty, total, onCheckout }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(37,51,42,0.35)", zIndex: 150 }} />
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "min(420px, 92vw)",
          background: TOKENS.cream,
          borderRadius: "24px 0 0 24px",
          zIndex: 151,
          padding: 24,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 30px rgba(37,51,42,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, margin: 0, color: TOKENS.leaf }}>Your cart</h2>
          <span style={{ cursor: "pointer", fontSize: 20 }} onClick={onClose}>
            {"✕"}
          </span>
        </div>
        {cart.length === 0 && <p>Your cart is empty. Go find a portrait worth wearing.</p>}
        <div style={{ flex: 1 }}>
          {cart.map((item, idx) => {
            const p = PRODUCTS.find((pr) => pr.id === item.productId);
            return (
              <div key={idx} style={{ display: "flex", gap: 12, borderBottom: `1px solid ${TOKENS.grey}55`, padding: "14px 0" }}>
                <div style={{ width: 56, flexShrink: 0 }}>
                  <PosterTile product={p} size={40} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 15 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, opacity: 0.75 }}>
                    Size {item.size} {"·"} ${p.price}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <button onClick={() => updateQty(idx, item.qty - 1)} style={qtyBtnStyle}>
                      {"−"}
                    </button>
                    <span style={{ fontFamily: "'Space Mono', monospace" }}>{item.qty}</span>
                    <button onClick={() => updateQty(idx, item.qty + 1)} style={qtyBtnStyle}>
                      +
                    </button>
                    <span onClick={() => removeFromCart(idx)} style={{ marginLeft: "auto", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {cart.length > 0 && (
          <div style={{ borderTop: `1.5px solid ${TOKENS.grey}55`, paddingTop: 16, marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: 16, marginBottom: 14 }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Btn variant="primary" style={{ width: "100%" }} onClick={onCheckout}>
              Checkout
            </Btn>
          </div>
        )}
      </div>
    </>
  );
}

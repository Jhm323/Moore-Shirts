import React from "react";
import { TOKENS } from "../../theme/tokens";

export default function Header({ view, setView, cartCount, user, onCartClick }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 28px",
        position: "sticky",
        top: 0,
        background: `${TOKENS.cream}F2`,
        backdropFilter: "blur(6px)",
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(37,51,42,0.06)",
      }}
    >
      <div onClick={() => setView("landing")} style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 21, cursor: "pointer" }}>
        Common Thread
      </div>
      <nav style={{ display: "flex", gap: 22, alignItems: "center", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
        <span style={{ cursor: "pointer", opacity: view === "shop" ? 1 : 0.75, fontWeight: view === "shop" ? 600 : 500 }} onClick={() => setView("shop")}>
          Shop
        </span>
        <span style={{ cursor: "pointer", opacity: 0.75 }} onClick={onCartClick}>
          Cart{cartCount > 0 ? ` (${cartCount})` : ""}
        </span>
        <span
          onClick={() => setView(user ? "profile" : "auth")}
          style={{ cursor: "pointer", background: TOKENS.leaf, color: TOKENS.cream, padding: "8px 18px", borderRadius: 999, fontWeight: 600 }}
        >
          {user ? "Profile" : "Log in"}
        </span>
      </nav>
    </header>
  );
}

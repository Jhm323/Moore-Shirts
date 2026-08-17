---
description: Add sign-in/sign-up, saved likes, and a Shop page wired to the order form
---

Apply the following file changes exactly as written. Do not regenerate,
"improve," or reinterpret any of this code — write it verbatim. If a file
already exists, overwrite it completely with the version below.

First, check `src/main.jsx` — if it does not already import the storage
shim, add this as the first line:
```js
import "./storageShim";
```

## Create `src/hooks/useAuth.js`
```js
import { useState, useEffect } from "react";
import { getJSON, setJSON } from "../lib/storage";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const session = await getJSON("session");
      if (session?.email) setUser({ email: session.email });
    })();
  }, []);

  async function signUp(email, password) {
    const existing = await getJSON(`account:${email}`);
    if (existing) return { error: "An account with that email already exists — sign in instead." };
    await setJSON(`account:${email}`, { email, password });
    await setJSON("session", { email });
    setUser({ email });
    return {};
  }

  async function signIn(email, password) {
    const account = await getJSON(`account:${email}`);
    if (!account || account.password !== password) return { error: "No matching account, or wrong password." };
    await setJSON("session", { email });
    setUser({ email });
    return {};
  }

  async function signOut() {
    await setJSON("session", null);
    setUser(null);
  }

  return { user, signUp, signIn, signOut };
}
```

## Create `src/hooks/useLiked.js`
```js
import { useState, useEffect } from "react";
import { getJSON, setJSON } from "../lib/storage";

export function useLiked(user) {
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    if (!user) { setLiked([]); return; }
    (async () => {
      const l = await getJSON(`liked:${user.email}`);
      setLiked(l || []);
    })();
  }, [user]);

  async function toggleLike(productId) {
    const next = liked.includes(productId) ? liked.filter((id) => id !== productId) : [...liked, productId];
    setLiked(next);
    await setJSON(`liked:${user.email}`, next);
  }

  return { liked, toggleLike };
}
```

## Create `src/pages/AuthPanel.jsx`
```jsx
import React, { useState } from "react";
import { TOKENS } from "../theme/tokens";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";

function Field({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, color: TOKENS.leaf }}>
        {label}
      </div>
      <input
        {...props}
        style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", border: `1.5px solid ${TOKENS.grey}`, borderRadius: 14, background: "#FFFFFF", fontFamily: "'Inter', sans-serif", fontSize: 15 }}
      />
    </label>
  );
}

export default function AuthPanel({ auth, onDone }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and a password (4+ characters).");
      return;
    }
    const result = mode === "signin" ? await auth.signIn(email, password) : await auth.signUp(email, password);
    if (result.error) setError(result.error);
    else onDone();
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: "0 20px" }}>
      <Card style={{ padding: 28 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, marginTop: 0, color: TOKENS.leaf }}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </h2>
        <form onSubmit={handleSubmit}>
          <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p style={{ color: "#B5482F", fontSize: 13 }}>{error}</p>}
          <Btn type="submit" variant="primary">{mode === "signin" ? "Sign in" : "Create account"}</Btn>
        </form>
        <p style={{ fontSize: 13, marginTop: 14 }}>
          {mode === "signin" ? "New here? " : "Already have an account? "}
          <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Create an account" : "Sign in"}
          </span>
        </p>
      </Card>
    </div>
  );
}
```

## Overwrite `src/components/layout/Header.jsx`
```jsx
import React from "react";
import { TOKENS } from "../../theme/tokens";

export default function Header({ onLogoClick, onShopClick, user, onAuthClick, onSignOut }) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", position: "sticky", top: 0, background: `${TOKENS.cream}F2`, backdropFilter: "blur(6px)", zIndex: 100, boxShadow: "0 2px 12px rgba(37,51,42,0.06)" }}>
      <div onClick={onLogoClick} style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 21, cursor: "pointer", color: TOKENS.leaf }}>
        Common Thread
      </div>
      <nav style={{ display: "flex", gap: 22, alignItems: "center", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
        <span style={{ cursor: "pointer", opacity: 0.8 }} onClick={onShopClick}>Shop</span>
        {user ? (
          <span style={{ cursor: "pointer", opacity: 0.8 }} onClick={onSignOut} title={user.email}>Sign out</span>
        ) : (
          <span onClick={onAuthClick} style={{ cursor: "pointer", background: TOKENS.leaf, color: TOKENS.cream, padding: "8px 18px", borderRadius: 999, fontWeight: 600 }}>
            Sign in
          </span>
        )}
      </nav>
    </header>
  );
}
```

## Overwrite `src/pages/Landing.jsx`
```jsx
import React from "react";
import { TOKENS } from "../theme/tokens";
import { CAUSES } from "../data/causes";
import { PRODUCTS } from "../data/products";
import Card from "../components/ui/Card";
import Tag from "../components/ui/Tag";
import Btn from "../components/ui/Btn";
import CanopyHero from "../components/art/CanopyHero";
import PosterTile from "../components/art/PosterTile";

export default function Landing({ onOrder, onShop }) {
  return (
    <div>
      <section style={{ position: "relative", maxWidth: 1200, margin: "24px auto 0", padding: "0 20px" }}>
        <Card style={{ overflow: "hidden", position: "relative" }} bg={TOKENS.sky}>
          <CanopyHero height={420} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <Card style={{ padding: "40px 44px", maxWidth: 560, textAlign: "center" }} bg="rgba(246,241,228,0.92)">
              <Tag>10% of every order funds a cause you pick</Tag>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "clamp(30px, 4.4vw, 48px)", lineHeight: 1.08, margin: "18px 0 14px", color: TOKENS.leaf }}>
                Portraits of the wild,<br />worn with purpose.
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24, color: TOKENS.ink }}>
                Painterly wildlife prints, printed to order. No batches, no inventory.
              </p>
              <Btn variant="primary" onClick={onShop}>Shop the collection</Btn>
            </Card>
          </div>
        </Card>
      </section>

      <section style={{ padding: "56px 20px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 26, marginBottom: 20, color: TOKENS.leaf }}>The collection</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 18 }}>
          {PRODUCTS.slice(0, 4).map((p) => (
            <div key={p.id} onClick={() => onOrder(p.id)} style={{ cursor: "pointer" }}>
              <PosterTile product={p} size={90} />
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, marginTop: 8, textAlign: "center", color: TOKENS.leaf }}>{p.name}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Btn variant="ghost" onClick={onShop}>View all designs</Btn>
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
```

## Overwrite `src/pages/Shop.jsx`
```jsx
import React from "react";
import { TOKENS } from "../theme/tokens";
import { PRODUCTS } from "../data/products";
import PosterTile from "../components/art/PosterTile";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";

export default function Shop({ liked, toggleLike, onOrder, user, onRequireSignIn }) {
  function handleLike(id) {
    if (!user) { onRequireSignIn(); return; }
    toggleLike(id);
  }

  return (
    <div style={{ padding: "40px 20px 70px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 32, marginBottom: 8, color: TOKENS.leaf }}>Shop all</h1>
      <p style={{ marginBottom: 26, opacity: 0.75 }}>Naturalist portraits, printed to order.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 22 }}>
        {PRODUCTS.map((p) => (
          <Card key={p.id} style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span onClick={() => handleLike(p.id)} style={{ fontSize: 20, cursor: "pointer" }} title="Save">
                {liked.includes(p.id) ? "\u2665" : "\u2661"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 18px" }}>
              <PosterTile product={p} size={110} />
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 18, color: TOKENS.leaf, marginBottom: 4 }}>{p.name}</div>
            <Btn variant="primary" style={{ width: "100%", marginTop: 10 }} onClick={() => onOrder(p.id)}>
              Order this design
            </Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Edit `src/pages/OrderForm.jsx`

Do NOT rewrite this file. Make exactly these two targeted edits to the existing content:

1. Find `export default function App() {` and the line after it
   `const [designId, setDesignId] = useState(PRODUCTS[0].id);` — replace
   both with:
```jsx
export default function OrderForm({ initialDesignId, onBack }) {
  const [designId, setDesignId] = useState(initialDesignId || PRODUCTS[0].id);
```

2. Immediately after the line
   `<div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px 80px" }}>`,
   insert this new line:
```jsx
<span onClick={onBack} style={{ cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 13, opacity: 0.7 }}>← Back</span>
```

Do not touch anything else in this file — the CONFIG block, all the form
fields, and the submit logic must remain exactly as they are.

## Overwrite `src/App.jsx`
```jsx
import { useState } from "react";
import { TOKENS, FONTS } from "./theme/tokens";
import { useAuth } from "./hooks/useAuth";
import { useLiked } from "./hooks/useLiked";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing";
import Shop from "./pages/Shop";
import OrderForm from "./pages/OrderForm";
import AuthPanel from "./pages/AuthPanel";

export default function App() {
  const [view, setView] = useState("landing");
  const [presetDesignId, setPresetDesignId] = useState(null);
  const auth = useAuth();
  const { liked, toggleLike } = useLiked(auth.user);

  function goOrder(id) {
    setPresetDesignId(id);
    setView("order");
  }

  return (
    <div style={{ minHeight: "100vh", background: TOKENS.cream }}>
      <style>{FONTS}</style>
      <Header onLogoClick={() => setView("landing")} onShopClick={() => setView("shop")} user={auth.user} onAuthClick={() => setView("auth")} onSignOut={auth.signOut} />
      {view === "landing" && <Landing onOrder={goOrder} onShop={() => setView("shop")} />}
      {view === "shop" && <Shop liked={liked} toggleLike={toggleLike} onOrder={goOrder} user={auth.user} onRequireSignIn={() => setView("auth")} />}
      {view === "order" && <OrderForm initialDesignId={presetDesignId} onBack={() => setView("shop")} />}
      {view === "auth" && <AuthPanel auth={auth} onDone={() => setView("shop")} />}
      <Footer />
    </div>
  );
}
```

## After writing all files

1. Run `npm run build` and report the exact output — do not summarize
   success/failure from memory, paste the real terminal result.
2. If it fails, show the exact error and the file/line it points to.
   Do not guess a fix — fix only what the error message actually says
   is broken.
3. If it succeeds, list every file you created or overwrote, and confirm
   `src/pages/ProductDetail.jsx` was left untouched (it's now unused but
   should not be deleted).
import React, { useState } from "react";
import { TOKENS } from "../theme/tokens";
import { CAUSES } from "../data/causes";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import CauseMeter from "../components/cart/CauseMeter";
import AuthForm from "./auth/AuthForm";

/* ---------------- Checkout ---------------- */
export default function Checkout({ cart, total, user, login, setView, authMode, setAuthMode, onComplete }) {
  const [mode, setMode] = useState(user ? "member" : null);
  const [step, setStep] = useState(user ? "shipping" : "choose");
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", zip: "" });
  const [cause, setCause] = useState(null);
  const [card, setCard] = useState({ number: "", exp: "", cvc: "" });
  const [placed, setPlaced] = useState(false);

  if (cart.length === 0 && !placed) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <p>Your cart is empty.</p>
        <Btn onClick={() => setView("shop")}>Back to shop</Btn>
      </div>
    );
  }

  if (placed) {
    return (
      <div style={{ padding: 60, maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 46 }}>{"✓"}</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: TOKENS.leaf }}>Order placed</h1>
        <p>
          Thanks{shipping.name ? `, ${shipping.name}` : ""}. A confirmation would normally land in your inbox{" — "}
          this is a prototype, so consider it landed.
        </p>
        {cause && (
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
            ${(total * 0.1).toFixed(2)} is on its way to {cause.name}.
          </p>
        )}
        <Btn variant="primary" onClick={() => setView("shop")}>
          Continue shopping
        </Btn>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px 80px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 30, marginBottom: 24, color: TOKENS.leaf }}>Checkout</h1>

      {step === "choose" && (
        <div style={{ display: "grid", gap: 16 }}>
          <Card style={{ padding: 22 }}>
            <h3 style={{ marginTop: 0, fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Continue as guest</h3>
            <p style={{ fontSize: 14 }}>Quick checkout, no account, no saved order history.</p>
            <Btn onClick={() => { setMode("guest"); setStep("shipping"); }}>Guest checkout</Btn>
          </Card>
          <Card style={{ padding: 22 }}>
            <h3 style={{ marginTop: 0, fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Log in or create an account</h3>
            <p style={{ fontSize: 14 }}>Track this order and save it to your profile.</p>
            <AuthForm
              mode={authMode}
              setMode={setAuthMode}
              compact
              onSuccess={(email) => {
                login(email);
                setMode("member");
                setStep("shipping");
              }}
            />
          </Card>
        </div>
      )}

      {step === "shipping" && (
        <Card style={{ padding: 26 }}>
          <h3 style={{ marginTop: 0, fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Shipping details</h3>
          <Input label="Full name" value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} />
          <Input label="Address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Input label="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <Input label="ZIP" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
            </div>
          </div>
          <Btn variant="primary" disabled={!shipping.name || !shipping.address} onClick={() => setStep("cause")}>
            Continue
          </Btn>
        </Card>
      )}

      {step === "cause" && (
        <Card style={{ padding: 26 }}>
          <h3 style={{ marginTop: 0, fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Pick a cause for your 10%</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {CAUSES.map((c) => (
              <div
                key={c.id}
                onClick={() => setCause(c)}
                style={{
                  border: `1.5px solid ${cause?.id === c.id ? c.color : TOKENS.grey}`,
                  background: cause?.id === c.id ? `${c.color}1A` : "transparent",
                  borderRadius: 16,
                  padding: 12,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                <strong>{c.name}</strong>
                <div style={{ opacity: 0.75 }}>{c.blurb}</div>
              </div>
            ))}
          </div>
          <CauseMeter cause={cause} amount={total} />
          <div style={{ marginTop: 16 }}>
            <Btn variant="primary" disabled={!cause} onClick={() => setStep("payment")}>
              Continue
            </Btn>
          </div>
        </Card>
      )}

      {step === "payment" && (
        <Card style={{ padding: 26 }}>
          <h3 style={{ marginTop: 0, fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Payment</h3>
          <p style={{ fontSize: 12, fontFamily: "'Space Mono', monospace", opacity: 0.7 }}>
            Prototype checkout {"—"} no real card is charged.
          </p>
          <Input label="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Input label="Expiry" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} placeholder="MM/YY" />
            </div>
            <div style={{ flex: 1 }}>
              <Input label="CVC" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="123" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", margin: "16px 0" }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Btn
            variant="primary"
            disabled={!card.number || !card.exp || !card.cvc}
            onClick={() => {
              const order = { id: `ORD-${Date.now()}`, date: new Date().toISOString(), items: cart, total, cause: cause?.name };
              onComplete(order);
              setPlaced(true);
            }}
          >
            Place order
          </Btn>
        </Card>
      )}
    </div>
  );
}

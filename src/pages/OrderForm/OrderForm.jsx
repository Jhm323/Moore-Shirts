import React, { useState } from "react";

/* ===========================================================
   COMMON THREAD — Order form (no storefront)

   HOW THIS WORKS
   1. Customer picks a design + size, fills in shipping info,
      hits "Submit order details."
   2. Their order is inserted directly into the Supabase `orders`
      table (RLS-protected — see supabase/migrations/0001_init.sql).
      A Supabase Database Webhook fires on that insert and calls
      the `api/send-order-email` serverless function, which emails
      the order details to you via Resend automatically.
   3. They're then shown a "Complete payment" button that opens
      your Stripe Payment Link in a new tab.
   4. You get the order-notification email + the Stripe payment
      notification, cross-reference them, and place the actual
      order yourself in Printify (Orders → Create Order → Manual),
      pasting in the shipping address from the order email.

   BEFORE YOU DEPLOY THIS — edit the CONFIG block below:
   - STRIPE_PAYMENT_LINK: create a Payment Link in your Stripe
     dashboard for a flat charge matching BASE_PRICE in
     src/data/pricing.js (Products → Payment Links), paste the URL
     here. Since every design is the same price, one link covers
     everything; the XXL surcharge (also in pricing.js) is noted
     to the customer but not auto-added — see note below.
=========================================================== */


import { PRODUCTS, SIZES } from "../../data/products";
import { BASE_PRICE, SIZE_SURCHARGE } from "../../data/pricing";
import ProductIcon from "../../components/art/ProductIcon";
import { supabase } from "../../lib/supabase";
import "./OrderForm.css";

const CONFIG = {
  STRIPE_PAYMENT_LINK: import.meta.env.VITE_STRIPE_PAYMENT_LINK,
};



const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

function Tile({ product, size = 90, selected }) {
  return (
    <div
      className="order-form__tile"
      style={{ "--tile-bg": product.tileBg, "--tile-fg": product.tileFg }}
    >
      {product.image ? (
        <img className="order-form__tile-image" src={product.image} alt={product.name} />
      ) : (
        <ProductIcon icon={product.icon} size={size} color={product.tileFg} />
      )}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="order-form__field">
      <div className="order-form__field-label">
        {label}
      </div>
      <input
        {...props}
        className="order-form__field-input"
      />
    </label>
  );
}

export default function OrderForm({ initialDesignId, onBack, user }) {
  const [designId, setDesignId] = useState(initialDesignId || PRODUCTS[0].id);
  const [size, setSize] = useState("M");
  const [ship, setShip] = useState({ name: "", email: "", address1: "", address2: "", city: "", region: "", postal: "", country: "", phone: "" });
  const [status, setStatus] = useState("form"); // form | submitting | submitted | error
  const [errorMsg, setErrorMsg] = useState("");

  const design = PRODUCTS.find((p) => p.id === designId);
  const price = BASE_PRICE + (SIZE_SURCHARGE[size] || 0);

  function update(field, value) {
    setShip((s) => ({ ...s, [field]: value }));
  }

  const requiredFilled = ship.name && ship.email && ship.address1 && ship.city && ship.region && ship.postal && ship.country;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!requiredFilled) {
      setErrorMsg("Please fill in every required field before submitting.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user ? user.id : null,
        design_id: design.id,
        design_name: design.name,
        size,
        price,
        shipping: ship,
      });
      if (error) throw error;
      setStatus("submitted");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Something went wrong saving your order details. Please try again, or email us directly.");
    }
  }

  return (
    <div className="order-form">
      <style>{FONTS}</style>
      <style>{`* { box-sizing: border-box; } body { margin: 0; }`}</style>

      <div className="order-form__body">
        <span onClick={onBack} className="order-form__back">← Back</span>
        <div className="order-form__brand">Common Thread</div>
        <h1 className="order-form__title">Order a shirt</h1>
        <p className="order-form__intro">
          Every shirt is printed to order once we receive your details and payment — no batches, no inventory.
          Priced at cost: ${BASE_PRICE.toFixed(2)} standard sizes, ${(BASE_PRICE + (SIZE_SURCHARGE.XXL || 0)).toFixed(2)} for XXL.
        </p>

        {status === "submitted" ? (
          <div className="order-form__panel">
            <div className="order-form__check">{"✓"}</div>
            <h2 className="order-form__panel-title">Order details received</h2>
            <p className="order-form__panel-copy">
              One step left — complete payment below (${price.toFixed(2)} for a {size} {design.name}). Once payment comes through
              we'll place your print order and email you tracking when it ships.
            </p>
            <a
              href={CONFIG.STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="order-form__pay-btn"
            >
              Complete payment {"→"}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="order-form__panel">
              <div className="order-form__panel-label">
                Choose a design
              </div>
              <div className="order-form__design-grid">
                {PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setDesignId(p.id)}
                    className={`order-form__design-item ${designId === p.id ? "order-form__design-item--selected" : ""}`.trim()}
                  >
                    <Tile product={p} size={54} selected={designId === p.id} />
                  </div>
                ))}
              </div>
              <div className="order-form__design-name">{design.name}</div>
            </div>

            <div className="order-form__panel">
              <div className="order-form__panel-label">
                Size
              </div>
              <div className="order-form__size-row">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`order-form__size-chip ${size === s ? "order-form__size-chip--selected" : ""}`.trim()}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {SIZE_SURCHARGE[size] ? (
                <p className="order-form__size-note">+${SIZE_SURCHARGE[size]} for {size}</p>
              ) : null}
            </div>

            <div className="order-form__panel">
              <div className="order-form__panel-label">
                Shipping details
              </div>
              <Field label="Full name" required value={ship.name} onChange={(e) => update("name", e.target.value)} />
              <Field label="Email" type="email" required value={ship.email} onChange={(e) => update("email", e.target.value)} />
              <Field label="Address line 1" required value={ship.address1} onChange={(e) => update("address1", e.target.value)} />
              <Field label="Address line 2 (optional)" value={ship.address2} onChange={(e) => update("address2", e.target.value)} />
              <div className="order-form__field-row">
                <div className="order-form__field-col">
                  <Field label="City" required value={ship.city} onChange={(e) => update("city", e.target.value)} />
                </div>
                <div className="order-form__field-col">
                  <Field label="State / region" required value={ship.region} onChange={(e) => update("region", e.target.value)} />
                </div>
              </div>
              <div className="order-form__field-row">
                <div className="order-form__field-col">
                  <Field label="Postal code" required value={ship.postal} onChange={(e) => update("postal", e.target.value)} />
                </div>
                <div className="order-form__field-col">
                  <Field label="Country" required value={ship.country} onChange={(e) => update("country", e.target.value)} />
                </div>
              </div>
              <Field label="Phone (optional)" value={ship.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>

            <div className="order-form__summary">
              <div>
                <div className="order-form__summary-title">{design.name}, size {size}</div>
                <div className="order-form__summary-sub">Printed to order, no markup</div>
              </div>
              <div className="order-form__summary-price">${price.toFixed(2)}</div>
            </div>

            {errorMsg && <p className="order-form__error">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className={`order-form__submit ${status === "submitting" ? "order-form__submit--submitting" : ""}`.trim()}
            >
              {status === "submitting" ? "Sending…" : "Submit order details"}
            </button>
            <p className="order-form__submit-note">
              You'll pay on the next screen. Your card isn't charged until you complete that step.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

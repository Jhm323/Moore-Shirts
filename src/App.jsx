import React, { useState, useRef } from "react";
import { TOKENS, FONTS } from "./theme/tokens";
import { PRODUCTS } from "./data/products";
import { useCart } from "./hooks/useCart";
import { useAuth } from "./hooks/useAuth";
import { useLiked } from "./hooks/useLiked";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import Landing from "./pages/Landing";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import AuthScreen from "./pages/auth/AuthScreen";

/* ---------------------------------------------------------
   COMMON THREAD — t-shirt shop prototype
   Naturalist wildlife line only. Soft, rounded, calming visual
   language inspired by canopy-and-sky photography.
   All data (accounts, likes, orders) persists via window.storage.
   Payment is mocked — no real card processing.
--------------------------------------------------------- */

/* =========================================================
   MAIN APP
========================================================= */
export default function App() {
  const [view, setView] = useState("landing"); // landing | shop | product | cart | checkout | profile | auth
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [toast, setToast] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const toastTimer = useRef(null);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }

  const { cart, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart } = useCart();
  const { user, login, logout, purchases, addPurchase } = useAuth();
  const { liked, toggleLike } = useLiked(user, showToast);

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId);

  return (
    <div style={{ minHeight: "100vh", background: TOKENS.cream, color: TOKENS.ink, fontFamily: "'Inter', sans-serif" }}>
      <style>{FONTS}</style>
      <style>{`
        * { box-sizing: border-box; }
        a { color: inherit; }
        ::selection { background: ${TOKENS.gold}; }
        body { margin: 0; }
        button:focus-visible, input:focus-visible { outline: 2px solid ${TOKENS.leaf}; outline-offset: 2px; }
      `}</style>

      <Header view={view} setView={setView} cartCount={cartCount} user={user} onCartClick={() => setCartOpen(true)} />

      {toast && (
        <div
          style={{
            position: "fixed",
            top: 76,
            right: 20,
            zIndex: 200,
            background: TOKENS.leaf,
            color: TOKENS.cream,
            padding: "10px 18px",
            borderRadius: 999,
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
          }}
        >
          {toast}
        </div>
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          removeFromCart={removeFromCart}
          updateQty={updateQty}
          total={cartTotal}
          onCheckout={() => {
            setCartOpen(false);
            setView("checkout");
          }}
        />
      )}

      <main>
        {view === "landing" && (
          <Landing
            onShop={() => setView("shop")}
            onProduct={(id) => {
              setSelectedProductId(id);
              setView("product");
            }}
            liked={liked}
            toggleLike={toggleLike}
          />
        )}
        {view === "shop" && (
          <Shop
            onProduct={(id) => {
              setSelectedProductId(id);
              setView("product");
            }}
            liked={liked}
            toggleLike={toggleLike}
          />
        )}
        {view === "product" && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            liked={liked.includes(selectedProduct.id)}
            toggleLike={() => toggleLike(selectedProduct.id)}
            onAdd={(size) => {
              addToCart(selectedProduct.id, size);
              showToast("Added to cart");
              setCartOpen(true);
            }}
            onBack={() => setView("shop")}
          />
        )}
        {view === "checkout" && (
          <Checkout
            cart={cart}
            total={cartTotal}
            user={user}
            login={login}
            setView={setView}
            authMode={authMode}
            setAuthMode={setAuthMode}
            onComplete={async (order) => {
              if (user) {
                await addPurchase(order);
              }
              clearCart();
              showToast("Order placed — thank you");
            }}
          />
        )}
        {view === "profile" && (
          <Profile
            user={user}
            logout={logout}
            liked={liked}
            purchases={purchases}
            setView={setView}
            toggleLike={toggleLike}
            onProduct={(id) => {
              setSelectedProductId(id);
              setView("product");
            }}
          />
        )}
        {view === "auth" && (
          <AuthScreen mode={authMode} setMode={setAuthMode} login={login} setView={setView} showToast={showToast} />
        )}
      </main>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import { FONTS } from "./theme/tokens";
import { useAuth } from "./hooks/useAuth";
import { useLiked } from "./hooks/useLiked";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing";
import Shop from "./pages/Shop";
import OrderForm from "./pages/OrderForm";
import AuthPanel from "./pages/AuthPanel";
import "./App.css";

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
    <div className="app">
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

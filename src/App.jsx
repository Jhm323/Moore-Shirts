import { useState } from "react";
import { FONTS } from "./theme/tokens";
import { useAuth } from "./hooks/useAuth";
import { useLiked } from "./hooks/useLiked";
import { useProfile } from "./hooks/useProfile";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing/Landing";
import Shop from "./pages/Shop/Shop";
import OrderForm from "./pages/OrderForm/OrderForm";
import AuthPanel from "./pages/AuthPanel/AuthPanel";
import ProfileModal from "./components/profile/ProfileModal";
import DesignLightbox from "./components/lightbox/DesignLightbox";
import "./App.css";

export default function App() {
  const [view, setView] = useState("landing");
  const [presetDesignId, setPresetDesignId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const auth = useAuth();
  const { liked, toggleLike } = useLiked(auth.user);
  const { profile, updateProfile } = useProfile(auth.user);

  function goOrder(id) {
    setPresetDesignId(id);
    setView("order");
  }

  return (
    <div className="app">
      <style>{FONTS}</style>
      <Header onLogoClick={() => setView("landing")} onShopClick={() => setView("shop")} user={auth.user} profile={profile} onAuthClick={() => setView("auth")} onProfileClick={() => setProfileOpen(true)} />
      {view === "landing" && <Landing onShop={() => setView("shop")} onPreview={(id) => setPreviewId(id)} />}
      {view === "shop" && <Shop liked={liked} toggleLike={toggleLike} onOrder={goOrder} user={auth.user} onRequireSignIn={() => setView("auth")} onPreview={(id) => setPreviewId(id)} />}
      {view === "order" && <OrderForm initialDesignId={presetDesignId} onBack={() => setView("shop")} user={auth.user} />}
      {view === "auth" && <AuthPanel auth={auth} onDone={() => setView("shop")} />}
      {profileOpen && auth.user && (
        <ProfileModal
          user={auth.user}
          profile={profile}
          updateProfile={updateProfile}
          onClose={() => setProfileOpen(false)}
          onSignOut={() => { auth.signOut(); setProfileOpen(false); }}
        />
      )}
      {previewId && (
        <DesignLightbox
          startId={previewId}
          onClose={() => setPreviewId(null)}
          onOrder={(id) => { setPreviewId(null); goOrder(id); }}
        />
      )}
      <Footer />
    </div>
  );
}

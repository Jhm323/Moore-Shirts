import React from "react";
import Avatar from "../ui/Avatar";
import "./Header.css";

export default function Header({ onLogoClick, onShopClick, user, profile, onAuthClick, onProfileClick }) {
  return (
    <header className="header">
      <div onClick={onLogoClick} className="header__logo">
        Common Thread
      </div>
      <nav className="header__nav">
        <span className="header__link" onClick={onShopClick}>Shop</span>
        {user ? (
          <div className="header__user" onClick={onProfileClick}>
            <Avatar label={profile?.display_name || user.email} size={32} />
            <span className="header__user-name">
              {profile?.display_name || user.email.split("@")[0]}
            </span>
          </div>
        ) : (
          <span onClick={onAuthClick} className="header__signin">
            Sign in
          </span>
        )}
      </nav>
    </header>
  );
}

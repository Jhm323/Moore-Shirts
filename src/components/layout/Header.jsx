import React from "react";
import "./Header.css";

export default function Header({ onLogoClick, onShopClick, user, onAuthClick, onSignOut }) {
  return (
    <header className="header">
      <div onClick={onLogoClick} className="header__logo">
        Common Thread
      </div>
      <nav className="header__nav">
        <span className="header__link" onClick={onShopClick}>Shop</span>
        {user ? (
          <span className="header__link" onClick={onSignOut} title={user.email}>Sign out</span>
        ) : (
          <span onClick={onAuthClick} className="header__signin">
            Sign in
          </span>
        )}
      </nav>
    </header>
  );
}

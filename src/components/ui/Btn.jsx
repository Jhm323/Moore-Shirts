import React from "react";
import "./Btn.css";

export default function Btn({ children, onClick, variant = "primary", className, disabled, type = "button" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn--${variant} ${disabled ? "btn--disabled" : ""} ${className || ""}`.trim()}
    >
      {children}
    </button>
  );
}

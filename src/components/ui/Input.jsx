import React from "react";
import "./Input.css";

export default function Input({ label, ...props }) {
  return (
    <label className="input">
      <div className="input__label">{label}</div>
      <input {...props} className="input__control" />
    </label>
  );
}

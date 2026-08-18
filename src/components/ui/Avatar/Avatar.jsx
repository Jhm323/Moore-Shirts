import React from "react";
import { getInitials, getAvatarColor } from "../../../lib/avatar";
import "./Avatar.css";

export default function Avatar({ label, size = 36, onClick }) {
  return (
    <div
      className="avatar"
      style={{ "--avatar-color": getAvatarColor(label || ""), "--avatar-size": `${size}px` }}
      onClick={onClick}
      title={label}
    >
      {getInitials(label)}
    </div>
  );
}

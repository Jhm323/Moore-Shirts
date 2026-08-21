import React from "react";
import { SITE_TITLE } from "../../../data/site";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      {SITE_TITLE.toUpperCase()} {"—"} prototype build. Payments are mocked; no real charges occur.
    </footer>
  );
}

import React from "react";
import AuthForm from "./AuthForm";

/* ---------------- Auth (standalone screen) ---------------- */
export default function AuthScreen({ mode, setMode, login, setView, showToast }) {
  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: "0 20px" }}>
      <AuthForm
        mode={mode}
        setMode={setMode}
        onSuccess={(email) => {
          login(email);
          showToast(`Welcome back, ${email}`);
          setView("profile");
        }}
      />
    </div>
  );
}

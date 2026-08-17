import React, { useState } from "react";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import "./AuthPanel.css";

function Field({ label, ...props }) {
  return (
    <label className="auth-panel__field">
      <div className="auth-panel__field-label">
        {label}
      </div>
      <input
        {...props}
        className="auth-panel__field-input"
      />
    </label>
  );
}

export default function AuthPanel({ auth, onDone }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and a password (4+ characters).");
      return;
    }
    const result = mode === "signin" ? await auth.signIn(email, password) : await auth.signUp(email, password);
    if (result.error) setError(result.error);
    else onDone();
  }

  return (
    <div className="auth-panel">
      <Card className="auth-panel__card">
        <h2 className="auth-panel__title">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h2>
        <form onSubmit={handleSubmit}>
          <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="auth-panel__error">{error}</p>}
          <Btn type="submit" variant="primary">{mode === "signin" ? "Sign in" : "Create account"}</Btn>
        </form>
        <p className="auth-panel__toggle">
          {mode === "signin" ? "New here? " : "Already have an account? "}
          <span className="auth-panel__toggle-link" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Create an account" : "Sign in"}
          </span>
        </p>
      </Card>
    </div>
  );
}

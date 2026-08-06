import React, { useState } from "react";
import { TOKENS } from "../../theme/tokens";
import { getJSON, setJSON } from "../../lib/storage";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Btn from "../../components/ui/Btn";

/* Shared auth form used both standalone and inside checkout */
export default function AuthForm({ mode, setMode, onSuccess, compact }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wantTwoFA, setWantTwoFA] = useState(true);
  const [stage, setStage] = useState("form"); // form | verify
  const [sentCode, setSentCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and a password (4+ characters).");
      return;
    }
    if (mode === "signup") {
      const existing = await getJSON(`account:${email}`);
      if (existing) {
        setError("An account with that email already exists — log in instead.");
        return;
      }
      await setJSON(`account:${email}`, { email, password, twoFA: wantTwoFA });
      await setJSON(`liked:${email}`, []);
      await setJSON(`purchases:${email}`, []);
      proceedTwoFA(wantTwoFA);
    } else {
      const account = await getJSON(`account:${email}`);
      if (!account || account.password !== password) {
        setError("No matching account, or wrong password.");
        return;
      }
      proceedTwoFA(account.twoFA);
    }
  }

  function proceedTwoFA(enabled) {
    if (!enabled) {
      onSuccess(email);
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(code);
    setStage("verify");
  }

  function handleVerify(e) {
    e.preventDefault();
    if (enteredCode === sentCode) {
      onSuccess(email);
    } else {
      setError("That code doesn't match. Try again.");
    }
  }

  if (stage === "verify") {
    return (
      <Card style={{ padding: 28 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, marginTop: 0, color: TOKENS.leaf }}>Verify it's you</h2>
        <p style={{ fontSize: 14 }}>
          This is a prototype, so instead of emailing you, here's your 2FA code: <strong style={{ fontFamily: "'Space Mono', monospace" }}>{sentCode}</strong>
        </p>
        <form onSubmit={handleVerify}>
          <Input label="6-digit code" value={enteredCode} onChange={(e) => setEnteredCode(e.target.value)} maxLength={6} />
          {error && <p style={{ color: "#B5482F", fontSize: 13 }}>{error}</p>}
          <Btn type="submit" variant="primary">
            Verify & continue
          </Btn>
        </form>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 28 }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, marginTop: 0, color: TOKENS.leaf }}>
        {mode === "login" ? "Log in" : "Create account"}
      </h2>
      <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {mode === "signup" && (
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: "'Space Mono', monospace", fontSize: 12, marginBottom: 16 }}>
            <input type="checkbox" checked={wantTwoFA} onChange={(e) => setWantTwoFA(e.target.checked)} />
            Require a 2FA code at login
          </label>
        )}
        {error && <p style={{ color: "#B5482F", fontSize: 13 }}>{error}</p>}
        <Btn type="submit" variant="primary" style={{ width: compact ? "100%" : "auto" }}>
          {mode === "login" ? "Log in" : "Create account"}
        </Btn>
      </form>
      <p style={{ fontSize: 13, marginTop: 14 }}>
        {mode === "login" ? "New here? " : "Already have an account? "}
        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Create an account" : "Log in"}
        </span>
      </p>
    </Card>
  );
}

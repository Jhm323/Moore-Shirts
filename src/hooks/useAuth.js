import { useState, useEffect } from "react";
import { getJSON, setJSON } from "../lib/storage";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const session = await getJSON("session");
      if (session?.email) setUser({ email: session.email });
    })();
  }, []);

  async function signUp(email, password) {
    const existing = await getJSON(`account:${email}`);
    if (existing) return { error: "An account with that email already exists — sign in instead." };
    await setJSON(`account:${email}`, { email, password });
    await setJSON("session", { email });
    setUser({ email });
    return {};
  }

  async function signIn(email, password) {
    const account = await getJSON(`account:${email}`);
    if (!account || account.password !== password) return { error: "No matching account, or wrong password." };
    await setJSON("session", { email });
    setUser({ email });
    return {};
  }

  async function signOut() {
    await setJSON("session", null);
    setUser(null);
  }

  return { user, signUp, signIn, signOut };
}

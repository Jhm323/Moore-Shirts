import { useState, useEffect } from "react";
import { getJSON, setJSON } from "../lib/storage";

export function useAuth() {
  const [user, setUser] = useState(null); // {email}
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!user) {
      setPurchases([]);
      return;
    }
    (async () => {
      const p = await getJSON(`purchases:${user.email}`);
      setPurchases(p || []);
    })();
  }, [user]);

  function login(email) {
    setUser({ email });
  }
  function logout() {
    setUser(null);
  }
  async function addPurchase(order) {
    const next = [order, ...purchases];
    setPurchases(next);
    await setJSON(`purchases:${user.email}`, next);
  }

  return { user, login, logout, purchases, addPurchase };
}

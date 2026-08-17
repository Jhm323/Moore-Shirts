import { useState, useEffect } from "react";
import { getJSON, setJSON } from "../lib/storage";

export function useLiked(user) {
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    if (!user) { setLiked([]); return; }
    (async () => {
      const l = await getJSON(`liked:${user.email}`);
      setLiked(l || []);
    })();
  }, [user]);

  async function toggleLike(productId) {
    const next = liked.includes(productId) ? liked.filter((id) => id !== productId) : [...liked, productId];
    setLiked(next);
    await setJSON(`liked:${user.email}`, next);
  }

  return { liked, toggleLike };
}

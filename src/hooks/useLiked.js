import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useLiked(user) {
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { setLiked([]); return; }
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("liked_products")
        .select("product_id")
        .eq("user_id", user.id);
      if (error) {
        console.error("Failed to load liked products", error);
        setLiked([]);
      } else {
        setLiked(data.map((row) => row.product_id));
      }
      setLoading(false);
    })();
  }, [user]);

  async function toggleLike(productId) {
    if (!user) return;
    const isLiked = liked.includes(productId);
    // optimistic update, reverted below if the write actually fails
    setLiked((prev) => (isLiked ? prev.filter((id) => id !== productId) : [...prev, productId]));

    if (isLiked) {
      const { error } = await supabase
        .from("liked_products")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      if (error) {
        console.error("Failed to unlike", error);
        setLiked((prev) => [...prev, productId]);
      }
    } else {
      // upsert + ignoreDuplicates so a double-click or race against the
      // table's unique(user_id, product_id) constraint doesn't surface as
      // a hard error
      const { error } = await supabase
        .from("liked_products")
        .upsert(
          { user_id: user.id, product_id: productId },
          { onConflict: "user_id,product_id", ignoreDuplicates: true }
        );
      if (error) {
        console.error("Failed to like", error);
        setLiked((prev) => prev.filter((id) => id !== productId));
      }
    }
  }

  return { liked, toggleLike, loading };
}

import { useState, useMemo } from "react";
import { PRODUCTS } from "../data/products";

export function useCart() {
  const [cart, setCart] = useState([]); // {productId, size, qty}

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + (PRODUCTS.find((p) => p.id === i.productId)?.price || 0) * i.qty, 0),
    [cart]
  );

  function addToCart(productId, size) {
    setCart((c) => {
      const existing = c.find((i) => i.productId === productId && i.size === size);
      if (existing) return c.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { productId, size, qty: 1 }];
    });
  }
  function removeFromCart(idx) {
    setCart((c) => c.filter((_, i) => i !== idx));
  }
  function updateQty(idx, qty) {
    if (qty < 1) return removeFromCart(idx);
    setCart((c) => c.map((i, ix) => (ix === idx ? { ...i, qty } : i)));
  }
  function clearCart() {
    setCart([]);
  }

  return { cart, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart };
}

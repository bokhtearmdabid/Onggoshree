import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ productId, name, price, category, qty }]

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          qty,
        },
      ];
    });
  };

  const increment = (productId) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decrement = (productId) => {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0) // drop the item if quantity hits 0
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, increment, decrement, removeFromCart, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);